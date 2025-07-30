import type { UseMutationOptions, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import type { EOrder } from '@/common/enums';

export type TUseMutationOptions<V = unknown, R = unknown> = Omit<
  UseMutationOptions<R, AxiosError, V, unknown>,
  'mutationKey' | 'mutationFn'
>;

export type TUseQueryOptions<R = unknown> = Omit<
  UseQueryOptions<R, AxiosError, R, QueryKey>,
  'queryKey' | 'queryFn'
> & {
  onLoading?: (isLoading: boolean) => void;
  onSuccess?: (data: R) => Promise<unknown> | unknown;
  onError?: (error: AxiosError) => Promise<unknown> | unknown;
};

export type TRequestConfig<T> = Omit<AxiosRequestConfig<T>, 'params'> & { params: T };

export type TGetPaginatedRecords = {
  order?: EOrder;
  page?: number;
  take?: number;
  keySearch?: string;
  isDeleted?: boolean;
  includeIds?: string[];
  excludeIds?: string[];
  createdFrom?: string;
  createdTo?: string;
  isSelectAll?: boolean;
};

export type TPaginatedRecordsResponse<E extends object> = {
  page: number;
  take: number;
  total: number;
  records: E[];
};
