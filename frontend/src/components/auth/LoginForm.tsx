import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { SiGoogle, SiGithub } from "@icons-pack/react-simple-icons";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/components/auth/hooks/auth.hooks";
import { useAuth } from "@/context/AuthContext";
type LoginFormProps = {
  onRegister: () => void;
  onForgotPassword: () => void;
};

export function LoginForm({ onRegister, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    loginMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (response) => {
          const { accessToken, refreshToken } = response.data.data;
          login(accessToken, refreshToken, rememberMe);

          navigate("/home");
        },
      },
    );
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Welcome back</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue to your workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>

          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loginMutation.isPending}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pr-10"
              disabled={loginMutation.isPending}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {loginMutation.isError && (
          <p className="text-sm text-destructive">
            {axios.isAxiosError(loginMutation.error)
              ? (loginMutation.error.response?.data?.message ??
                "Invalid email or password.")
              : "Something went wrong."}
          </p>
        )}
        <div className="flex items-center gap-2">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={loginMutation.isPending}
            className="size-4"
          />

          <label
            htmlFor="remember-me"
            className="text-sm text-muted-foreground"
          >
            Remember me
          </label>
        </div>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-muted-foreground">OR</span>

        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" className="w-full">
          <SiGoogle className="size-4" />
          Google
        </Button>

        <Button type="button" variant="outline" className="w-full">
          <SiGithub className="size-4" />
          GitHub
        </Button>
      </div>

      <div className="mt-6 text-center md:hidden">
        <p className="text-sm text-muted-foreground">Don't have an account?</p>

        <Button
          type="button"
          variant="ghost"
          onClick={onRegister}
          className="mt-1 text-primary"
        >
          Create account
        </Button>
      </div>
    </div>
  );
}
