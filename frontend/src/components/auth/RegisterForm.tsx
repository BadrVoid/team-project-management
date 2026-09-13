import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SiGoogle, SiGithub } from "@icons-pack/react-simple-icons";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useRegister } from "@/components/auth/hooks/auth.hooks";

type RegisterFormProps = {
  onVerify: (email: string) => void;
};

export function RegisterForm({ onVerify }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false)

  const [passwordError, setPasswordError] = useState("");

  const registerMutation = useRegister();

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError("");

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
      <h1 className="mt-2 text-4xl font-semibold">Create account</h1>

      <p className="mt-3 text-muted-foreground">
        Create your account and start managing projects.
      </p>

      <form onSubmit={handleOnSubmit} className="mt-8 space-y-5">
        <div className="space-y-1">
          <Label htmlFor="register-first-name">First Name</Label>

          <Input
            id="register-first-name"
            type="text"
            placeholder="Your first name"
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
            placeholder="Your last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={registerMutation.isPending}
            required
          />
        </div>

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

        <div className="space-y-1">
          <Label htmlFor="register-password">Password</Label>

          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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

        <div className="space-y-1">
          <Label htmlFor="register-confirm-password">Confirm password</Label>

          <div className="relative">
            <Input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="pr-10"
              disabled={registerMutation.isPending}
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
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

        {passwordError && (
          <p className="text-sm text-destructive">{passwordError}</p>
        )}

        {registerMutation.isError && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs text-muted-foreground">OR</span>

          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={registerMutation.isPending}
          >
            <SiGoogle className="size-4" />
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={registerMutation.isPending}
          >
            <SiGithub className="size-4" />
            GitHub
          </Button>
        </div>

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
