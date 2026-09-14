// src/api/auth.api.ts

import { api } from "./axios";
import { endpoints } from "./endpoints";

import type {
  ForgotPasswordRequest,
  GlobalResponse,
  LoginRequest,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "./types";

export const authApi = {
  async login(data: LoginRequest): Promise<RefreshResponse> {
    const response = await api.post<GlobalResponse<RefreshResponse>>(
      endpoints.auth.login,
      data,
    );

    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<void> {
    await api.post<GlobalResponse<null>>(
      endpoints.auth.register,
      data,
    );
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<void> {
    await api.post<GlobalResponse<null>>(
      endpoints.auth.verifyOtp,
      data,
    );
  },

  async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<void> {
    await api.post<GlobalResponse<null>>(
      endpoints.auth.forgotPassword,
      data,
    );
  },

  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<void> {
    await api.post<GlobalResponse<null>>(
      endpoints.auth.resetPassword,
      data,
    );
  },

  async refreshToken(
    data: RefreshRequest,
  ): Promise<RefreshResponse> {
    const response = await api.post<GlobalResponse<RefreshResponse>>(
      endpoints.auth.refreshToken,
      data,
    );

    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post<GlobalResponse<null>>(
        endpoints.auth.logout,
      );
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await api.post<GlobalResponse<null>>(
      endpoints.auth.changePassword,
      {
        currentPassword,
        newPassword,
      },
    );
  },
};