'use client';

import { useEffect } from 'react';
import type { TUseQueryOptions } from '@/react-query/types';
import type { UseQueryResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const useProcessQueryFuncs = <R>(
  result: UseQueryResult<NoInfer<R>, AxiosError>,
  options?: Pick<TUseQueryOptions<R>, 'enabled' | 'onLoading' | 'onSuccess' | 'onError'>
) => {
  const { onSuccess, onError, onLoading, enabled } = options || {};

  useEffect(() => {
    if (enabled) {
      if (onLoading) onLoading(result.isFetching);
      if (onSuccess && !result.isFetching && result.isSuccess) onSuccess(result.data);
      if (onError && !result.isFetching && result.isError) onError(result.error);
    }
  }, [enabled, onError, onLoading, onSuccess, result]);

  return result;
};
