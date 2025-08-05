import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TProduct, TCreateProduct } from '@/react-query/product';

export const useDeleteProductMutation = <P extends string, R extends TProduct>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useDeleteProductMutation'],
      mutationFn: (id: P) => axiosApi.delete<unknown, R, TCreateProduct>(`product/${id}`),
      ...options,
    },
    queryClient
  );
