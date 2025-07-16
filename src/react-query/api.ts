import axios, { AxiosError } from 'axios';
import {
  showToastError,
  manageTokens,
  EManageTokenType,
  clearTokensAndNavigateSignInPage,
} from '@/common/client-funcs';

const JWT_ERRORS = {
  EXPIRED: 'jwt expired',
  INVALID_TOKEN: 'invalid token',
  INVALID_SIGNATURE: 'invalid signature',
  UNEXPECTED_TOKEN: 'Unexpected token',
};

const BASE_URL = 'https://localhost:3001/api';

const isJwtInvalid = (errorMessage: string) =>
  [JWT_ERRORS.INVALID_TOKEN, JWT_ERRORS.INVALID_SIGNATURE].includes(errorMessage) ||
  errorMessage.includes(JWT_ERRORS.UNEXPECTED_TOKEN);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = manageTokens({ type: EManageTokenType.GET }).accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Identify the error message
    const errorMessage = error.message;

    // CASE: JWT Expired ==> Refresh accessToken ==> Recall API
    if (errorMessage === JWT_ERRORS.EXPIRED) {
      const refreshToken = manageTokens({ type: EManageTokenType.GET }).refreshToken;

      api
        .post('/refreshToken', { refreshToken })
        // CASE: Update new refreshToken & accessToken
        .then(({ data }) => {
          const newAccessToken = data.accessToken;
          const originalConfig = error.config!;
          originalConfig.headers!.Authorization = `Bearer ${newAccessToken}`;

          // Set new tokens
          manageTokens({ type: EManageTokenType.SET, accessToken: newAccessToken, refreshToken });

          // Recall the API with new accessToken
          return (
            api({ ...originalConfig! })
              // CASE: Invalid refresh token ==> Show toast error
              .catch((reError: AxiosError) => {
                // Identify the re-error message
                const reErrorMessage = reError.message;

                // CASE: JWT invalid
                if (isJwtInvalid(reErrorMessage))
                  throw showToastError(error, {
                    duration: 1500,
                    onAutoClose: () => clearTokensAndNavigateSignInPage(),
                  });

                // Show toast error
                showToastError(reError);
                throw null;
              })
          );
        });
    }

    // CASE: JWT invalid
    else if (isJwtInvalid(errorMessage))
      throw showToastError(error, {
        duration: 1500,
        onAutoClose: () => clearTokensAndNavigateSignInPage(),
      });

    // Show toast error
    showToastError(error);
    throw null;
  }
);
