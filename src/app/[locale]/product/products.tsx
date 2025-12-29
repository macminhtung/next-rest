'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import { useDebounce, useScreen } from '@/common/hooks';
import { Pencil, X, Plus, Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  TProduct,
  useGetPaginatedProductsQuery,
  useDeleteProductMutation,
} from '@/react-query/product';
import { TableC, AvatarC, ButtonC, DialogC, InputC, type THeader } from '@/components/ui-customize';
import ProductForm from '@/app/[locale]/product/form';
import type { TRequestConfig, TGetPaginatedRecords } from '@/react-query/types';

const initFormValues: TProduct = {
  id: '',
  image: '',
  name: '',
  description: '',
};

export const Products = (props: { queryConfig: TRequestConfig<TGetPaginatedRecords> }) => {
  const { queryConfig } = props;
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<TProduct | null>(null);
  const [keySearch, setKeySearch] = useState<string>('');
  const debounceKeySearch = useDebounce(keySearch);
  const [params, setParams] = useState<TGetPaginatedRecords>(queryConfig.params);
  const authUser = useAppStore((state) => state.authUser);
  const isAdmin = useMemo(() => authUser.roleId === 1, [authUser.roleId]);
  const { md } = useScreen();

  const { data, isLoading } = useGetPaginatedProductsQuery({
    params: { ...params, keySearch: debounceKeySearch },
  });

  const deleteProductMutation = useDeleteProductMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['GetPaginatedProducts'] }),
  });

  const headers = useMemo(() => {
    const initHeaders: THeader<TProduct>[] = [
      {
        key: 'image',
        title: 'Image',
        render: (record) => (
          <AvatarC
            src={record.image || '/product.png'}
            className='rounded-none size-14 p-1 border-0'
          />
        ),
      },
      { key: 'name', title: 'Name' },
      { key: 'description', title: 'Description' },
    ];

    if (isAdmin)
      initHeaders.push({
        key: 'id',
        title: '',
        width: '120px',
        render: (record) => (
          <div className='flex gap-3'>
            <ButtonC variant={'outline'} onClick={() => setFormValues(record)}>
              <Pencil className='size-4' />
            </ButtonC>
            <ButtonC
              variant={'outline'}
              className='text-red-500'
              onClick={() => deleteProductMutation.mutate(record.id)}
            >
              <X className='size-4' />
            </ButtonC>
          </div>
        ),
      });

    return initHeaders;
  }, [isAdmin, deleteProductMutation]);

  const { records = [], page, total, take } = data! || {};

  return (
    <div className='flex flex-col w-full'>
      {isAdmin && (
        <div className='flex gap-5'>
          <ButtonC className='mb-5 w-fit' onClick={() => setFormValues(initFormValues)}>
            <Plus />
            <p className='max-sm:hidden '>Create product</p>
          </ButtonC>
          <InputC
            className='w-full'
            startItem={<Search className='ml-2 size-4' />}
            onChange={(e) => setKeySearch(e.target.value)}
          />
          <DialogC
            open={!!formValues}
            onOpenChange={() => setFormValues(null)}
            title='Dialog Product'
            showFooter={false}
          >
            {formValues && (
              <ProductForm formValues={formValues} closeDialog={() => setFormValues(null)} />
            )}
          </DialogC>
        </div>
      )}
      {md ? (
        <TableC
          loading={isLoading}
          headers={headers}
          className='[&>div]:max-h-75'
          rowKey='name'
          rowRecords={records}
          pagination={{ page, total, take, setPagination: setParams }}
        />
      ) : (
        <div className='grid grid-cols-1 gap-8 mt-5 sm:grid-cols-2'>
          {records.map((record) => (
            <div key={record.id} className='flex flex-col gap-3 items-center border p-5 rounded-md'>
              <AvatarC
                src={record.image || '/product.png'}
                className='rounded-none size-20 border-0'
              />
              <div className='flex gap-3'>
                <p>Name:</p>
                <p>{record.name}</p>
              </div>
              <div className='flex gap-3'>
                <p>Description:</p>
                <p>{record.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
