import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TSignInPayload } from '@/react-query/auth';

export type TSignInResponse = { accessToken: string };

export const useSignInMutation = <P extends TSignInPayload, R extends TSignInResponse>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useSignInMutation'],
      mutationFn: (payload: P) =>
        axiosApi
          .post<unknown, AxiosResponse<R>, P>('auth/signin', payload)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
