import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — wraps routes that require authentication and/or specific roles.
 *
 * Usage:
 *   <ProtectedRoute>                        // any authenticated user
 *   <ProtectedRoute roles={["admin"]}>      // only admins
 *   <ProtectedRoute roles={["admin","instructor"]}>
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center vh-100"
        style={{ background: "var(--zd-bg, #f8fafc)" }}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            style={{ color: "var(--zd-primary, #2563eb)", width: "2.5rem", height: "2.5rem" }}
            role="status"
          />
          <p className="fw-semibold" style={{ color: "var(--zd-text-muted, #64748b)", fontSize: "0.875rem" }}>
            Authenticating…
          </p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login, preserve attempted route
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → redirect to their dashboard
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return children;
};

export const getRoleDashboard = (role) => {
  const map = {
    admin: "/admin/dashboard",
    instructor: "/instructor/dashboard",
    student: "/student/dashboard",
  };
  return map[role] || "/login";
};

export default ProtectedRoute;