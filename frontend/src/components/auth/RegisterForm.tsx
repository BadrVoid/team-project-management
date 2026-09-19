import { useState } from "react";

import { Eye, EyeOff, Check, X } from "lucide-react";

import { SiGoogle, SiGithub } from "@icons-pack/react-simple-icons";

import axios from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useRegister } from "@/hooks/useAuth";

type RegisterFormProps = {
  onVerify: (email: string) => void;
};

export function RegisterForm({ onVerify }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const registerMutation = useRegister();

  // Password rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError("");

    if (!isPasswordValid) {
      setPasswordError("Password does not meet the requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    registerMutation.mutate(
      {
        firstName,
        lastName,
        email,
        password,
      },
      {
        onSuccess: () => {
          onVerify(email);
        },
      },
    );
  };

  const errorMessage = axios.isAxiosError(registerMutation.error)
    ? (registerMutation.error.response?.data?.message ?? "Registration failed.")
    : registerMutation.error instanceof Error
      ? registerMutation.error.message
      : "Registration failed.";

  return (
    <div className="w-full max-w-sm transition">
      <h1 className="text-3xl font-semibold">Create account</h1>

      <p className="mt-2  text-sm text-muted-foreground">
        Create your account and start managing projects.
      </p>

      <form onSubmit={handleOnSubmit} className="mt-4 space-y-3">
        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="register-first-name">First Name</Label>

            <Input
              id="register-first-name"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={registerMutation.isPending}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="register-last-name">Last Name</Label>

            <Input
              id="register-last-name"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={registerMutation.isPending}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="register-email">Email</Label>

          <Input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={registerMutation.isPending}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>

          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
              className="pr-10"
              disabled={registerMutation.isPending}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Password must contain:</p>

            <PasswordRequirement
              valid={hasMinLength}
              text="At least 8 characters"
            />

            <PasswordRequirement
              valid={hasUppercase}
              text="One uppercase letter"
            />

            <PasswordRequirement
              valid={hasLowercase}
              text="One lowercase letter"
            />

            <PasswordRequirement valid={hasNumber} text="One number" />

            <PasswordRequirement
              valid={hasSpecialChar}
              text="One special character (@$!%*?&)"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <Label htmlFor="register-confirm-password">Confirm password</Label>

          <div className="relative">
            <Input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setPasswordError("");
              }}
              className="pr-10"
              disabled={registerMutation.isPending}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Errors */}
        {passwordError && (
          <p className="text-sm text-destructive">{passwordError}</p>
        )}

        {registerMutation.isError && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>
    </div>
  );
}

type PasswordRequirementProps = {
  valid: boolean;
  text: string;
};

function PasswordRequirement({ valid, text }: PasswordRequirementProps) {
  return (
    <div
      className={`flex items-center gap-2 ${
        valid ? "text-green-600 dark:text-green-500" : "text-muted-foreground"
      }`}
    >
      {valid ? <Check className="size-3.5" /> : <X className="size-3.5" />}

      <span>{text}</span>
    </div>
  );
}
