import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import type { AxiosResponse } from 'axios';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TProduct, TCreateProduct } from '@/react-query/product';

export const useUpdateProductMutation = <P extends TProduct, R extends TProduct>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useUpdateProductMutation'],
      mutationFn: ({ id, ...rest }: P) =>
        axiosApi
          .put<unknown, AxiosResponse<R>, TCreateProduct>(`product/${id}`, rest)
          .then((data) => data.data),
      ...options,
    },
    queryClient
  );
