import { useQuery, type QueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import { useProcessQueryFuncs } from '@/react-query/useProcessQueryFuncs';
import type { TUseQueryOptions } from '@/react-query/types';
import type { TAuthUser } from '@/store';

export const useGetAuthProfileQuery = <C extends undefined, R extends TAuthUser>(
  config?: C,
  options?: TUseQueryOptions<R>,
  queryClient?: QueryClient
) =>
  useProcessQueryFuncs<R>(
    useQuery(
      {
        queryKey: ['useGetAuthProfileQuery', config],
        queryFn: () =>
          axiosApi
            .get<unknown, AxiosResponse<R>, C>('auth/profile', config)
            .then((data) => data.data),
        ...options,
      },
      queryClient
    ),
    options
  );
