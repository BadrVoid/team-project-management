import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: authApi.verifyOtp,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
}