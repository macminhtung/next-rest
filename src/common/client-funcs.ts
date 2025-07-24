'use client';

import { createElement } from 'react';
import type { AxiosError } from 'axios';
import { toast, type ExternalToast } from 'sonner';
import { X } from 'lucide-react';
import { ELocalStorageKey } from '@/common/enums';

export const showToastError = (
  error: AxiosError<{ message: string }>,
  options?: Omit<ExternalToast, 'action' | 'actionButtonStyle'>
) => {
  toast.error(error?.response?.data?.message, {
    action: {
      label: createElement(X, { className: 'w-5 text-gray-700 dark:text-white' }),
      onClick: () => null,
    },
    actionButtonStyle: { backgroundColor: 'transparent' },
    duration: 2500,
    ...options,
  });
};

export const clearTokensAndNavigateSignInPage = () => {
  manageAccessToken({ type: EManageTokenType.SET, accessToken: '' });
  window.location.href = '/';
};

export enum EManageTokenType {
  GET = 'GET',
  SET = 'SET',
}

export const manageAccessToken = (
  payload: { type: EManageTokenType.GET } | { type: EManageTokenType.SET; accessToken: string }
) => {
  const { type } = payload;
  if (typeof window === 'undefined') return '';

  // CASE: Get Tokens
  if (type === EManageTokenType.GET)
    return localStorage.getItem(ELocalStorageKey.ACCESS_TOKEN) || '';

  // CASE: Set Tokens
  const { accessToken } = payload;
  localStorage.setItem(ELocalStorageKey.ACCESS_TOKEN, accessToken);
  return accessToken;
};
