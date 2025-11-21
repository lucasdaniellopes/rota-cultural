import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue: Array<{
  onSuccess: (token: string) => void;
  onFailed: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.onFailed(error);
    } else if (token) {
      prom.onSuccess(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// Interceptador de requisição: adicionar Authorization header
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptador de resposta: tratar 401 e renovar token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está tentando refresh, esperar na fila
        return new Promise((onSuccess, onFailed) => {
          failedQueue.push({
            onSuccess: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              onSuccess(api(originalRequest));
            },
            onFailed: (err: AxiosError) => {
              onFailed(err);
            },
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;

        processQueue(null, access);
        return api(originalRequest);
      } catch (err: any) {
        // Refresh falhou, limpar tokens e redirecionar para login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        processQueue(err, null);

        // Redirecionar apenas se não for uma chamada de refresh
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/entrar')
        ) {
          window.location.href = '/entrar';
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export interface Location {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    created_at: string;
}

export const locationService = {
    async getLocations(): Promise<Location[]> {
        const response = await api.get('/locations/')
        return Array.isArray(response.data) ? response.data : response.data.results || []
    }
}