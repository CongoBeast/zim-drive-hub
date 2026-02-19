import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export const ROLES = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
};

export const ROLE_THEMES = {
  admin: {
    name: "admin",
    primary: "#4f46e5",
    primaryDark: "#3730a3",
    primaryLight: "#818cf8",
    accent: "#06b6d4",
    bg: "#0f0f1a",
    surface: "#1a1a2e",
    surfaceAlt: "#16213e",
    border: "#2d2d4e",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    textOnPrimary: "#ffffff",
    badge: "indigo",
    bootstrapPrimary: "#4f46e5",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    navBg: "#0f0f1a",
    sidebarBg: "#1a1a2e",
  },
  instructor: {
    name: "instructor",
    primary: "#059669",
    primaryDark: "#047857",
    primaryLight: "#34d399",
    accent: "#f59e0b",
    bg: "#f0fdf4",
    surface: "#ffffff",
    surfaceAlt: "#f9fafb",
    border: "#d1fae5",
    text: "#1a2e1f",
    textMuted: "#6b7280",
    textOnPrimary: "#ffffff",
    badge: "success",
    bootstrapPrimary: "#059669",
    gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    navBg: "#064e3b",
    sidebarBg: "#f0fdf4",
  },
  student: {
    name: "student",
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#60a5fa",
    accent: "#f97316",
    bg: "#eff6ff",
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    border: "#bfdbfe",
    text: "#1e3a5f",
    textMuted: "#64748b",
    textOnPrimary: "#ffffff",
    badge: "primary",
    bootstrapPrimary: "#2563eb",
    gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    navBg: "#1e3a5f",
    sidebarBg: "#eff6ff",
  },
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.name);
  root.style.setProperty("--zd-primary", theme.primary);
  root.style.setProperty("--zd-primary-dark", theme.primaryDark);
  root.style.setProperty("--zd-primary-light", theme.primaryLight);
  root.style.setProperty("--zd-accent", theme.accent);
  root.style.setProperty("--zd-bg", theme.bg);
  root.style.setProperty("--zd-surface", theme.surface);
  root.style.setProperty("--zd-surface-alt", theme.surfaceAlt);
  root.style.setProperty("--zd-border", theme.border);
  root.style.setProperty("--zd-text", theme.text);
  root.style.setProperty("--zd-text-muted", theme.textMuted);
  root.style.setProperty("--zd-text-on-primary", theme.textOnPrimary);
  root.style.setProperty("--zd-gradient", theme.gradient);
  root.style.setProperty("--zd-nav-bg", theme.navBg);
  root.style.setProperty("--zd-sidebar-bg", theme.sidebarBg);
  // Override Bootstrap's --bs-primary
  root.style.setProperty("--bs-primary", theme.bootstrapPrimary);
  root.style.setProperty("--bs-primary-rgb", hexToRgb(theme.bootstrapPrimary));
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
};

// Mock JWT decode — replace with real jwt-decode in production
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const isTokenExpired = (decoded) => {
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("zd_token");
    const storedUser = localStorage.getItem("zd_user");

    if (token && storedUser) {
      const decoded = decodeToken(token);
      if (decoded && !isTokenExpired(decoded)) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        applyTheme(ROLE_THEMES[userData.role]);
      } else {
        localStorage.removeItem("zd_token");
        localStorage.removeItem("zd_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    // Replace with real API call: const res = await api.post('/auth/login', credentials)
    // Mock response for demo:
    const mockResponses = {
      "admin@zimdrivehub.co.zw": {
        token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIiwiZXhwIjo5OTk5OTk5OTk5fQ.mock",
        user: { id: 1, name: "Tatenda Moyo", email: "admin@zimdrivehub.co.zw", role: ROLES.ADMIN, avatar: "TM" },
      },
      "instructor@zimdrivehub.co.zw": {
        token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwicm9sZSI6Imluc3RydWN0b3IiLCJleHAiOjk5OTk5OTk5OTl9.mock",
        user: { id: 2, name: "Blessing Chikwanda", email: "instructor@zimdrivehub.co.zw", role: ROLES.INSTRUCTOR, avatar: "BC", licenseClasses: ["Class 1", "Class 2"] },
      },
      "student@zimdrivehub.co.zw": {
        token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwicm9sZSI6InN0dWRlbnQiLCJleHAiOjk5OTk5OTk5OTl9.mock",
        user: { id: 3, name: "Rudo Kambarami", email: "student@zimdrivehub.co.zw", role: ROLES.STUDENT, avatar: "RK", lessonsRemaining: 8 },
      },
    };

    const response = mockResponses[credentials.email];
    if (!response || credentials.password !== "demo1234") {
      throw new Error("Invalid credentials. Use demo accounts with password: demo1234");
    }

    localStorage.setItem("zd_token", response.token);
    localStorage.setItem("zd_user", JSON.stringify(response.user));
    setUser(response.user);
    applyTheme(ROLE_THEMES[response.user.role]);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("zd_token");
    localStorage.removeItem("zd_user");
    setUser(null);
    document.documentElement.removeAttribute("data-theme");
  }, []);

  const getToken = useCallback(() => localStorage.getItem("zd_token"), []);

  const theme = user ? ROLE_THEMES[user.role] : null;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getToken, theme, ROLE_THEMES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;