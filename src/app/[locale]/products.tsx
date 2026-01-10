'use client';

import { useState } from 'react';
import { useDebounce } from '@/common/hooks';
import { Search } from 'lucide-react';
import { AvatarC, InputC } from '@/components/ui-customize';
import { useGetPaginatedProductsQuery } from '@/react-query/product';
import { PaginationC } from '@/components/ui-customize';
import { LoadingOverlay } from '@/components/LoadingOverlay';

import type { TRequestConfig, TGetPaginatedRecords } from '@/react-query/types';

export const Products = (props: { queryConfig: TRequestConfig<TGetPaginatedRecords> }) => {
  const { queryConfig } = props;
  const [keySearch, setKeySearch] = useState<string>('');
  const debounceKeySearch = useDebounce(keySearch);
  const [params, setParams] = useState<TGetPaginatedRecords>(queryConfig.params);

  const { data, isLoading } = useGetPaginatedProductsQuery({
    params: { ...params, keySearch: debounceKeySearch },
  });

  const { records = [], page, total, take } = data! || {};

  return (
    <div className='flex flex-col flex-1 w-full overflow-hidden relative'>
      {isLoading && <LoadingOverlay className='[&>svg]:size-20' />}
      <div className='flex gap-5 py-1 mb-5'>
        <InputC
          className='w-full md:max-w-100 ring-0'
          startItem={<Search className='ml-4 size-4' />}
          onChange={(e) => setKeySearch(e.target.value)}
          placeholder='Search products'
        />
      </div>

      <div className='flex flex-col flex-1 overflow-hidden'>
        <div className='flex-1 overflow-auto'>
          <div className='grid grid-cols-1 h-fit gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
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
              </div>
            ))}
          </div>
        </div>
        <PaginationC page={page} total={total} take={take} setPagination={setParams} />
      </div>
    </div>
  );
};
