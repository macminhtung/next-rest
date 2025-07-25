import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';

export const useSignOutMutation = <V extends undefined, R extends string>(
  options?: TUseMutationOptions<V, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useSignOutMutation'],
      mutationFn: (variables: V) =>
        axiosApi
          .delete<unknown, AxiosResponse<R>, V>('auth/signout', variables)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
