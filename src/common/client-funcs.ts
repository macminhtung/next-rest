'use client';

import { createElement } from 'react';
import type { AxiosError } from 'axios';
import { toast, type ExternalToast } from 'sonner';
import { X, CircleX, CircleCheck } from 'lucide-react';
import { ELocalStorageKey } from '@/common/enums';
import axios from 'axios';

export const showToastSuccess = (
  message: string,
  options?: Omit<ExternalToast, 'action' | 'actionButtonStyle'>
) => {
  toast.success(message, {
    action: {
      label: createElement(X, { className: 'w-5 text-gray-700 dark:text-white' }),
      onClick: () => null,
    },
    actionButtonStyle: { backgroundColor: 'transparent' },
    icon: createElement(CircleCheck, { className: 'w-5 text-green-500' }),
    ...options,
  });
};

export const showToastError = (
  error: AxiosError<{ message: string }>,
  options?: Omit<ExternalToast, 'action' | 'actionButtonStyle'>
) => {
  toast.error(error?.response?.data?.message || error?.message, {
    action: {
      label: createElement(X, { className: 'w-5 text-gray-700 dark:text-white' }),
      onClick: () => null,
    },
    actionButtonStyle: { backgroundColor: 'transparent' },
    duration: 2500,
    icon: createElement(CircleX, { className: 'w-5 text-red-500' }),
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

export const uploadImageToS3 = (signedUrl: string, file: File) =>
  axios
    .put(signedUrl, file)
    .then(() => signedUrl.split('?')?.[0])
    .catch((error) => {
      error.message = `Upload image failed: ${error.message}`;
      showToastError(error);
      return '';
    });
