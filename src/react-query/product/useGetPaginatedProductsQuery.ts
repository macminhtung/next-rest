'use client';

import { useQuery, type QueryClient } from '@tanstack/react-query';
import { axiosApi } from '@/react-query/api-interceptors';
import { useProcessQueryFuncs } from '@/react-query/useProcessQueryFuncs';
import type {
  TUseQueryOptions,
  TGetPaginatedRecords,
  TPaginatedRecordsResponse,
  TRequestConfig,
} from '@/react-query/types';
import type { TProduct } from '@/react-query/product/types';

declare module '@/react-query/types' {
  interface QueryKey {
    GetPaginatedProducts: ['GetPaginatedProducts'];
  }
}

export const useGetPaginatedProductsQuery = <
  C extends TRequestConfig<TGetPaginatedRecords>,
  R extends TPaginatedRecordsResponse<TProduct>,
>(
  config: C,
  options?: TUseQueryOptions<R>,
  queryClient?: QueryClient
) =>
  useProcessQueryFuncs<R>(
    useQuery(
      {
        queryKey: ['GetPaginatedProducts', config],
        queryFn: ({ signal }) =>
          axiosApi.get<unknown, R, TGetPaginatedRecords>('product/paginated', {
            ...config,
            signal,
          }),
        ...options,
      },
      queryClient
    ),
    options
  );
