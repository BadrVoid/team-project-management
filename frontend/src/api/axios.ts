import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import type { GlobalResponse, RefreshResponse } from "./types";
import { authApi } from "./auth.api";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Reject non-401s, missing configs, or already retried requests
    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't retry if the refresh endpoint itself failed
    if (originalRequest.url?.includes("/auth/refresh")) {
      authApi.logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      authApi.logout();

      return Promise.reject(error);
    }

    try {
      // Use standard axios to avoid trigger loop on your api interceptor
      const { data } = await axios.post<GlobalResponse<RefreshResponse>>(
        `${api.defaults.baseURL}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = data.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", newRefreshToken);

      // Retry original request with new access token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      authApi.logout();

      return Promise.reject(refreshError);
    }
  }
);