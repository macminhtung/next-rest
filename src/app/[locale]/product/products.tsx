'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import { useDebounce } from '@/common/hooks';
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
          <AvatarC src={record.image || '/product.png'} className='rounded-md size-[50px] p-1' />
        ),
      },
      { key: 'name', title: 'Name' },
      { key: 'description', title: 'Description' },
    ];

    if (isAdmin)
      initHeaders.push({
        key: 'id',
        title: 'Action',
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
            Create product
          </ButtonC>
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
          <InputC
            startItem={<Search className='ml-2 size-4' />}
            onChange={(e) => setKeySearch(e.target.value)}
          />
        </div>
      )}
      <TableC
        loading={isLoading}
        headers={headers}
        className='[&>div]:max-h-[300px]'
        rowKey='name'
        rowRecords={records}
        pagination={{ page, total, take, setPagination: setParams }}
      />
    </div>
  );
};
