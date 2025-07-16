'use client';

import { createElement } from 'react';
import { toast, type ExternalToast } from 'sonner';
import { X } from 'lucide-react';

import { ELocalStorageKey } from '@/common/enums';

export const showToastError = (
  error: Error,
  options?: Omit<ExternalToast, 'action' | 'actionButtonStyle'>
) =>
  toast.error(error?.message, {
    action: {
      label: createElement(X, { className: 'w-5 text-gray-700 dark:text-white' }),
      onClick: () => null,
    },
    actionButtonStyle: { backgroundColor: 'transparent' },
    duration: 2500,
    ...options,
  });

export const clearTokensAndNavigateSignInPage = () => {
  manageTokens({ type: EManageTokenType.SET, refreshToken: '', accessToken: '' });
  window.location.href = '/';
};

export enum EManageTokenType {
  GET = 'GET',
  SET = 'SET',
}

export const manageTokens = (
  payload:
    | { type: EManageTokenType.GET }
    | { type: EManageTokenType.SET; accessToken: string; refreshToken: string }
) => {
  const { type } = payload;
  if (typeof window === 'undefined') return { refreshToken: '', accessToken: '' };

  // CASE: Get Tokens
  if (type === EManageTokenType.GET)
    return {
      refreshToken: localStorage.getItem(ELocalStorageKey.REFRESH_TOKEN) || '',
      accessToken: localStorage.getItem(ELocalStorageKey.ACCESS_TOKEN) || '',
    };

  // CASE: Set Tokens
  const { refreshToken, accessToken } = payload;
  localStorage.setItem(ELocalStorageKey.REFRESH_TOKEN, refreshToken || '');
  localStorage.setItem(ELocalStorageKey.ACCESS_TOKEN, accessToken);

  return { refreshToken, accessToken };
};
