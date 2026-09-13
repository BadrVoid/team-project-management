import { api } from "@/api/axios";
import { endpoints } from "@/api/endpoints";

import type {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "./auth.types";

export const authApi = {
  login: (data: LoginRequest) =>
    api.post(endpoints.auth.login, data),

  register: (data: RegisterRequest) =>
    api.post(endpoints.auth.register, data),

  verifyOtp: (data: VerifyOtpRequest) =>
    api.post(endpoints.auth.verifyOtp, data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post(endpoints.auth.forgotPassword, data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post(endpoints.auth.resetPassword, data),
};