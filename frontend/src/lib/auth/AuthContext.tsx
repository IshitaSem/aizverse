import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest, ApiError } from "../api/client";

export type Role = "fan" | "organizer" | "volunteer" | "security";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True while the initial session is being restored from localStorage. */
  isInitializing: boolean;
  /**
   * The Figma login screen has a single form with a role picker but no
   * separate "create account" screen. To keep that exact one-form UX while
   * backing it with real auth: try logging in first; if there's no account
   * yet (401), register one with the chosen role and log in with that.
   * Returning users always get routed by their *actual* stored role, not
   * whatever happens to be selected in the picker.
   */
  loginOrRegister: (email: string, password: string, role: Role, name?: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "aizverse.auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AuthResponse;
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  function persist(result: AuthResponse) {
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  }

  async function loginOrRegister(email: string, password: string, role: Role, name?: string): Promise<AuthUser> {
    try {
      const result = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      persist(result);
      return result.user;
    } catch (err) {
      const isNoSuchAccount = err instanceof ApiError && err.status === 401;
      if (!isNoSuchAccount) throw err;

      const result = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: { email, password, role, name: name?.trim() || email.split("@")[0] },
      });
      persist(result);
      return result.user;
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: Boolean(token), isInitializing, loginOrRegister, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
