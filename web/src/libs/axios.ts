import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터에서 refreshToken 사용
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      // refresh 요청 자체면 인터셉터 재시도 안 함
      if (originalConfig.url === '/auth/refresh') {
        return Promise.reject(error);
      }

      try {
        const response = await api.post(
          '/auth/refresh',
          { refreshtoken: 'auto-from-cookie' },
          { withCredentials: true }
        );

        const newToken = response.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);

        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        return api(originalConfig);
      } catch (refreshError) {
        useAuthStore.getState().setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
