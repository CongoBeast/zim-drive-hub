import { GraduationCap, Users, CalendarDays, CreditCard, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const RECENT_BOOKINGS = [
  { student: "Rudo Kambarami",  instructor: "Blessing Chikwanda", cls: "Class 1", date: "Today 10:00",    status: "confirmed" },
  { student: "Takudzwa Ndoro",  instructor: "Grace Mutasa",       cls: "Class 2", date: "Today 14:00",    status: "pending"   },
  { student: "Farai Zimba",     instructor: "Blessing Chikwanda", cls: "Class 1", date: "Tomorrow 09:00", status: "confirmed" },
  { student: "Nyasha Moyo",     instructor: "John Sithole",       cls: "Class 1", date: "Tomorrow 11:00", status: "pending"   },
];

const STATUS_MAP = {
  confirmed: { bg: "rgba(34,197,94,0.12)",  color: "#22c55e", label: "Confirmed" },
  pending:   { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Pending"   },
};

/* ─── Reusable card components using only inline styles ─── */
function StatCard({ icon: Icon, label, value, badge, color }) {
  return (
    <div
      style={{
        background: "var(--zd-surface)",
        border: "1px solid var(--zd-border)",
        borderRadius: 14,
        padding: "1.2rem",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.9rem" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon size={20} color={color} />
        </div>
        <span style={{
          fontSize: "0.68rem", fontWeight: 700,
          color: "#22c55e",
          background: "rgba(34,197,94,0.12)",
          padding: "3px 8px", borderRadius: 20,
        }}>
          ↑ {badge}
        </span>
      </div>
      <div style={{ fontSize: "1.9rem", fontWeight: 900, color: "var(--zd-text)", letterSpacing: "-0.04em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--zd-text-muted)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function SectionCard({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--zd-surface)",
      border: "1px solid var(--zd-border)",
      borderRadius: 14,
      padding: "1.25rem",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--zd-text)", marginBottom: "1rem" }}>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, theme } = useAuth();

  const stats = [
    { icon: GraduationCap, label: "Total Students",  value: "248",    badge: "12% this month",  color: theme?.primary || "#4f46e5" },
    { icon: Users,          label: "Instructors",     value: "14",     badge: "2 new",            color: theme?.accent  || "#06b6d4" },
    { icon: CalendarDays,   label: "Lessons Today",   value: "32",     badge: "8% vs yesterday", color: "#8b5cf6" },
    { icon: CreditCard,     label: "Revenue (USD)",   value: "$4,820", badge: "15% this week",   color: "#22c55e" },
  ];

  const quickActions = [
    { icon: CheckCircle,  label: "Approve Pending Requests", count: 3,    color: "#22c55e" },
    { icon: AlertTriangle,label: "Postponement Alerts",      count: 1,    color: "#f59e0b" },
    { icon: TrendingUp,   label: "Generate Month Report",    count: null, color: theme?.primary || "#4f46e5" },
    { icon: Clock,        label: "Upcoming Lessons Today",   count: 14,   color: "#8b5cf6" },
  ];

  return (
    <Layout>
      <style>{`
        .zd-admin-grid-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
          margin-bottom: 1.25rem;
        }
        @media (min-width: 1200px) {
          .zd-admin-grid-stats { grid-template-columns: repeat(4, 1fr); }
        }

        .zd-admin-grid-bottom {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.875rem;
        }
        @media (min-width: 1100px) {
          .zd-admin-grid-bottom { grid-template-columns: 1fr 340px; }
        }

        /* Table overrides — remove Bootstrap's white bg */
        .zd-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
        .zd-table th {
          color: var(--zd-text-muted); font-weight: 600;
          font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase;
          padding: 0 0.5rem 0.75rem;
          border-bottom: 1px solid var(--zd-border);
          background: transparent; text-align: left; white-space: nowrap;
        }
        .zd-table td {
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid var(--zd-border);
          color: var(--zd-text);
          background: transparent;
          vertical-align: middle;
        }
        .zd-table tr:last-child td { border-bottom: none; }

        .zd-badge {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700;
          padding: 3px 9px; border-radius: 20px;
          white-space: nowrap;
        }

        .zd-action-btn {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 0.65rem 0.85rem; border-radius: 9px;
          border: 1px solid; cursor: pointer;
          font-size: 0.84rem; font-weight: 500;
          font-family: inherit;
          background: transparent;
          color: var(--zd-text);
          text-align: left;
          transition: filter 0.13s ease, transform 0.1s ease;
          margin-bottom: 6px;
        }
        .zd-action-btn:hover { filter: brightness(1.05); transform: translateX(2px); }
        .zd-action-btn:last-child { margin-bottom: 0; }

        .zd-view-all-btn {
          font-size: 0.78rem; font-weight: 600;
          padding: 0.35rem 0.85rem; border-radius: 7px;
          border: none; cursor: pointer;
          font-family: inherit;
          background: var(--zd-surface-alt);
          color: var(--zd-primary);
          border: 1px solid var(--zd-border);
          transition: background 0.13s;
        }
        .zd-view-all-btn:hover { background: var(--zd-border); }

        .zd-count-pill {
          margin-left: auto; flex-shrink: 0;
          font-size: 0.7rem; font-weight: 700;
          padding: 2px 8px; border-radius: 20px;
          color: #fff;
        }

        @media (max-width: 600px) {
          .zd-table-wrap { overflow-x: auto; }
          .zd-admin-grid-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{
          fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em",
          color: "var(--zd-text)", margin: 0, marginBottom: 4,
        }}>
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h4>
        <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
          Here's what's happening at your driving school today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="zd-admin-grid-stats">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Bottom grid */}
      <div className="zd-admin-grid-bottom">
        {/* Recent bookings table */}
        <SectionCard>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <SectionTitle>Recent Bookings</SectionTitle>
            <button className="zd-view-all-btn">View all</button>
          </div>
          <div className="zd-table-wrap">
            <table className="zd-table">
              <thead>
                <tr>
                  {["Student", "Instructor", "Class", "Date / Time", "Status"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_BOOKINGS.map((b, i) => {
                  const s = STATUS_MAP[b.status];
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{b.student}</td>
                      <td style={{ color: "var(--zd-text-muted)" }}>{b.instructor}</td>
                      <td>
                        <span className="zd-badge" style={{
                          background: `${theme?.primary || "#4f46e5"}18`,
                          color: "var(--zd-primary)",
                        }}>
                          {b.cls}
                        </span>
                      </td>
                      <td style={{ color: "var(--zd-text-muted)" }}>{b.date}</td>
                      <td>
                        <span className="zd-badge" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Quick actions */}
        <SectionCard>
          <SectionTitle>Quick Actions</SectionTitle>
          <div>
            {quickActions.map(({ icon: Icon, label, count, color }, i) => (
              <button
                key={i}
                className="zd-action-btn"
                style={{ borderColor: `${color}30`, background: `${color}08` }}
              >
                <Icon size={16} color={color} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, color: "var(--zd-text)" }}>{label}</span>
                {count !== null && (
                  <span className="zd-count-pill" style={{ background: color }}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </Layout>
  );
}