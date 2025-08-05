import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TAuthUser } from '@/store';
import type { TSignUpPayload } from '@/react-query/auth';

export const useSignUpMutation = <P extends TSignUpPayload, R extends TAuthUser>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useSignUpMutation'],
      mutationFn: (payload: P) => axiosApi.post<unknown, R, P>('auth/signup', payload),
      ...options,
    },
    queryClient
  );
