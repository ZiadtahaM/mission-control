import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  plan: "FREE" | "PRO" | "ENTERPRISE";
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  avatarUrl: string | null;
  createdAt: string;
  banned: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Restore session from localStorage
    const storedToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Attempt to refresh token
        fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: storedToken }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.accessToken) {
              setAccessToken(data.accessToken);
              setUser(data.user);
              localStorage.setItem("refreshToken", data.refreshToken);
              localStorage.setItem("user", JSON.stringify(data.user));
            } else {
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              setUser(null);
            }
          })
          .catch(() => {
            setUser(null);
          })
          .finally(() => setIsLoading(false));
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((token: string, refreshToken: string, userData: AuthUser) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken && accessToken) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    queryClient.clear();
  }, [accessToken, queryClient]);

  const updateUser = useCallback((userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
