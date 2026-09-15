import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useResetPassword } from "@/hooks/auth.hooks";

type ResetPasswordFormProps = {
  email: string;
  otp: string;
  onSuccess: () => void;
};

export function ResetPasswordForm({
  email,
  otp,
  onSuccess,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const resetPasswordMutation = useResetPassword();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    resetPasswordMutation.mutate(
      {
        email,
        otp,
        newPassword: password,
      },
      {
        onSuccess,
      },
    );
  };

  const errorMessage = axios.isAxiosError(resetPasswordMutation.error)
    ? (resetPasswordMutation.error.response?.data?.message ??
      "Failed to reset password.")
    : resetPasswordMutation.error instanceof Error
      ? resetPasswordMutation.error.message
      : "Failed to reset password.";

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Reset password</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Create a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="reset-password">New password</Label>

          <div className="relative">
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pr-10"
              disabled={resetPasswordMutation.isPending}
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reset-confirm-password">Confirm password</Label>

          <div className="relative">
            <Input
              id="reset-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="pr-10"
              disabled={resetPasswordMutation.isPending}
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {passwordError && (
          <p className="text-sm text-destructive">{passwordError}</p>
        )}

        {resetPasswordMutation.isError && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending
            ? "Resetting password..."
            : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
