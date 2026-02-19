import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, Eye, EyeOff, AlertCircle, Lock, Mail, CheckCircle } from "lucide-react";
import { getRoleDashboard } from "../components/ProtectedRoute";

/* ─── inline styles that need to beat Bootstrap specificity ─── */
const INPUT_STYLE = {
  backgroundColor: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#e2e8f0",
  borderRadius: "0.55rem",
  fontSize: "0.875rem",
  outline: "none",
  boxShadow: "none",
  WebkitAppearance: "none",
  width: "100%",
  padding: "0.55rem 0.75rem",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease",
};

const DEMO_ACCOUNTS = [
  { label: "Admin",      email: "admin@zimdrivehub.co.zw",      color: "#4f46e5", dot: "#818cf8" },
  { label: "Instructor", email: "instructor@zimdrivehub.co.zw", color: "#059669", dot: "#34d399" },
  { label: "Student",    email: "student@zimdrivehub.co.zw",    color: "#2563eb", dot: "#60a5fa" },
];

const CLASS_BADGES = [
  { label: "Class 1 — Light Vehicles", sub: "Cars & sedans",    dot: "#818cf8" },
  { label: "Class 2 — Heavy Vehicles", sub: "2-tonne trucks",   dot: "#34d399" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname;

  const [form,         setForm]         = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [activeDemo,   setActiveDemo]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      navigate(from || getRoleDashboard(user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setForm({ email: acc.email, password: "demo1234" });
    setActiveDemo(acc.label);
    setError("");
  };

  return (
    <>
      {/* ── Scoped CSS to beat Bootstrap's form-control overrides ── */}
      <style>{`
        .zd-login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 55%, #16213e 100%);
          font-family: 'DM Sans', sans-serif;
        }

        /* Left decorative panel */
        .zd-left-panel {
          display: none;
          flex: 0 0 46%;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        @media (min-width: 992px) {
          .zd-left-panel { display: flex; }
        }

        .zd-left-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 25% 35%, rgba(79,70,229,0.28) 0%, transparent 55%),
            radial-gradient(circle at 75% 80%, rgba(6,182,212,0.12) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Right form panel */
        .zd-right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          min-width: 0;
        }

        .zd-form-wrapper {
          width: 100%;
          max-width: 420px;
        }

        /* Glass card */
        .zd-card {
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1.25rem;
          padding: 2rem;
          backdrop-filter: blur(24px);
        }

        /* Dark inputs — override Bootstrap completely */
        .zd-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .zd-input-icon {
          position: absolute;
          left: 11px;
          color: #64748b;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .zd-input {
          width: 100%;
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: #e2e8f0 !important;
          border-radius: 0.55rem !important;
          font-size: 0.875rem;
          padding: 0.6rem 0.75rem 0.6rem 2.4rem;
          font-family: inherit;
          box-shadow: none !important;
          outline: none;
          transition: border-color 0.15s ease;
          -webkit-appearance: none;
        }

        .zd-input.has-right-icon {
          padding-right: 2.6rem;
        }

        .zd-input:focus {
          border-color: rgba(129,140,248,0.7) !important;
          background: rgba(255,255,255,0.1) !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.18) !important;
        }

        .zd-input::placeholder {
          color: #475569;
        }

        /* Fix browser autofill yellow flash */
        .zd-input:-webkit-autofill,
        .zd-input:-webkit-autofill:hover,
        .zd-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #1e1e35 inset !important;
          -webkit-text-fill-color: #e2e8f0 !important;
          border-color: rgba(255,255,255,0.15) !important;
          caret-color: #e2e8f0;
        }

        .zd-eye-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          display: flex;
          align-items: center;
          padding: 0;
          line-height: 1;
        }

        .zd-eye-btn:hover { color: #94a3b8; }

        /* Demo pills */
        .zd-demo-pill {
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.35rem 1rem;
          cursor: pointer;
          border: 1px solid;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1;
        }

        .zd-demo-pill:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        /* Submit button */
        .zd-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border: none;
          color: #fff;
          border-radius: 0.6rem;
          padding: 0.7rem;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(79,70,229,0.4);
          transition: filter 0.15s ease, transform 0.1s ease;
        }

        .zd-submit-btn:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .zd-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Class badges on left panel */
        .zd-class-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }
      `}</style>

      <div className="zd-login-page">

        {/* ════════ LEFT PANEL ════════ */}
        <div className="zd-left-panel">
          <div className="zd-left-glow" />

          {/* Top: brand */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2.5rem" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "rgba(79,70,229,0.25)",
                border: "1px solid rgba(79,70,229,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Car size={22} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.15rem", color: "#e2e8f0", letterSpacing: "-0.02em" }}>
                  ZimDriveHub
                </div>
                <div style={{ fontSize: "0.6rem", color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Driving School Platform
                </div>
              </div>
            </div>

            <h2 style={{
              fontSize: "2.5rem", fontWeight: 900, color: "#e2e8f0",
              lineHeight: 1.08, letterSpacing: "-0.035em", marginBottom: "1.1rem",
            }}>
              Zimbabwe's Premier<br />
              <span style={{ color: "#818cf8" }}>Driving School</span><br />
              Management System
            </h2>

            <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.75, maxWidth: 360 }}>
              Manage student bookings, instructor scheduling, lesson balances and more —
              all from a single unified platform built for Zimbabwe.
            </p>
          </div>

          {/* Bottom: class badges */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Supported License Classes
            </div>
            {CLASS_BADGES.map((c, i) => (
              <div key={i} className="zd-class-badge">
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                <div>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.875rem" }}>{c.label}</div>
                  <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 1 }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════ RIGHT PANEL ════════ */}
        <div className="zd-right-panel">
          <div className="zd-form-wrapper">

            {/* Mobile logo (only visible < lg) */}
            <div style={{
              display: "none",
              alignItems: "center", gap: 8, justifyContent: "center",
              marginBottom: "1.5rem",
            }}
            className="zd-mobile-logo"
            >
              <Car size={20} color="#818cf8" />
              <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "1.05rem" }}>ZimDriveHub</span>
            </div>

            <div className="zd-card">
              {/* Header */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#e2e8f0", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.025em", margin: 0 }}>
                  Welcome back
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: 4, marginBottom: 0 }}>
                  Sign in to your account to continue
                </p>
              </div>

              {/* Demo account pills */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                  Quick demo access
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.label}
                      type="button"
                      onClick={() => fillDemo(acc)}
                      className="zd-demo-pill"
                      style={{
                        background: activeDemo === acc.label ? `${acc.color}30` : `${acc.color}15`,
                        borderColor: activeDemo === acc.label ? acc.color : `${acc.color}40`,
                        color: acc.color,
                      }}
                    >
                      {activeDemo === acc.label && <CheckCircle size={12} />}
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem",
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                <span style={{ color: "#334155", fontSize: "0.72rem", fontWeight: 500, whiteSpace: "nowrap" }}>
                  or enter manually
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>

              <form onSubmit={handleSubmit}>
                {/* Error */}
                {error && (
                  <div style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "0.6rem", padding: "0.75rem", marginBottom: "1rem",
                  }}>
                    <AlertCircle size={15} color="#f87171" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ color: "#f87171", fontSize: "0.82rem", lineHeight: 1.4 }}>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div style={{ marginBottom: "0.875rem" }}>
                  <label style={{
                    display: "block", color: "#94a3b8", fontSize: "0.8rem",
                    fontWeight: 500, marginBottom: "0.4rem",
                  }}>
                    Email address
                  </label>
                  <div className="zd-input-wrap">
                    <span className="zd-input-icon"><Mail size={15} /></span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                      placeholder="you@zimdrivehub.co.zw"
                      className="zd-input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{
                    display: "block", color: "#94a3b8", fontSize: "0.8rem",
                    fontWeight: 500, marginBottom: "0.4rem",
                  }}>
                    Password
                  </label>
                  <div className="zd-input-wrap">
                    <span className="zd-input-icon"><Lock size={15} /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      required
                      placeholder="••••••••"
                      className="zd-input has-right-icon"
                    />
                    <button
                      type="button"
                      className="zd-eye-btn"
                      onClick={() => setShowPassword(p => !p)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="zd-submit-btn" disabled={loading}>
                  {loading && (
                    <span
                      style={{
                        display: "inline-block", width: 14, height: 14,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                        marginRight: 8, verticalAlign: "middle",
                      }}
                    />
                  )}
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </div>

            {/* Footer hint */}
            <p style={{ textAlign: "center", marginTop: "1rem", color: "#334155", fontSize: "0.75rem" }}>
              Demo password for all accounts:{" "}
              <code style={{ color: "#818cf8", background: "rgba(129,140,248,0.12)", padding: "1px 6px", borderRadius: 4 }}>
                demo1234
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 991px) { .zd-mobile-logo { display: flex !important; } }
      `}</style>
    </>
  );
}