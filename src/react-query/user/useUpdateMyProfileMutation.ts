import { useMutation, QueryClient } from '@tanstack/react-query';
import type { TUseMutationOptions } from '@/react-query/types';
import { axiosApi } from '@/react-query/api-interceptors';
import type { TUpdateMyProfilePayload } from '@/react-query/user';

export const useUpdateMyProfileMutation = <P extends TUpdateMyProfilePayload, R extends P>(
  options?: TUseMutationOptions<P, R>,
  queryClient?: QueryClient
) =>
  useMutation(
    {
      mutationKey: ['useUpdateProfileMutation'],
      mutationFn: (payload: P) => axiosApi.put<unknown, R, P>('user/me/profile', payload),
      ...options,
    },
    queryClient
  );
