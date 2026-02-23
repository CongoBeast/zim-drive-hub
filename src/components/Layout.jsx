import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, CalendarDays, CreditCard, BookOpen,
  Bell, LogOut, Menu, Car, GraduationCap, ClipboardList,
  RefreshCw, ChevronRight, Settings, Shield, CarFront,
} from "lucide-react";

const NAV_ITEMS = {
  admin: [
    { label: "Dashboard",   icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Students",    icon: GraduationCap,   path: "/admin/students" },
    { label: "Instructors", icon: Users,            path: "/admin/instructors" },
    { label: "Bookings",    icon: CalendarDays,     path: "/admin/bookings" },
    { label: "Payments",    icon: CreditCard,       path: "/admin/payments" },
    { label: "Approvals",   icon: ClipboardList,    path: "/admin/approvals" },
    { label: "Fleet Management",   icon: CarFront,    path: "/admin/fleet-management" },
    { label: "Settings",    icon: Settings,         path: "/admin/settings" },
  ],
  instructor: [
    { label: "Dashboard",       icon: LayoutDashboard, path: "/instructor/dashboard" },
    { label: "My Schedule",     icon: CalendarDays,    path: "/instructor/schedule" },
    { label: "Lessons",         icon: BookOpen,        path: "/instructor/lessons" },
    { label: "Change Requests", icon: RefreshCw,       path: "/instructor/change-requests" },
    { label: "Notifications",   icon: Bell,            path: "/instructor/notifications" },
  ],
  student: [
    { label: "Dashboard",      icon: LayoutDashboard, path: "/student/dashboard" },
    { label: "Book a Lesson",  icon: BookOpen,        path: "/student/book" },
    { label: "My Schedule",    icon: CalendarDays,    path: "/student/schedule" },
    { label: "Lesson Balance", icon: CreditCard,      path: "/student/balance" },
    { label: "Notifications",  icon: Bell,            path: "/student/notifications" },
  ],
};

const ROLE_ICONS  = { admin: Shield, instructor: Car, student: GraduationCap };
const ROLE_LABELS = { admin: "Administrator", instructor: "Instructor", student: "Student" };

/* ── Sidebar inner content (shared between desktop & mobile drawer) ── */
function SidebarContent({ user, theme, navItems, RoleIcon, isActive, onNav, onLogout }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "var(--zd-sidebar-bg)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Brand strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "1.1rem 1rem",
        background: "var(--zd-gradient)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Car size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            ZimDriveHub
          </div>
          <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Driving School Platform
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: "0.75rem 0.75rem 0.25rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "0.4rem 0.65rem",
          borderRadius: 7,
          background: `${theme?.primary}18`,
          border: `1px solid ${theme?.primary}35`,
        }}>
          <RoleIcon size={13} color="var(--zd-primary)" />
          <span style={{
            fontSize: "0.68rem", fontWeight: 700,
            color: "var(--zd-primary)",
            letterSpacing: "0.07em", textTransform: "uppercase",
          }}>
            {ROLE_LABELS[user?.role]}
          </span>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: "0.6rem 1rem 0.3rem", fontSize: "0.62rem", fontWeight: 700, color: "var(--zd-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Menu
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "0 0.5rem 0.75rem" }}>
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              onClick={onNav}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "0.55rem 0.75rem",
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: "none",
                fontSize: "0.855rem",
                fontWeight: active ? 600 : 400,
                color: active ? "var(--zd-text-on-primary)" : "var(--zd-text)",
                background: active ? "var(--zd-primary)" : "transparent",
                border: `1px solid ${active ? "var(--zd-primary)" : "transparent"}`,
                transition: "background 0.13s, color 0.13s",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = `${theme?.primary}14`;
                  e.currentTarget.style.color = "var(--zd-primary)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--zd-text)";
                }
              }}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={13} style={{ opacity: 0.7 }} />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{
        padding: "0.75rem",
        borderTop: "1px solid var(--zd-border)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "0.6rem" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
            background: "var(--zd-gradient)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", fontWeight: 700,
          }}>
            {user?.avatar}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{
              fontSize: "0.82rem", fontWeight: 600,
              color: "var(--zd-text)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {user?.name}
            </div>
            <div style={{
              fontSize: "0.7rem", color: "var(--zd-text-muted)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 7, padding: "0.45rem 0.75rem",
            background: "transparent",
            border: "1px solid var(--zd-border)",
            borderRadius: 8,
            color: "var(--zd-text-muted)",
            fontSize: "0.8rem", fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.13s, color 0.13s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--zd-text-muted)"; }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const { user, logout, theme } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = NAV_ITEMS[user?.role] || [];
  const RoleIcon = ROLE_ICONS[user?.role] || Shield;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate("/login"); };
  const closeMobile  = () => setMobileOpen(false);

  return (
    <>
      <style>{`
        .zd-layout {
          display: flex;
          min-height: 100vh;
          background: var(--zd-bg);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Desktop sidebar ── */
        .zd-sidebar {
          width: 242px;
          flex-shrink: 0;
          border-right: 1px solid var(--zd-border);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: none;
        }

        @media (min-width: 992px) {
          .zd-sidebar { display: flex; flex-direction: column; }
        }

        /* ── Mobile drawer overlay ── */
        .zd-mobile-overlay {
          position: fixed; inset: 0; z-index: 1050;
          display: flex;
        }

        .zd-mobile-backdrop {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(2px);
        }

        .zd-mobile-drawer {
          position: relative; z-index: 1;
          width: 255px;
          height: 100%;
          flex-shrink: 0;
        }

        /* ── Main area ── */
        .zd-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* ── Topbar ── */
        .zd-topbar {
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          background: var(--zd-surface);
          border-bottom: 1px solid var(--zd-border);
          position: sticky;
          top: 0;
          z-index: 100;
          flex-shrink: 0;
        }

        .zd-topbar-left { display: flex; align-items: center; gap: 10px; }
        .zd-topbar-right { display: flex; align-items: center; gap: 8px; }

        .zd-menu-btn {
          background: none; border: none; cursor: pointer;
          color: var(--zd-text); padding: 4px; border-radius: 6px;
          display: flex; align-items: center;
          line-height: 1;
        }

        @media (min-width: 992px) { .zd-menu-btn { display: none; } }

        .zd-topbar-title {
          font-weight: 600; font-size: 0.95rem;
          color: var(--zd-text);
        }

        .zd-bell-btn {
          position: relative;
          background: none; border: none; cursor: pointer;
          color: var(--zd-primary);
          padding: 7px; border-radius: 8px;
          background: var(--zd-surface-alt);
          display: flex; align-items: center;
          line-height: 1;
          border: 1px solid var(--zd-border);
        }

        .zd-bell-dot {
          position: absolute; top: 5px; right: 5px;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--zd-accent);
        }

        .zd-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: var(--zd-gradient);
          color: #fff; font-size: 0.75rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          border: 2px solid var(--zd-border);
        }

        /* ── Page content ── */
        .zd-page {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          color: var(--zd-text);
        }

        @media (min-width: 992px) {
          .zd-page { padding: 1.75rem 2rem; }
        }
      `}</style>

      <div className="zd-layout">
        {/* Desktop sidebar */}
        <aside className="zd-sidebar">
          <SidebarContent
            user={user} theme={theme} navItems={navItems}
            RoleIcon={RoleIcon} isActive={isActive}
            onNav={() => {}} onLogout={handleLogout}
          />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="zd-mobile-overlay">
            <div className="zd-mobile-backdrop" onClick={closeMobile} />
            <div className="zd-mobile-drawer">
              <SidebarContent
                user={user} theme={theme} navItems={navItems}
                RoleIcon={RoleIcon} isActive={isActive}
                onNav={closeMobile} onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        {/* Main area */}
        <div className="zd-main">
          {/* Topbar */}
          <header className="zd-topbar">
            <div className="zd-topbar-left">
              <button className="zd-menu-btn" onClick={() => setMobileOpen(true)}>
                <Menu size={20} />
              </button>
              <span className="zd-topbar-title">
                {navItems.find(n => isActive(n.path))?.label || "ZimDriveHub"}
              </span>
            </div>
            <div className="zd-topbar-right">
              <button className="zd-bell-btn">
                <Bell size={16} />
                <span className="zd-bell-dot" />
              </button>
              <div className="zd-avatar" title={user?.name}>
                {user?.avatar}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="zd-page">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}