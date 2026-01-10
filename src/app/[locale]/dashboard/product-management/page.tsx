'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/store';
import { useTranslations } from 'next-intl';
import { useDebounce, useScreen } from '@/common/hooks';
import { SquarePen, Trash, Plus, Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { TableC, AvatarC, ButtonC, DialogC, InputC, AlertDialogC } from '@/components/ui-customize';
import {
  TProduct,
  useGetPaginatedProductsQuery,
  useDeleteProductMutation,
} from '@/react-query/product';
import ProductForm from '@/app/[locale]/dashboard/product-management/form';
import { PaginationC } from '@/components/ui-customize';

import type { TGetPaginatedRecords } from '@/react-query/types';
import type { THeader } from '@/components/ui-customize';

const initFormValues: TProduct = {
  id: '',
  image: '',
  name: '',
  description: '',
  unitPrice: 0,
};

const ProductManagementPage = () => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const router = useRouter();
  const curLocale = useLocale();
  const [formValues, setFormValues] = useState<TProduct | null>(null);
  const [keySearch, setKeySearch] = useState<string>('');
  const debounceKeySearch = useDebounce(keySearch);
  const [params, setParams] = useState<TGetPaginatedRecords>();
  const authUser = useAppStore((state) => state.authUser);
  const { md } = useScreen();
  const [deleteId, setDeleteId] = useState<string>('');

  // Prevent access to this page if not admin
  const isAdmin = useMemo(() => authUser.roleId === 1, [authUser.roleId]);
  useEffect(() => {
    if (!isAdmin) router.push(`/${curLocale}/dashboard`);
  }, [curLocale, isAdmin, router]);

  // Fetch paginated products
  const { data, isLoading } = useGetPaginatedProductsQuery({
    params: { ...params, keySearch: debounceKeySearch },
  });
  const { records = [], page, total, take } = data! || {};

  // Delete product mutation
  const deleteProductMutation = useDeleteProductMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetPaginatedProducts'] });
      setDeleteId('');
    },
  });

  // #=======================#
  // # ==> TABLE HEADERS <== #
  // #=======================#
  const headers: THeader<TProduct>[] = [
    {
      key: 'image',
      title: 'Image',
      render: (record) => (
        <AvatarC
          src={record.image || '/product.png'}
          className='rounded-none size-16 p-1 border-0'
        />
      ),
      width: '10%',
    },
    {
      key: 'name',
      title: 'Name',
      width: '12%',
      render: (record) => (
        <p className='font-semibold text-gray-700 dark:text-gray-200'>{record.name}</p>
      ),
    },
    {
      key: 'description',
      title: 'Description',
      width: 'auto',
      render: (record) => <p className=' text-gray-700 dark:text-gray-200'>{record.description}</p>,
    },
    {
      key: 'unitPrice',
      title: 'UnitPrice',
      width: '12%',
      render: (record) => <p className='font-bold text-orange-400'>${record.unitPrice}</p>,
    },
    {
      key: 'id',
      title: '',
      width: '120px',
      render: (record) => (
        <div className='flex gap-3'>
          <ButtonC variant='secondary' size='sm' onClick={() => setFormValues(record)}>
            <SquarePen className='size-5' />
          </ButtonC>
          <ButtonC
            variant='secondary'
            size='sm'
            className='text-red-500'
            onClick={() => setDeleteId(record.id)}
          >
            <Trash className='size-5' />
          </ButtonC>
        </div>
      ),
    },
  ];

  return (
    <div className='flex flex-col size-full'>
      <p className='text-3xl md:text-4xl font-semibold my-4 text-shadow-neon'>
        {t('productManagement')}
      </p>
      <div className='flex flex-col flex-1 w-full overflow-hidden'>
        <div className='flex gap-5 py-1 mb-5'>
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
            className='min-w-md'
            headers={headers}
            loading={isLoading}
            rowRecords={records}
            rowKey='id'
            pagination={{ page, total, take, setPagination: setParams }}
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

                    <div className='flex gap-3'>
                      <ButtonC variant='secondary' onClick={() => setFormValues(record)}>
                        <SquarePen className='size-5' />
                      </ButtonC>
                      <ButtonC
                        variant='secondary'
                        className='text-red-500'
                        onClick={() => setDeleteId(record.id)}
                      >
                        <Trash className='size-5' />
                      </ButtonC>
                    </div>
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
    </div>
  );
};

export default ProductManagementPage;
