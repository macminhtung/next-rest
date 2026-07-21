'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/common/hooks';
import { Search } from 'lucide-react';
import { AvatarC, InputC } from '@/components/ui-customize';
import { useGetPaginatedProductsQuery } from '@/react-query/product';
import { PaginationC } from '@/components/ui-customize';
import { LoadingOverlay } from '@/components/LoadingOverlay';

import type { TRequestConfig, TGetPaginatedRecords } from '@/react-query/types';

export const Products = (props: { queryConfig: TRequestConfig<TGetPaginatedRecords> }) => {
  const { queryConfig } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [keySearch, setKeySearch] = useState<string>(queryConfig.params.keySearch || '');
  const debounceKeySearch = useDebounce(keySearch);

  const updateUrl = useCallback(
    (next: Partial<TGetPaginatedRecords>) => {
      const sp = new URLSearchParams(searchParams.toString());
      const merged = { ...queryConfig.params, ...next };

      Object.entries(merged).forEach(([key, value]) => {
        if (!value) sp.delete(key);
        else sp.set(key, String(value));
      });

      router.push(`${pathname}?${sp.toString()}`);
    },
    [searchParams, pathname, router, queryConfig.params]
  );

  useEffect(() => {
    if (debounceKeySearch !== queryConfig.params.keySearch)
      updateUrl({ keySearch: debounceKeySearch, page: 1 });
  }, [debounceKeySearch, queryConfig.params.keySearch, updateUrl]);

  const { data, isLoading } = useGetPaginatedProductsQuery({ params: queryConfig.params });
  const { records = [], page, total, take } = data! || {};

  return (
    <div className='flex flex-col flex-1 w-full overflow-hidden relative'>
      {isLoading && <LoadingOverlay className='[&>svg]:size-20' />}
      <div className='flex gap-5 py-1 mb-5'>
        <InputC
          className='w-full md:max-w-100 ring-0!'
          startItem={<Search className='ml-3.5 size-4' />}
          defaultValue={keySearch}
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
        <PaginationC
          page={page}
          total={total}
          take={take}
          setPagination={(params) => updateUrl(params)}
        />
      </div>
    </div>
  );
};
