import axios from 'axios';

import { PostTokenRefreshResponseDTO, useAuthStore } from '@/features/auth';

axios.interceptors.request.use(
  (config) => {
    const nextConfig = { ...config };
    const { accessToken } = useAuthStore.getState();
    if (accessToken) nextConfig.headers.Authorization = `Bearer ${accessToken}`;
    return nextConfig;
  },
  (error) => {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error('Unknown error'));
  },
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(new Error('Unknown error'));
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    const {
      config,
      response: { status, data },
    } = error;

    if (status === 401 && data.message === '유효하지 않은 액세스 토큰입니다.') {
      const originalRequest = config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const response = await fetch('/api/auth/token', {
        method: 'POST',
        credentials: 'include',
      });

      const { accessToken, userId } = (await response.json()) as PostTokenRefreshResponseDTO;

      const { setAuthInformation, clearAuthInformation } = useAuthStore.getState();

      if (accessToken) {
        setAuthInformation({ accessToken, userId });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      }

      clearAuthInformation();
    }

    return Promise.reject(error);
  },
);
