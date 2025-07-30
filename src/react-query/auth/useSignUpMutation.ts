import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TAuthUser } from '@/store';
import type { TSignUpPayload } from '@/react-query/auth';

export const useSignUpMutation = <V extends TSignUpPayload, R extends TAuthUser>(
  options?: TUseMutationOptions<V, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useSignUpMutation'],
      mutationFn: (variables: V) =>
        axiosApi
          .post<unknown, AxiosResponse<R>, V>('auth/signup', variables)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
