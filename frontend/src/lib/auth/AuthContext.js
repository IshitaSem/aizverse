import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest, ApiError } from "../api/client";
const AuthContext = createContext(null);
const STORAGE_KEY = "aizverse.auth";
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setUser(parsed.user);
                setToken(parsed.token);
            }
            catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsInitializing(false);
    }, []);
    function persist(result) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    }
    async function loginOrRegister(email, password, role, name) {
        try {
            const result = await apiRequest("/auth/login", {
                method: "POST",
                body: { email, password },
            });
            persist(result);
            return result.user;
        }
        catch (err) {
            const isNoSuchAccount = err instanceof ApiError && err.status === 401;
            if (!isNoSuchAccount)
                throw err;
            const result = await apiRequest("/auth/register", {
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
    return (_jsx(AuthContext.Provider, { value: { user, token, isAuthenticated: Boolean(token), isInitializing, loginOrRegister, logout }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
