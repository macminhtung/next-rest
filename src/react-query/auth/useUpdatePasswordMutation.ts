import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TSignInResponse } from '@/react-query/auth/';
import type { TUpdatePasswordPayload } from '@/react-query/auth';

export const useUpdatePasswordMutation = <
  P extends TUpdatePasswordPayload,
  R extends TSignInResponse,
>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useUpdatePasswordMutation'],
      mutationFn: (payload: P) => axiosApi.put<unknown, R, P>('auth/password', payload),
      ...options,
    },
    queryClient
  );
