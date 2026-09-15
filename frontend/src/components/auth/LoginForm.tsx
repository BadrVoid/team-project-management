import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLogin } from "@/hooks/auth.hooks";
import { useAuth } from "@/context/AuthContext";

type LoginFormProps = {
  onRegister: () => void;
  onForgotPassword: () => void;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export function LoginForm({ onRegister, onForgotPassword }: LoginFormProps) {
  const navigate = useNavigate();

  const { login } = useAuth();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginMutation.mutate(
      {
        email: email.trim(),
        password,
      },
      {
        onSuccess: (response) => {
          const { accessToken, refreshToken } = response;

          login(accessToken, refreshToken, rememberMe);

          navigate("/dashboard", {
            replace: true,
          });
        },
      },
    );
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setEmail(value);

    if (errors.email) {
      setErrors((previous) => ({
        ...previous,
        email: undefined,
      }));
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setPassword(value);

    if (errors.password) {
      setErrors((previous) => ({
        ...previous,
        password: undefined,
      }));
    }
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={
              errors.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <button
              type="button"
              onClick={onForgotPassword}
              disabled={isLoading}
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              className={`pr-10 ${
                errors.password
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isLoading}
            className="size-4 rounded border-input accent-primary"
          />

          <Label
            htmlFor="remember-me"
            className="cursor-pointer text-sm font-normal"
          >
            Remember me
          </Label>
        </div>

        {/* Backend Error */}
        {loginMutation.isError && (
          <p className="text-center text-sm text-destructive">
            Invalid email or password. Please try again.
          </p>
        )}

        {/* Login Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      <div className="mt-6 mb-1 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-muted-foreground">OR</span>

        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="mb-4">
        <p className="text-xs text-muted-foreground">
          Create account / Sign in
        </p>
      </div>

      {/* OAuth */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            window.location.href =
              "http://localhost:8080/oauth2/authorization/google?action=login";
          }}
          disabled={loginMutation.isPending}
        >
          <SiGoogle className="size-4" />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            window.location.href =
              "http://localhost:8080/oauth2/authorization/github?action=login";
          }}
          disabled={loginMutation.isPending}
        >
          <SiGithub className="size-4" />
          GitHub
        </Button>
      </div>

      {/* Register */}
      <p className="mt-6 text-center text-sm text-muted-foreground md:hidden">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onRegister}
          disabled={isLoading}
          className="font-medium text-primary hover:underline"
        >
          Create account
        </button>
      </p>
    </div>
  );
}
