import { BookOpen, CalendarDays, CreditCard, Bell, Clock, Car } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const UPCOMING_LESSONS = [
  { date: "Thu 20 Feb", time: "10:00", instructor: "Blessing Chikwanda", cls: "Class 1", location: "Avondale Test Centre" },
  { date: "Sat 22 Feb", time: "08:30", instructor: "Grace Mutasa",       cls: "Class 1", location: "Belvedere Grounds"   },
];

const NOTIFICATIONS = [
  { type: "postponed", msg: "Your lesson on 18 Feb was moved to 20 Feb",          time: "2h ago" },
  { type: "reminder",  msg: "Lesson tomorrow at 10:00 AM with Blessing Chikwanda", time: "5h ago" },
];

export default function StudentDashboard() {
  const { user, theme } = useAuth();

  const lessonsRemaining = user?.lessonsRemaining ?? 8;
  const totalLessons     = 12;
  const progress         = Math.round((lessonsRemaining / totalLessons) * 100);
  const p                = theme?.primary || "#2563eb";
  const a                = theme?.accent  || "#f97316";

  const stats = [
    { icon: CalendarDays, label: "Upcoming Lessons", value: "2",       color: p },
    { icon: Car,          label: "License Class",    value: "Class 1", color: a },
    { icon: Clock,        label: "Hours Logged",     value: "6.5h",    color: "#8b5cf6" },
    { icon: BookOpen,     label: "Next Lesson",      value: "Tomorrow",color: "#22c55e" },
  ];

  return (
    <Layout>
      <style>{`
        .zd-stu-top {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.875rem;
          margin-bottom: 1.25rem;
        }
        @media (min-width: 768px) {
          .zd-stu-top { grid-template-columns: 1fr 1fr; }
        }

        .zd-stu-mini-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          height: 100%;
        }

        .zd-stu-mini-card {
          background: var(--zd-surface);
          border: 1px solid var(--zd-border);
          border-radius: 12px;
          padding: 1rem;
        }

        .zd-stu-bottom {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.875rem;
        }
        @media (min-width: 900px) {
          .zd-stu-bottom { grid-template-columns: 1fr 340px; }
        }

        .zd-balance-card {
          border-radius: 14px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          background: var(--zd-gradient);
        }

        .zd-balance-glow {
          position: absolute;
          right: -20px; top: -20px;
          width: 130px; height: 130px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          pointer-events: none;
        }

        .zd-progress-bar-track {
          height: 7px; border-radius: 10px;
          background: rgba(255,255,255,0.25);
          margin: 0.75rem 0 0.4rem;
          overflow: hidden;
        }

        .zd-progress-bar-fill {
          height: 100%; border-radius: 10px;
          background: rgba(255,255,255,0.9);
          transition: width 0.6s ease;
        }

        .zd-lesson-card {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 0.85rem 1rem; border-radius: 10px;
          background: var(--zd-surface-alt);
          border: 1px solid var(--zd-border);
          transition: border-color 0.13s;
          margin-bottom: 8px;
        }
        .zd-lesson-card:last-child { margin-bottom: 0; }
        .zd-lesson-card:hover { border-color: var(--zd-primary); }

        .zd-date-chip {
          border-radius: 8px;
          text-align: center;
          padding: 8px 10px;
          flex-shrink: 0;
          min-width: 50px;
        }

        .zd-notif-card {
          padding: 0.75rem 0.9rem;
          border-radius: 9px;
          margin-bottom: 8px;
        }
        .zd-notif-card:last-child { margin-bottom: 0; }

        .zd-book-btn {
          padding: 0.38rem 0.9rem;
          border-radius: 8px;
          border: none;
          background: var(--zd-gradient);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: filter 0.13s;
        }
        .zd-book-btn:hover { filter: brightness(1.1); }

        .zd-section-card {
          background: var(--zd-surface);
          border: 1px solid var(--zd-border);
          border-radius: 14px;
          padding: 1.25rem;
        }
        .zd-section-title {
          font-size: 0.92rem; font-weight: 700;
          color: var(--zd-text); margin-bottom: 1rem;
          display: flex; align-items: center; gap: 7px;
        }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4 }}>
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h4>
        <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
          Track your lessons, bookings and progress below.
        </p>
      </div>

      {/* Top: balance card + mini stats */}
      <div className="zd-stu-top">

        {/* Lesson balance */}
        <div className="zd-balance-card">
          <div className="zd-balance-glow" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.4rem" }}>
              <CreditCard size={16} color="rgba(255,255,255,0.8)" />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontWeight: 600 }}>
                Lesson Balance
              </span>
            </div>
            <div style={{ fontSize: "3.2rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.05em", lineHeight: 1 }}>
              {lessonsRemaining}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.83rem" }}>
              lessons remaining of {totalLessons}
            </div>
            <div className="zd-progress-bar-track">
              <div className="zd-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>
              {totalLessons - lessonsRemaining} of {totalLessons} lessons used
            </div>
          </div>
        </div>

        {/* Mini stat cards */}
        <div className="zd-stu-mini-stats">
          {stats.map(({ icon: Icon, label, value, color }, i) => (
            <div key={i} className="zd-stu-mini-card">
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.6rem" }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--zd-text)", letterSpacing: "-0.03em" }}>{value}</div>
              <div style={{ fontSize: "0.74rem", color: "var(--zd-text-muted)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: upcoming lessons + notifications */}
      <div className="zd-stu-bottom">

        {/* Upcoming lessons */}
        <div className="zd-section-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div className="zd-section-title" style={{ marginBottom: 0 }}>Upcoming Lessons</div>
            <button className="zd-book-btn">+ Book Lesson</button>
          </div>
          {UPCOMING_LESSONS.map((lesson, i) => {
            const [day, dd, mon] = lesson.date.split(" ");
            return (
              <div key={i} className="zd-lesson-card">
                {/* Date chip */}
                <div className="zd-date-chip" style={{ background: `${p}18`, color: "var(--zd-primary)" }}>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{day}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 900, lineHeight: 1.1 }}>{dd}</div>
                  <div style={{ fontSize: "0.6rem", fontWeight: 600 }}>{mon}</div>
                </div>
                {/* Details */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--zd-text)" }}>
                    {lesson.time} &middot; {lesson.cls}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--zd-text-muted)", marginTop: 2 }}>
                    with {lesson.instructor}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--zd-text-muted)", marginTop: 2 }}>
                    📍 {lesson.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notifications */}
        <div className="zd-section-card">
          <div className="zd-section-title">
            <Bell size={15} />
            Notifications
          </div>
          {NOTIFICATIONS.map((n, i) => (
            <div
              key={i}
              className="zd-notif-card"
              style={{
                background: n.type === "postponed" ? "rgba(245,158,11,0.1)" : `${p}0d`,
                border: `1px solid ${n.type === "postponed" ? "rgba(245,158,11,0.25)" : `${p}25`}`,
              }}
            >
              <div style={{ fontSize: "0.82rem", color: "var(--zd-text)", fontWeight: 500, marginBottom: 3 }}>
                {n.msg}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--zd-text-muted)" }}>{n.time}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}