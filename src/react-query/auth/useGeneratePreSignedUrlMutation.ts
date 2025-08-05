import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';

export type TGeneratePreSignedUrl = { contentType: string; filename: string };

export const useGeneratePreSignedUrlMutation = <P extends TGeneratePreSignedUrl, R extends string>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useGeneratePreSignedUrlMutation'],
      mutationFn: (payload: P) =>
        axiosApi
          .post<unknown, AxiosResponse<R>, P>('auth/presigned-url', payload)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
