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
  fetchMe,
  getStoredToken,
  getStoredUser,
  isAuthenticated as checkAuth,
  loginWithPassword,
  logout as authLogout,
  registerAccount,
  resendVerification,
  validateSession,
  verifyEmail,
  type AuthUser,
} from "./auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  email: string;
  emailVerified: boolean;
  organizationName: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    organization_name: string;
    full_name?: string;
  }) => Promise<string | undefined>;
  verifyEmailCode: (code: string) => Promise<void>;
  resendVerificationCode: () => Promise<string | undefined>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ok = await validateSession();
      if (cancelled) return;
      setIsAuthenticated(ok);
      setUser(getStoredUser());
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await loginWithPassword(email, password);
    setUser(u);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      organization_name: string;
      full_name?: string;
    }) => {
      const result = await registerAccount(data);
      setUser(result.user);
      setIsAuthenticated(true);
      return result.verification_code;
    },
    [],
  );

  const verifyEmailCode = useCallback(async (code: string) => {
    const u = await verifyEmail(code);
    setUser(u);
  }, []);

  const resendVerificationCode = useCallback(async () => {
    const result = await resendVerification();
    return result.verification_code;
  }, []);

  const refreshUser = useCallback(async () => {
    const u = await fetchMe();
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      email: user?.email ?? "",
      emailVerified: user?.email_verified ?? false,
      organizationName: user?.organization_name ?? "",
      isLoading,
      login,
      register,
      verifyEmailCode,
      resendVerificationCode,
      refreshUser,
      logout,
    }),
    [
      isAuthenticated,
      user,
      isLoading,
      login,
      register,
      verifyEmailCode,
      resendVerificationCode,
      refreshUser,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function hasAuthSession(): boolean {
  return checkAuth() || Boolean(getStoredToken());
}

export { clearAuthSession, getStoredUser };
