import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser, getDashboard } from "../services/api";

// Create the Authentication Context
const AuthContext = createContext(null);

/**
 * Custom hook to easily access auth state and actions throughout the app.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider component that wraps the application and provides
 * authentication state, login, signup, and logout methods.
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken && savedToken !== "undefined" && savedToken !== "null" ? savedToken : null;
  });
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser || savedUser === "undefined" || savedUser === "null") return null;
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Derive authentication status
  const isAuthenticated = Boolean(token && user);

  // Listen for unauthorized events emitted by api.js on 401 errors
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  // Verify session validity with backend on app initialization
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken || savedToken === "undefined" || savedToken === "null") {
        setToken(null);
        setUser(null);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const data = await getDashboard();
        if (data?.user) {
          const safeUser = normalizeUser(data.user);
          setUser(safeUser);
          localStorage.setItem("user", JSON.stringify(safeUser));
        }
      } catch (err) {
        if (err.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifySession();
  }, []);

  /**
   * Helper to normalize user object from backend response.
   * Ensures id is accessible as user.id even if returned as user._id.
   */
  const normalizeUser = (userData) => {
    if (!userData) return null;
    return {
      id: userData.id || userData._id,
      name: userData.name,
      email: userData.email,
    };
  };

  /**
   * Login user with email and password.
   * Stores token and safe user info upon success.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      const safeUser = normalizeUser(data.user);

      // Persist in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(safeUser));

      // Update state
      setToken(data.token);
      setUser(safeUser);

      return { success: true, user: safeUser };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user with name, email, and password.
   * Stores token and safe user info upon success.
   */
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await signupUser(name, email, password);
      const safeUser = normalizeUser(data.user);

      // Persist in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(safeUser));

      // Update state
      setToken(data.token);
      setUser(safeUser);

      return { success: true, user: safeUser };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user by clearing credentials and updating state.
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
    isCheckingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
