import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useVerifyOtp } from "@/components/auth/hooks/auth.hooks";

type OtpPurpose = "register" | "reset-password";

type VerifyOtpFormProps = {
  email: string;
  purpose: OtpPurpose;
  onVerify: (otp: string) => void;
  onBack: () => void;
};

export function VerifyOtpForm({
  email,
  purpose,
  onVerify,
  onBack,
}: VerifyOtpFormProps) {
  const [otp, setOtp] = useState("");

  const verifyOtpMutation = useVerifyOtp();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      return;
    }

    if (purpose === "reset-password") {
      onVerify(otp);
      return;
    }

    verifyOtpMutation.mutate(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {
          onVerify(otp);
        },
      },
    );
  };

  const errorMessage = axios.isAxiosError(verifyOtpMutation.error)
    ? (verifyOtpMutation.error.response?.data?.message ??
      "OTP verification failed.")
    : verifyOtpMutation.error instanceof Error
      ? verifyOtpMutation.error.message
      : "OTP verification failed.";

  const isPending = verifyOtpMutation.isPending;

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Verify your email</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Enter the 6-digit code we sent to your email.
        </p>

        <p className="mt-2 text-sm font-medium">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Input
          value={otp}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, "").slice(0, 6);

            setOtp(value);
          }}
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="h-14 text-center text-2xl tracking-[0.5em]"
          disabled={isPending}
          required
        />

        {verifyOtpMutation.isError && (
          <p className="text-center text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isPending || otp.length !== 6}
        >
          {isPending ? "Verifying..." : "Verify code"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?
        </p>

        <Button
          type="button"
          variant="ghost"
          className="mt-1 text-primary"
          disabled={isPending}
        >
          Resend code
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="mt-2 w-full"
        disabled={isPending}
      >
        Back
      </Button>
    </div>
  );
}
