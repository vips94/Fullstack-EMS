import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

/**
 * AuthProvider - Provides authentication context to the entire application
 * Manages user login state, token storage, and session validation
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  /**
   * refreshSession - Validates stored token and loads user session data
   * Clears token if invalid and updates user state
   */
  const refreshSession = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      setToken(null);
      return;
    }
    try {
      const { data } = await api.get("/auth/session");
      setUser(data.user);
    } catch (error) {
      //token is invalid, clear it
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  /**
   * login - Authenticates user with email, password, and role
   * Sets token and user data on successful login
   */
  const login = async (email, password, role_type) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      role_type,
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  /**
   * logout - Clears user authentication data and removes stored token
   */
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, login, logout, refreshSession };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth - Custom hook to access authentication context
 * Must be used within AuthProvider component
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
