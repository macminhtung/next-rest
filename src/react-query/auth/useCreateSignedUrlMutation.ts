import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';

export type TCreateSignedUrl = { contentType: string; filename: string };

export const useCreateSignedUrlMutation = <P extends TCreateSignedUrl, R extends string>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useCreateSignedUrlMutation'],
      mutationFn: (payload: P) =>
        axiosApi
          .post<unknown, AxiosResponse<R>, P>('auth/signed-url', payload)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
