import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TSignInPayload } from '@/react-query/auth';

export type TSignInResponse = { accessToken: string };

export const useSignInMutation = <V extends TSignInPayload, R extends TSignInResponse>(
  options?: TUseMutationOptions<V, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useSignInMutation'],
      mutationFn: (variables: V) =>
        axiosApi
          .post<unknown, AxiosResponse<R>, V>('auth/signin', variables)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
