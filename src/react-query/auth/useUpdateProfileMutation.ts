import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TUpdateProfilePayload } from '@/react-query/auth';

export const useUpdateProfileMutation = <V extends TUpdateProfilePayload, R extends V>(
  options?: TUseMutationOptions<V, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useUpdateProfileMutation'],
      mutationFn: (variables: V) =>
        axiosApi
          .put<unknown, AxiosResponse<R>, V>('auth/profile', variables)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
