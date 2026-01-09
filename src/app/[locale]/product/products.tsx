'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import { useTranslations } from 'next-intl';
import { useDebounce, useScreen } from '@/common/hooks';
import { Pencil, X, Plus, Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { TableC, AvatarC, ButtonC, DialogC, InputC, AlertDialogC } from '@/components/ui-customize';
import {
  TProduct,
  useGetPaginatedProductsQuery,
  useDeleteProductMutation,
} from '@/react-query/product';
import ProductForm from '@/app/[locale]/product/form';
import { PaginationC } from '@/components/ui-customize';

import type { TRequestConfig, TGetPaginatedRecords } from '@/react-query/types';
import type { THeader } from '@/components/ui-customize';

const initFormValues: TProduct = {
  id: '',
  image: '',
  name: '',
  description: '',
  unitPrice: 0,
};

export const Products = (props: { queryConfig: TRequestConfig<TGetPaginatedRecords> }) => {
  const { queryConfig } = props;
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<TProduct | null>(null);
  const [keySearch, setKeySearch] = useState<string>('');
  const debounceKeySearch = useDebounce(keySearch);
  const [params, setParams] = useState<TGetPaginatedRecords>(queryConfig.params);
  const authUser = useAppStore((state) => state.authUser);
  const isAdmin = useMemo(() => authUser.roleId === 1, [authUser.roleId]);
  const { md } = useScreen();
  const [deleteId, setDeleteId] = useState<string>('');

  const { data, isLoading } = useGetPaginatedProductsQuery({
    params: { ...params, keySearch: debounceKeySearch },
  });

  const deleteProductMutation = useDeleteProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetPaginatedProducts'] });
      setDeleteId('');
    },
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
        width: '10%',
      },
      { key: 'name', title: 'Name', width: '12%' },
      { key: 'description', title: 'Description', width: 'auto' },
      { key: 'unitPrice', title: 'UnitPrice', width: '12%' },
    ];

    if (isAdmin) {
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
              onClick={() => setDeleteId(record.id)}
            >
              <X className='size-4' />
            </ButtonC>
          </div>
        ),
      });
    }

    return initHeaders;
  }, [isAdmin, setDeleteId]);

  const { records = [], page, total, take } = data! || {};

  return (
    <div className='flex flex-col flex-1 w-full overflow-hidden'>
      <div className='flex gap-5 py-1 mb-5'>
        {/* #=======================================# */}
        {/* # ==> [ADMIN] CREATE/UPDATE PRODUCT <== # */}
        {/* #=======================================# */}
        {isAdmin && (
          <>
            <ButtonC className='w-fit' onClick={() => setFormValues(initFormValues)}>
              <Plus />
              <p className='max-sm:hidden '>{t('createProduct')}</p>
            </ButtonC>

            <DialogC
              open={!!formValues}
              onOpenChange={() => setFormValues(null)}
              title={formValues?.id ? t('updateProduct') : t('createProduct')}
              showFooter={false}
            >
              {formValues && (
                <ProductForm formValues={formValues} closeDialog={() => setFormValues(null)} />
              )}
            </DialogC>
          </>
        )}

        <InputC
          className='w-full md:max-w-100 ring-0'
          startItem={<Search className='ml-4 size-4' />}
          onChange={(e) => setKeySearch(e.target.value)}
          placeholder='Search products'
        />
      </div>

      {md ? (
        // #=================#
        // # ==> DESKTOP <== #
        // #=================#
        <TableC
          loading={isLoading}
          headers={headers}
          rowKey='id'
          rowRecords={records}
          pagination={{ page, total, take, setPagination: setParams }}
          className='min-w-250 table-fixed'
        />
      ) : (
        // #================#
        // # ==> MOBILE <== #
        // #================#
        <div className='flex flex-col flex-1 overflow-hidden'>
          <div className='flex-1 overflow-auto'>
            <div className='grid grid-cols-1 h-fit gap-8 sm:grid-cols-2'>
              {records.map((record) => (
                <div
                  key={record.id}
                  className='flex flex-col gap-3 items-center bg-neutral-200 dark:bg-neutral-900 shadow-md p-5 rounded-md'
                >
                  <AvatarC
                    src={record.image || '/product.png'}
                    className='rounded-none size-20 border-0'
                  />
                  <div className='flex gap-3'>
                    <p className='font-semibold'>{record.name}</p>
                  </div>
                  <div className='flex gap-3'>
                    <p>{record.description}</p>
                  </div>
                  {isAdmin && (
                    <div className='flex gap-3'>
                      <ButtonC variant='outline' onClick={() => setFormValues(record)}>
                        <Pencil className='size-4' />
                      </ButtonC>
                      <ButtonC
                        variant='outline'
                        className='text-red-500'
                        onClick={() => setDeleteId(record.id)}
                      >
                        <X className='size-4' />
                      </ButtonC>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <PaginationC page={page} total={total} take={take} setPagination={setParams} />
        </div>
      )}

      {/* #===============================# */}
      {/* # ==> CONFIRM DELETE DIALOG <== # */}
      {/* #===============================# */}
      <AlertDialogC
        isOpen={!!deleteId}
        title={t('Are you absolutely sure about deleting this product?')}
        cancelAction={() => setDeleteId('')}
        continueAction={() => deleteProductMutation.mutateAsync(deleteId)}
        isLoading={deleteProductMutation.isPending}
      />
    </div>
  );
};
