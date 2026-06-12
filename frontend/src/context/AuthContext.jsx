import { createContext, useContext, useMemo, useState } from "react";
import { authService, SESSION_KEY } from "../services/api.js";

const AuthContext = createContext(null);

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const saveSession = (nextSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    saveSession({
      token: response.token,
      user: response.user,
      role: response.user.role,
    });
    return response;
  };

  const login = async (payload) => {
    const response = await authService.login(payload);
    saveSession({
      token: response.token,
      user: response.user,
      role: response.user.role,
    });
    return response;
  };

  const adminLogin = async (payload) => {
    const response = await authService.adminLogin(payload);
    saveSession({
      token: response.token,
      user: response.admin,
      role: response.admin.role,
    });
    return response;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user,
      isAuthenticated: Boolean(session?.token),
      isAdmin: session?.role === "admin",
      register,
      login,
      adminLogin,
      logout,
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
