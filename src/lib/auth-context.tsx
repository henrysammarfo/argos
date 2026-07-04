import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthSession,
  getStoredAdminKey,
  getStoredEmail,
  isAuthenticated as checkAuth,
  loginWithAdminKey,
  logout as authLogout,
  validateSession,
} from "./auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string;
  isLoading: boolean;
  login: (adminKey: string, email?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ok = await validateSession();
      if (cancelled) return;
      setIsAuthenticated(ok || checkAuth());
      setEmail(getStoredEmail());
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (adminKey: string, loginEmail?: string) => {
    const result = await loginWithAdminKey(adminKey, loginEmail);
    setIsAuthenticated(true);
    setEmail(result.email);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setIsAuthenticated(false);
    setEmail("");
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, email, isLoading, login, logout }),
    [isAuthenticated, email, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useAuthOptional() {
  return useContext(AuthContext);
}

/** For route guards — sync check when session already hydrated */
export function hasAuthSession(): boolean {
  return checkAuth() || Boolean(getStoredAdminKey());
}

export { clearAuthSession, getStoredEmail };
