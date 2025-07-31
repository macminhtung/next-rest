import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TUpdateProfilePayload } from '@/react-query/auth';

export const useUpdateProfileMutation = <P extends TUpdateProfilePayload, R extends P>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useUpdateProfileMutation'],
      mutationFn: (payload: P) =>
        axiosApi
          .put<unknown, AxiosResponse<R>, P>('auth/profile', payload)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
