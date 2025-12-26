import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import { axiosApi } from '@/react-query/api-interceptors';

export const useSignOutMutation = <P extends undefined, R extends string>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useSignOutMutation'],
      mutationFn: (payload: P) => axiosApi.post<unknown, R, P>('auth/signout', payload),
      ...options,
    },
    queryClient
  );
