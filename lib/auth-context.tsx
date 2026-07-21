"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api } from "./api";

interface User {
  id: string;
  email: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, passwordConfirm: string) => Promise<{ verificationToken: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await api.getProfile() as Record<string, unknown>;
      setUser({ id: (profile.id || profile.user) as string, email: profile.email as string, is_verified: (profile.is_verified as boolean) ?? true });
    } catch {
      setUser(null);
      api.clearTokens();
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { access } = (() => {
        if (typeof window === "undefined") return { access: null };
        return { access: localStorage.getItem("access_token") };
      })();

      if (access) {
        try {
          await refreshUser();
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    api.setTokens(res.tokens.access, res.tokens.refresh);
    setUser(res.user);
  };

  const register = async (email: string, password: string, passwordConfirm: string) => {
    const res = await api.register({ email, password, password_confirm: passwordConfirm });
    api.setTokens(res.tokens.access, res.tokens.refresh);
    setUser(res.user);
    return { verificationToken: res.verification_token };
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try { await api.logout(refreshToken); } catch { /* ignore */ }
    }
    api.clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
