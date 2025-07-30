'use client';

import { useQuery, type QueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import { useProcessQueryFuncs } from '@/react-query/useProcessQueryFuncs';
import type {
  TUseQueryOptions,
  TGetPaginatedRecords,
  TPaginatedRecordsResponse,
  TRequestConfig,
} from '@/react-query/types';
import type { TProduct } from '@/react-query/product/types';

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
        queryKey: ['useGetPaginatedProductsQuery', config],
        queryFn: () =>
          axiosApi
            .get<unknown, AxiosResponse<R>, TGetPaginatedRecords>('product/paginated', config)
            .then((data) => data.data),
        ...options,
      },
      queryClient
    ),
    options
  );
