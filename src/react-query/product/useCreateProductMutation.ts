import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TProduct, TCreateProduct } from '@/react-query/product';

export const useCreateProductMutation = <P extends TCreateProduct, R extends TProduct>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useCreateProductMutation'],
      mutationFn: (payload: P) => axiosApi.post<unknown, R, TCreateProduct>('product', payload),
      ...options,
    },
    queryClient
  );
