import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/auth", { replace: true });
      return;
    }

    if (!isAuthenticated) {
      login(accessToken, refreshToken, true);
    }
  }, [searchParams, login, navigate, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Signing you in...</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we prepare your account.
        </p>
      </div>
    </div>
  );
}
