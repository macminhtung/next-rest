import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TSignInResponse } from '@/react-query/auth/';

type TUpdatePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export const useUpdatePasswordMutation = <
  V extends TUpdatePasswordPayload,
  R extends TSignInResponse,
>(
  options?: TUseMutationOptions<V, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useUpdatePasswordMutation'],
      mutationFn: (variables: V) =>
        axiosApi
          .put<unknown, AxiosResponse<R>, V>('auth/password', variables)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
