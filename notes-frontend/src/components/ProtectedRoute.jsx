import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Loading fallback while verifying session.
 */
const AuthLoading = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--bg-main, #0f172a)",
    }}
  >
    <div className="spinner-lg"></div>
  </div>
);

/**
 * ProtectedRoute component:
 * Restricts access to authenticated users only.
 * If unauthenticated, redirects to /login.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * PublicRoute component (Optional helper):
 * Restricts access to guest users only.
 * If already authenticated, redirects directly to /dashboard.
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
