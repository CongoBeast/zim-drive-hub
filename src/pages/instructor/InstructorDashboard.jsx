import { CalendarDays, CheckCircle, Clock, RefreshCw, Users } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const TODAY_LESSONS = [
  { time: "08:00", student: "Farai Zimba",    cls: "Class 1", duration: "1hr", status: "completed"   },
  { time: "10:00", student: "Rudo Kambarami", cls: "Class 1", duration: "1hr", status: "in-progress" },
  { time: "13:00", student: "Nyasha Dube",    cls: "Class 2", duration: "2hr", status: "upcoming"    },
  { time: "16:00", student: "Tendai Makoni",  cls: "Class 1", duration: "1hr", status: "upcoming"    },
];

const STATUS_MAP = {
  "upcoming":    { label: "Upcoming",    bg: "rgba(5,150,105,0.12)",   color: "#059669" },
  "in-progress": { label: "In Progress", bg: "rgba(245,158,11,0.12)",  color: "#f59e0b" },
  "completed":   { label: "Completed",   bg: "rgba(100,116,139,0.12)", color: "#64748b" },
};

export default function InstructorDashboard() {
  const { user, theme } = useAuth();
  const p = theme?.primary || "#059669";
  const a = theme?.accent  || "#f59e0b";

  const stats = [
    { icon: CalendarDays, label: "Lessons Today",       value: "4",  color: p },
    { icon: CheckCircle,  label: "Completed This Week", value: "18", color: "#22c55e" },
    { icon: Users,        label: "Active Students",     value: "22", color: a },
    { icon: RefreshCw,    label: "Pending Requests",    value: "2",  color: "#f59e0b" },
  ];

  return (
    <Layout>
      <style>{`
        .zd-inst-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
          margin-bottom: 1.25rem;
        }
        @media (min-width: 900px) {
          .zd-inst-stats { grid-template-columns: repeat(4, 1fr); }
        }
        .zd-inst-stat-card {
          background: var(--zd-surface);
          border: 1px solid var(--zd-border);
          border-radius: 14px;
          padding: 1.1rem;
          transition: transform 0.15s ease;
        }
        .zd-inst-stat-card:hover { transform: translateY(-2px); }
        .zd-lesson-list { display: flex; flex-direction: column; gap: 10px; }
        .zd-lesson-row {
          display: flex; align-items: center; gap: 14px;
          padding: 0.85rem 1rem; border-radius: 10px;
          background: var(--zd-surface-alt);
          border: 1px solid var(--zd-border);
          transition: border-color 0.13s;
        }
        .zd-lesson-row:hover { border-color: var(--zd-primary); }
        .zd-time-block {
          text-align: center; flex-shrink: 0;
          padding-right: 14px;
          border-right: 2px solid var(--zd-border);
          min-width: 52px;
        }
        .zd-complete-btn {
          padding: 0.35rem 0.85rem; border-radius: 7px;
          border: none; background: var(--zd-gradient);
          color: #fff; font-size: 0.75rem; font-weight: 600;
          font-family: inherit; cursor: pointer;
          white-space: nowrap; flex-shrink: 0;
          transition: filter 0.13s;
        }
        .zd-complete-btn:hover { filter: brightness(1.1); }
        .zd-inst-badge {
          display: inline-block; font-size: 0.7rem; font-weight: 700;
          padding: 3px 9px; border-radius: 20px;
          white-space: nowrap; flex-shrink: 0;
        }
      `}</style>

      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4 }}>
          Your Schedule, {user?.name?.split(" ")[0]} 🚗
        </h4>
        <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
          Manage today's lessons and track your progress.
        </p>
      </div>

      <div className="zd-inst-stats">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <div key={i} className="zd-inst-stat-card">
            <div style={{ width: 38, height: 38, borderRadius: 9, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--zd-text)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--zd-text-muted)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--zd-surface)", border: "1px solid var(--zd-border)", borderRadius: 14, padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--zd-text)" }}>Today's Lessons</div>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, background: `${p}18`, color: "var(--zd-primary)", padding: "3px 10px", borderRadius: 20 }}>
            {TODAY_LESSONS.length} total
          </span>
        </div>
        <div className="zd-lesson-list">
          {TODAY_LESSONS.map((lesson, i) => {
            const s = STATUS_MAP[lesson.status];
            return (
              <div key={i} className="zd-lesson-row">
                <div className="zd-time-block">
                  <Clock size={12} color="var(--zd-text-muted)" />
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--zd-text)", marginTop: 2, lineHeight: 1 }}>{lesson.time}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--zd-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.student}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--zd-text-muted)", marginTop: 2 }}>{lesson.cls} &middot; {lesson.duration}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span className="zd-inst-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  {lesson.status === "in-progress" && <button className="zd-complete-btn">Mark Complete</button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}