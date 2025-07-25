import { useQuery, type QueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import { useProcessQueryFuncs } from '@/react-query/useProcessQueryFuncs';
import type { TUseQueryOptions } from '@/react-query/types';
import type { TAuthUser } from '@/store';

export const useGetAuthProfileQuery = <V extends undefined, R extends TAuthUser>(
  variables?: V,
  options?: TUseQueryOptions<R>,
  queryClient?: QueryClient
) =>
  useProcessQueryFuncs<R>(
    useQuery(
      {
        queryKey: ['useGetAuthProfileQuery', variables],
        queryFn: () =>
          axiosApi
            .get<unknown, AxiosResponse<R>, V>('auth/profile', variables)
            .then((data) => data.data),
        ...options,
      },
      queryClient
    ),
    options
  );
