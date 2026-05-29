import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { authService, type LoginInput, type RegisterInput } from "../services/authService";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginInput) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredUser = () => {
  const rawUser = localStorage.getItem("task-manager-user");
  return rawUser ? (JSON.parse(rawUser) as User) : null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("task-manager-token"));
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = (nextUser: User, nextToken: string) => {
    localStorage.setItem("task-manager-user", JSON.stringify(nextUser));
    localStorage.setItem("task-manager-token", nextToken);
    setUser(nextUser);
    setToken(nextToken);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("task-manager-user");
    localStorage.removeItem("task-manager-token");
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const syncProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.profile();
        localStorage.setItem("task-manager-user", JSON.stringify(profile));
        setUser(profile);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    syncProfile();
  }, [logout, token]);

  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      async login(payload) {
        const data = await authService.login(payload);
        persistSession(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}`);
      },
      async register(payload) {
        const data = await authService.register(payload);
        persistSession(data.user, data.token);
        toast.success("Account created successfully");
      },
      logout
    }),
    [loading, logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
