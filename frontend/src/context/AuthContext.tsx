import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function getStoredToken(key: string) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    getStoredToken(ACCESS_TOKEN_KEY),
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    getStoredToken(REFRESH_TOKEN_KEY),
  );

  const login = useCallback(
    (newAccessToken: string, newRefreshToken: string, rememberMe: boolean) => {
      // Clear old tokens first
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      storage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);

    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken,
      login,
      logout,
    }),
    [accessToken, refreshToken, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
