import { useQuery, type QueryClient } from '@tanstack/react-query';
import { axiosApi } from '@/react-query/api-interceptors';
import { useProcessQueryFuncs } from '@/react-query/useProcessQueryFuncs';
import type { TUseQueryOptions } from '@/react-query/types';
import type { TAuthUser } from '@/store';

declare module '@/react-query/types' {
  interface QueryKey {
    GetProfile: ['GetProfile'];
  }
}

export const useGetProfileQuery = <R extends TAuthUser>(
  options?: TUseQueryOptions<R>,
  queryClient?: QueryClient
) =>
  useProcessQueryFuncs<R>(
    useQuery(
      {
        queryKey: ['GetProfile'],
        queryFn: ({ signal }) => axiosApi.get<unknown, R>('auth/profile', { signal }),
        ...options,
      },
      queryClient
    ),
    options
  );
