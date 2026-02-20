import { useState } from "react";
import { Bell, RefreshCw, CheckCircle, Clock, AlertTriangle, Info, X, BellOff, CalendarDays, User } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const ALL_NOTIFS = [
  { id: 1, type: "booking",    read: false, title: "New Lesson Assigned",
    msg: "You have been assigned a new lesson with Chiedza Moyo on Monday 23 Feb at 09:00 at Borrowdale Track (Class 1, 1hr).",
    time: "1 hour ago", action: "View Schedule" },
  { id: 2, type: "change",     read: false, title: "Schedule Change Approved",
    msg: "Your request to reschedule Rudo Kambarami's lesson from 18 Feb to 20 Feb has been approved by Admin.",
    time: "3 hours ago", action: "View Schedule" },
  { id: 3, type: "reminder",   read: false, title: "Lesson in 1 Hour",
    msg: "Reminder: Your lesson with Nyasha Dube begins at 13:00 today at Belvedere Grounds. Class 2 — 2hr session.",
    time: "5 hours ago", action: null },
  { id: 4, type: "alert",      read: false, title: "Leave Request Pending",
    msg: "Your leave request for 25–26 Feb is awaiting admin approval. You will be notified once a decision is made.",
    time: "Yesterday", action: null },
  { id: 5, type: "booking",    read: true,  title: "Lesson Booking Confirmed",
    msg: "Tatenda Rusere's lesson on 21 Feb at 09:00 has been confirmed and added to your schedule.",
    time: "2 days ago", action: null },
  { id: 6, type: "change",     read: true,  title: "Change Request Declined",
    msg: "Admin has declined your request to reschedule Farai Zimba's lesson on 12 Feb. The original time has been kept.",
    time: "3 days ago", action: "Contact Admin" },
  { id: 7, type: "reminder",   read: true,  title: "Weekly Schedule Ready",
    msg: "Your schedule for the week of 17–23 Feb has been finalised. You have 18 lessons this week.",
    time: "5 days ago", action: "View Schedule" },
  { id: 8, type: "alert",      read: true,  title: "Student Lesson Balance Low",
    msg: "Nyasha Dube has only 2 lesson credits remaining. Admin has been notified to arrange a top-up.",
    time: "1 week ago", action: null },
  { id: 9, type: "info",       read: true,  title: "New Student Assigned to You",
    msg: "Simba Ndlovu has been assigned to you for Class 2 training. Their first lesson is scheduled for 05 Feb.",
    time: "2 weeks ago", action: null },
];

const TYPE_CFG = {
  booking:  { icon: CalendarDays,  color: "#2563eb", bg: "rgba(37,99,235,0.09)",   border: "rgba(37,99,235,0.2)",   label: "Booking"   },
  change:   { icon: RefreshCw,     color: "#f59e0b", bg: "rgba(245,158,11,0.09)",  border: "rgba(245,158,11,0.25)", label: "Schedule"  },
  reminder: { icon: Clock,         color: "#059669", bg: "rgba(5,150,105,0.09)",   border: "rgba(5,150,105,0.2)",   label: "Reminder"  },
  alert:    { icon: AlertTriangle, color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",   label: "Alert"     },
  info:     { icon: Info,          color: "#8b5cf6", bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.2)",  label: "Info"      },
};

const FILTERS = ["All","Unread","Bookings","Schedule","Alerts"];
const FILTER_MAP = { All: null, Unread: "unread", Bookings: "booking", Schedule: "change", Alerts: "alert" };

export default function InstructorNotifications() {
  const { theme } = useAuth();
  const p = theme?.primary || "#059669";

  const [notes,    setNotes]   = useState(ALL_NOTIFS);
  const [filter,   setFilter]  = useState("All");
  const [expanded, setExpand]  = useState(null);

  const unread      = notes.filter(n => !n.read).length;
  const markRead    = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss     = (id) => setNotes(prev => prev.filter(n => n.id !== id));
  const markAllRead = ()   => setNotes(prev => prev.map(n => ({ ...n, read: true })));

  const displayed = notes.filter(n => {
    const f = FILTER_MAP[filter];
    if (!f) return true;
    if (f === "unread") return !n.read;
    return n.type === f;
  });

  return (
    <Layout>
      <style>{`
        .zd-nf-bar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1.25rem; }
        .zd-nf-pill { padding: 0.38rem 0.9rem; border-radius: 20px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.78rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.13s; }
        .zd-nf-pill.active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }
        .zd-nf-pill:hover:not(.active) { border-color: var(--zd-primary); color: var(--zd-primary); }

        .zd-nf-card { border-radius: 12px; border: 1px solid; margin-bottom: 10px; overflow: hidden; transition: box-shadow 0.13s, transform 0.13s; cursor: pointer; }
        .zd-nf-card:last-child { margin-bottom: 0; }
        .zd-nf-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.07); }

        .zd-nf-inner { display: flex; align-items: flex-start; gap: 12px; padding: 1rem; }
        .zd-nf-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .zd-nf-body { flex: 1; min-width: 0; }
        .zd-nf-title { font-size: 0.875rem; font-weight: 700; color: var(--zd-text); margin-bottom: 2px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .zd-nf-msg { font-size: 0.8rem; color: var(--zd-text-muted); line-height: 1.55; overflow: hidden; transition: max-height 0.25s ease; }
        .zd-nf-meta { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
        .zd-nf-time { font-size: 0.7rem; color: var(--zd-text-muted); }
        .zd-nf-actions { display: flex; gap: 6px; padding: 0 1rem 0.85rem; }

        .zd-badge { display: inline-block; font-size: 0.64rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; white-space: nowrap; }
        .zd-nf-action-btn { padding: 0.35rem 0.85rem; border-radius: 7px; border: none; background: var(--zd-gradient); color: #fff; font-size: 0.75rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: filter 0.12s; }
        .zd-nf-action-btn:hover { filter: brightness(1.1); }
        .zd-dismiss-btn { padding: 0.35rem 0.75rem; border-radius: 7px; border: 1px solid var(--zd-border); background: transparent; color: var(--zd-text-muted); font-size: 0.75rem; font-weight: 500; font-family: inherit; cursor: pointer; }
        .zd-dismiss-btn:hover { background: var(--zd-surface-alt); }
        .zd-close-btn { background: none; border: none; cursor: pointer; color: var(--zd-text-muted); padding: 2px; border-radius: 5px; display: flex; align-items: center; flex-shrink: 0; }
        .zd-close-btn:hover { color: #ef4444; }
        .zd-mark-all-btn { padding: 0.38rem 0.9rem; border-radius: 8px; border: 1px solid var(--zd-border); background: transparent; color: var(--zd-text-muted); font-size: 0.78rem; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.13s; }
        .zd-mark-all-btn:hover { background: var(--zd-surface-alt); }
        .zd-empty { text-align: center; padding: 3rem; color: var(--zd-text-muted); background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 14px; }

        .zd-summary-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
        @media (max-width: 600px) { .zd-summary-bar { grid-template-columns: 1fr 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <Bell size={22} color={p} />
            Notifications
            {unread > 0 && <span style={{ background: p, color: "#fff", fontSize: "0.72rem", fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>{unread} new</span>}
          </h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            Lesson assignments, schedule updates and system alerts.
          </p>
        </div>
        {unread > 0 && (
          <button className="zd-mark-all-btn" onClick={markAllRead}>
            <CheckCircle size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />
            Mark all read
          </button>
        )}
      </div>

      {/* Summary bar */}
      <div className="zd-summary-bar">
        {Object.entries(TYPE_CFG).map(([key, cfg]) => {
          const cnt = notes.filter(n => n.type === key).length;
          const Icon = cfg.icon;
          return (
            <div key={key} style={{ background: "var(--zd-surface)", border: "1px solid var(--zd-border)", borderRadius: 12, padding: "0.85rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${cfg.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                <Icon size={15} color={cfg.color} />
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--zd-text)", letterSpacing: "-0.03em" }}>{cnt}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--zd-text-muted)", marginTop: 1 }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter pills */}
      <div className="zd-nf-bar">
        {FILTERS.map(f => (
          <button key={f} className={`zd-nf-pill${filter===f?" active":""}`} onClick={() => setFilter(f)}>
            {f}
            {f === "Unread" && unread > 0 && (
              <span style={{ marginLeft: 5, background: filter==="Unread" ? "rgba(255,255,255,0.25)" : `${p}20`, color: filter==="Unread" ? "#fff" : p, borderRadius: 20, padding: "0 5px", fontSize: "0.68rem", fontWeight: 800 }}>
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="zd-empty">
          <BellOff size={36} color="var(--zd-border)" style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 600, color: "var(--zd-text)", fontSize: "0.95rem", marginBottom: 4 }}>No notifications here</div>
          <div style={{ fontSize: "0.82rem" }}>You're all caught up!</div>
        </div>
      ) : displayed.map(n => {
        const cfg  = TYPE_CFG[n.type] || TYPE_CFG.info;
        const Icon = cfg.icon;
        const open = expanded === n.id;
        return (
          <div key={n.id} className="zd-nf-card"
            style={{ background: n.read ? "var(--zd-surface)" : cfg.bg, borderColor: n.read ? "var(--zd-border)" : cfg.border }}
            onClick={() => { setExpand(open ? null : n.id); if (!n.read) markRead(n.id); }}>
            <div className="zd-nf-inner">
              <div className="zd-nf-icon" style={{ background: `${cfg.color}18` }}>
                <Icon size={17} color={cfg.color} />
              </div>
              <div className="zd-nf-body">
                <div className="zd-nf-title">
                  {n.title}
                  <span className="zd-badge" style={{ background: `${cfg.color}18`, color: cfg.color }}>{cfg.label}</span>
                  {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: p, display: "inline-block", flexShrink: 0 }} />}
                </div>
                <div className="zd-nf-msg" style={{ maxHeight: open ? 200 : 44, overflow: "hidden" }}>{n.msg}</div>
                <div className="zd-nf-meta"><span className="zd-nf-time">{n.time}</span></div>
              </div>
              <button className="zd-close-btn" onClick={e => { e.stopPropagation(); dismiss(n.id); }} title="Dismiss"><X size={15} /></button>
            </div>
            {open && n.action && (
              <div className="zd-nf-actions" onClick={e => e.stopPropagation()}>
                <button className="zd-nf-action-btn">{n.action}</button>
                <button className="zd-dismiss-btn" onClick={() => dismiss(n.id)}>Dismiss</button>
              </div>
            )}
          </div>
        );
      })}
    </Layout>
  );
}