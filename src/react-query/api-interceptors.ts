'use client';

import axios, { AxiosError } from 'axios';
import {
  showToastError,
  manageAccessToken,
  EManageTokenType,
  clearTokensAndNavigateSignInPage,
} from '@/common/client-funcs';

const JWT_ERRORS = {
  EXPIRED: 'jwt expired',
  INVALID_TOKEN: 'invalid token',
  INVALID_SIGNATURE: 'invalid signature',
  UNEXPECTED_TOKEN: 'Unexpected token',
  TIMESTAMP_INCORRECT: 'Timestamp incorrect',
};

const isJwtInvalid = (errorMessage: string) =>
  [JWT_ERRORS.INVALID_TOKEN, JWT_ERRORS.INVALID_SIGNATURE, JWT_ERRORS.TIMESTAMP_INCORRECT].includes(
    errorMessage
  ) || errorMessage.includes(JWT_ERRORS.UNEXPECTED_TOKEN);

export const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosApi.interceptors.request.use((config) => {
  const accessToken = manageAccessToken({ type: EManageTokenType.GET });
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

axiosApi.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<{ message: string }>) => {
    // Identify the error message
    const errorMessage = error.response?.data?.message || '';

    // CASE: JWT Expired ==> Refresh accessToken ==> Recall API
    if (errorMessage === JWT_ERRORS.EXPIRED) {
      const accessToken = manageAccessToken({ type: EManageTokenType.GET });

      return (
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            { accessToken },
            { withCredentials: true }
          )
          // CASE: Refresh a new accessToken
          .then(({ data }) => {
            const newAccessToken = data.accessToken;
            const originalConfig = error.config!;
            originalConfig.headers!.Authorization = `Bearer ${newAccessToken}`;

            // Set new tokens
            manageAccessToken({
              type: EManageTokenType.SET,
              accessToken: newAccessToken,
            });

            // Recall the API with new accessToken
            return (
              axiosApi({ ...originalConfig! })
                // CASE: Invalid refresh token ==> Show toast error
                .catch((reError: AxiosError<{ message: string }>) => {
                  // Identify the re-error message
                  const reErrorMessage = reError.response?.data?.message || '';

                  // CASE: JWT invalid
                  if (isJwtInvalid(reErrorMessage))
                    throw showToastError(error, {
                      duration: 1500,
                      onAutoClose: () => clearTokensAndNavigateSignInPage(),
                    });

                  // Show toast error
                  showToastError(reError);
                  return Promise.reject(reError);
                })
            );
          })

          // Case refresh token error
          .catch((refreshError) => {
            showToastError(refreshError, {
              duration: 1500,
              onAutoClose: () => clearTokensAndNavigateSignInPage(),
            });

            return Promise.reject(refreshError);
          })
      );
    }

    // CASE: JWT invalid
    else if (isJwtInvalid(errorMessage))
      throw showToastError(error, {
        duration: 1500,
        onAutoClose: () => clearTokensAndNavigateSignInPage(),
      });

    // Show toast error
    showToastError(error);
    return Promise.reject(error);
  }
);
