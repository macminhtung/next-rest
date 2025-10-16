'use client';

import axios, { AxiosError } from 'axios';
import {
  showToastError,
  manageAccessToken,
  EManageTokenType,
  clearTokensAndNavigateSignInPage,
} from '@/common/client-funcs';

// #====================#
// # ==> JWT ERRORS <== #
// #====================#
const JWT_ERRORS = {
  EXPIRED: 'jwt expired',
  INVALID_TOKEN: 'invalid token',
  INVALID_SIGNATURE: 'invalid signature',
  UNEXPECTED_TOKEN: 'Unexpected token',
  TIMESTAMP_INCORRECT: 'Timestamp incorrect',
  ACCESS_TOKEN_INVALID: 'Access token invalid',
};

// #===================================#
// # ==> CHECK JWT IS INVALID FUNC <== #
// #===================================#
const isJwtInvalid = (errorMessage: string) =>
  [
    JWT_ERRORS.INVALID_TOKEN,
    JWT_ERRORS.INVALID_SIGNATURE,
    JWT_ERRORS.TIMESTAMP_INCORRECT,
    JWT_ERRORS.ACCESS_TOKEN_INVALID,
  ].includes(errorMessage) || errorMessage.includes(JWT_ERRORS.UNEXPECTED_TOKEN);

// #============================#
// # ==> AXIOS INSTANCE API <== #
// #============================#
export const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// #======================#
// # ==> FAILED QUEUE <== #
// #======================#
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: AxiosError<{ message: string }>) => void;
}[] = [];

// #===================================#
// # ==> PROCESS FAILED QUEUE FUNC <== #
// #===================================#
const processFailedQueue = (
  error: AxiosError<{ message: string }> | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token!)));
  failedQueue = [];
};

// #=================================#
// # ==> RESET ACCESS TOKEN FUNC <== #
// #=================================#
const refreshAccessToken = async () => {
  const currentAccessToken = manageAccessToken({ type: EManageTokenType.GET });

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    { accessToken: currentAccessToken },
    { withCredentials: true }
  );

  const newAccessToken = data.accessToken;
  manageAccessToken({
    type: EManageTokenType.SET,
    accessToken: newAccessToken,
  });

  return newAccessToken;
};

// #==============================#
// # ==> REQUEST INTERCEPTORS <== #
// #==============================#
axiosApi.interceptors.request.use((config) => {
  const accessToken = manageAccessToken({ type: EManageTokenType.GET });
  if (accessToken && config.headers) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// #===============================#
// # ==> RESPONSE INTERCEPTORS <== #
// #===============================#
axiosApi.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<{ message: string }>) => {
    const errorMessage = error.response?.data?.message ?? '';
    const originalRequest = error.config!;

    // CASE: TOKEN EXPIRED
    if (errorMessage === JWT_ERRORS.EXPIRED) {
      // CASE: REFRESHING ==> Add expired request to queue ==> Wait for the refresh process to complete
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosApi(originalRequest));
            },
            reject,
          });
        });
      }

      // Trigger isRefreshing flag
      isRefreshing = true;

      return refreshAccessToken()
        .then((newToken) => {
          processFailedQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        })
        .catch((refreshError: AxiosError<{ message: string }>) => {
          processFailedQueue(refreshError, null);
          showToastError(refreshError, {
            duration: 1500,
            onAutoClose: () => clearTokensAndNavigateSignInPage(),
          });
          return Promise.reject(refreshError);
        })
        .finally(() => {
          // Clear isRefreshing flag
          isRefreshing = false;
        });
    }

    // CASE: JWT INVALID ==> SIGNOUT
    if (isJwtInvalid(errorMessage)) {
      showToastError(error, {
        duration: 1500,
        onAutoClose: () => clearTokensAndNavigateSignInPage(),
      });
      return Promise.reject(error);
    }

    // CASE: SHOW MESSAGE ERROR
    showToastError(error);
    return Promise.reject(error);
  }
);
