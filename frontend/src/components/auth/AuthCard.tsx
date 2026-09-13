import { useState } from "react";

import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { VerifyOtpForm } from "./VerifyOtpForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

import { Button } from "@/components/ui/button";

type AuthView = "login" | "register" | "forgot" | "otp" | "reset";

type OtpPurpose = "register" | "reset-password";

export function AuthCard() {
  const [view, setView] = useState<AuthView>("login");
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>("register");

  const [authEmail, setAuthEmail] = useState("");
  const [authOtp, setAuthOtp] = useState("");

  const isRegister = view === "register";

  const showForgot = () => {
    setView("forgot");
  };

  const showRegisterOtp = (email: string) => {
    setAuthEmail(email);
    setOtpPurpose("register");
    setView("otp");
  };

  const showResetOtp = (email: string) => {
    setAuthEmail(email);
    setOtpPurpose("reset-password");
    setView("otp");
  };

  const handleOtpSuccess = (otp: string) => {
    if (otpPurpose === "register") {
      setView("login");
      return;
    }

    setAuthOtp(otp);
    setView("reset");
  };

  const handleResetSuccess = () => {
    setAuthEmail("");
    setAuthOtp("");
    setView("login");
  };

  return (
    <div className="relative min-h-[620px] w-full overflow-hidden rounded-4xl bg-card shadow-2xl animate-card-enter">
      {/* Desktop */}
      <div className="absolute inset-0 hidden md:block">
        {/* Login */}
        <div
          className={`absolute inset-y-0 left-0 flex w-1/2 items-center justify-center p-10 transition-all duration-700 ease-in-out ${
            isRegister
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <LoginForm
            onRegister={() => setView("register")}
            onForgotPassword={showForgot}
          />
        </div>

        {/* Register */}
        <div
          className={`absolute inset-y-0 right-0 flex w-1/2 items-center justify-center p-10 transition-all duration-700 ease-in-out ${
            isRegister
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <RegisterForm onVerify={showRegisterOtp} />
        </div>

        {/* Side panel */}
        <div
          className={`absolute inset-y-0 right-0 z-20 flex w-1/2 items-center justify-center bg-secondary p-10 text-secondary-foreground transition-transform duration-700 ease-in-out ${
            isRegister ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="max-w-sm text-center">
            <h2 className="text-4xl font-semibold">
              {isRegister ? "Welcome back" : "New here?"}
            </h2>

            <p className="mt-4 text-secondary-foreground/70">
              {isRegister
                ? "Already have an account? Sign in and continue managing your projects."
                : "Create an account and start managing your projects and teams."}
            </p>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setView(isRegister ? "login" : "register")}
              className="mt-6 bg-transparent px-8 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
            >
              {isRegister ? "Sign in" : "Create account"}
            </Button>
          </div>
        </div>

        {/* Forgot / OTP / Reset */}
        {(view === "forgot" || view === "otp" || view === "reset") && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-card p-10">
            {view === "forgot" && (
              <ForgotPasswordForm
                onBack={() => setView("login")}
                onVerify={showResetOtp}
              />
            )}

            {view === "otp" && (
              <VerifyOtpForm
                email={authEmail}
                purpose={otpPurpose}
                onVerify={handleOtpSuccess}
                onBack={() => setView("login")}
              />
            )}

            {view === "reset" && (
              <ResetPasswordForm
                email={authEmail}
                otp={authOtp}
                onSuccess={handleResetSuccess}
              />
            )}
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="flex min-h-[620px] items-center justify-center p-6 md:hidden">
        {view === "login" && (
          <LoginForm
            onRegister={() => setView("register")}
            onForgotPassword={showForgot}
          />
        )}

        {view === "register" && <RegisterForm onVerify={showRegisterOtp} />}

        {view === "forgot" && (
          <ForgotPasswordForm
            onBack={() => setView("login")}
            onVerify={showResetOtp}
          />
        )}

        {view === "otp" && (
          <VerifyOtpForm
            email={authEmail}
            purpose={otpPurpose}
            onVerify={handleOtpSuccess}
            onBack={() => setView("login")}
          />
        )}

        {view === "reset" && (
          <ResetPasswordForm
            email={authEmail}
            otp={authOtp}
            onSuccess={handleResetSuccess}
          />
        )}
      </div>
    </div>
  );
}
