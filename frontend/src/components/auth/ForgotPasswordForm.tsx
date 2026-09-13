import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForgotPassword } from "@/components/auth/hooks/auth.hooks";

type ForgotPasswordFormProps = {
  onBack: () => void;
  onVerify: (email: string) => void;
};

export function ForgotPasswordForm({
  onBack,
  onVerify,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          onVerify(email);
        },
      },
    );
  };

  const errorMessage = axios.isAxiosError(forgotPasswordMutation.error)
    ? (forgotPasswordMutation.error.response?.data?.message ??
      "Failed to send reset code.")
    : forgotPasswordMutation.error instanceof Error
      ? forgotPasswordMutation.error.message
      : "Failed to send reset code.";

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Forgot password?</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Enter your email and we'll send you a code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>

          <Input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={forgotPasswordMutation.isPending}
            required
          />
        </div>

        {forgotPasswordMutation.isError && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending
            ? "Sending code..."
            : "Send reset code"}
        </Button>
      </form>

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="mt-4 w-full"
        disabled={forgotPasswordMutation.isPending}
      >
        Back to login
      </Button>
    </div>
  );
}
