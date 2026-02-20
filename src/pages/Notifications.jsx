import { useState } from "react";
import { Bell, CalendarDays, AlertTriangle, CheckCircle, Info, X, Clock, RefreshCw, BellOff } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

/* ─── Mock notification data ─── */
const ALL_NOTIFICATIONS = [
  {
    id: 1, type: "postponed", read: false,
    title: "Lesson Rescheduled",
    msg: "Your lesson on Monday 18 Feb with Blessing Chikwanda has been moved to Wednesday 20 Feb at 10:00 AM.",
    time: "2 hours ago", date: "2026-02-19",
    action: "View Schedule",
  },
  {
    id: 2, type: "reminder", read: false,
    title: "Lesson Tomorrow",
    msg: "Reminder: You have a lesson tomorrow (20 Feb) at 10:00 AM with Blessing Chikwanda at Avondale Test Centre.",
    time: "5 hours ago", date: "2026-02-19",
    action: "View Details",
  },
  {
    id: 3, type: "balance", read: false,
    title: "Low Balance Warning",
    msg: "Your lesson balance is running low. You have 8 lessons remaining. Visit the front desk to top up.",
    time: "Yesterday", date: "2026-02-18",
    action: "View Balance",
  },
  {
    id: 4, type: "confirmed", read: true,
    title: "Booking Confirmed",
    msg: "Your lesson on Saturday 22 Feb at 08:30 AM with Grace Mutasa has been confirmed.",
    time: "2 days ago", date: "2026-02-17",
    action: null,
  },
  {
    id: 5, type: "postponed", read: true,
    title: "Lesson Postponed by Instructor",
    msg: "Grace Mutasa has requested to postpone your lesson on 15 Feb to 18 Feb due to a scheduling conflict. Please confirm.",
    time: "4 days ago", date: "2026-02-15",
    action: "Confirm Change",
  },
  {
    id: 6, type: "info", read: true,
    title: "New Instructor Assigned",
    msg: "John Sithole has been assigned as your backup instructor for Class 1 lessons.",
    time: "5 days ago", date: "2026-02-14",
    action: null,
  },
  {
    id: 7, type: "confirmed", read: true,
    title: "Lesson Completed",
    msg: "Your lesson on 12 Feb with Grace Mutasa has been marked as completed. Grade: Pass. Well done!",
    time: "1 week ago", date: "2026-02-12",
    action: null,
  },
  {
    id: 8, type: "reminder", read: true,
    title: "Lesson in 24 Hours",
    msg: "Don't forget — your lesson with Blessing Chikwanda is tomorrow at 08:00 AM. Arrive 10 minutes early.",
    time: "1 week ago", date: "2026-02-11",
    action: null,
  },
];

const TYPE_CONFIG = {
  postponed: { icon: RefreshCw,    color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  label: "Rescheduled" },
  reminder:  { icon: Clock,        color: "#2563eb", bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.2)",   label: "Reminder"    },
  balance:   { icon: AlertTriangle,color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",   label: "Alert"       },
  confirmed: { icon: CheckCircle,  color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",   label: "Confirmed"   },
  info:      { icon: Info,         color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)",  label: "Info"        },
};

const FILTERS = ["All", "Unread", "Rescheduled", "Reminders", "Alerts"];
const FILTER_MAP = { "All": null, "Unread": "unread", "Rescheduled": "postponed", "Reminders": "reminder", "Alerts": "balance" };

export default function Notifications() {
  const { theme } = useAuth();
  const p = theme?.primary || "#2563eb";

  const [notes, setNotes]     = useState(ALL_NOTIFICATIONS);
  const [filter, setFilter]   = useState("All");
  const [expanded, setExpand] = useState(null);

  const unreadCount = notes.filter(n => !n.read).length;

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
        .zd-notif-filter-bar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1.25rem; }
        .zd-filter-pill { padding: 0.38rem 0.9rem; border-radius: 20px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.78rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.13s; }
        .zd-filter-pill.active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }
        .zd-filter-pill:hover:not(.active) { border-color: var(--zd-primary); color: var(--zd-primary); }

        .zd-notif-card {
          border-radius: 12px;
          border: 1px solid;
          margin-bottom: 10px;
          overflow: hidden;
          transition: box-shadow 0.13s, transform 0.13s;
          cursor: pointer;
        }
        .zd-notif-card:last-child { margin-bottom: 0; }
        .zd-notif-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.07); }

        .zd-notif-inner { display: flex; align-items: flex-start; gap: 12px; padding: 1rem; }

        .zd-notif-icon-wrap { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }

        .zd-notif-body { flex: 1; min-width: 0; }
        .zd-notif-title { font-size: 0.875rem; font-weight: 700; color: var(--zd-text); margin-bottom: 2px; display: flex; align-items: center; gap: 8px; }
        .zd-notif-msg { font-size: 0.8rem; color: var(--zd-text-muted); line-height: 1.5; }
        .zd-notif-meta { display: flex; align-items: center; gap: 10px; margin-top: 6px; flex-wrap: wrap; }
        .zd-notif-time { font-size: 0.7rem; color: var(--zd-text-muted); }

        .zd-notif-actions { display: flex; gap: 6px; padding: 0 1rem 0.85rem; }
        .zd-action-link { padding: 0.35rem 0.85rem; border-radius: 7px; border: none; background: var(--zd-gradient); color: #fff; font-size: 0.75rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: filter 0.12s; }
        .zd-action-link:hover { filter: brightness(1.1); }
        .zd-dismiss-btn { padding: 0.35rem 0.75rem; border-radius: 7px; border: 1px solid var(--zd-border); background: transparent; color: var(--zd-text-muted); font-size: 0.75rem; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.12s; }
        .zd-dismiss-btn:hover { background: var(--zd-surface-alt); }

        .zd-unread-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--zd-primary); flex-shrink: 0; margin-top: 3px; }

        .zd-type-badge { font-size: 0.64rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; display: inline-block; }

        .zd-empty-state { text-align: center; padding: 3rem 1rem; color: var(--zd-text-muted); }

        .zd-mark-all-btn { padding: 0.38rem 0.9rem; border-radius: 8px; border: 1px solid var(--zd-border); background: transparent; color: var(--zd-text-muted); font-size: 0.78rem; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.13s; }
        .zd-mark-all-btn:hover { background: var(--zd-surface-alt); }

        .zd-dismiss-all-btn { padding: 0.38rem 0.9rem; border-radius: 8px; border: 1px solid rgba(239,68,68,0.25); background: transparent; color: #ef4444; font-size: 0.78rem; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.13s; }
        .zd-dismiss-all-btn:hover { background: rgba(239,68,68,0.08); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <Bell size={22} color={p} />
            Notifications
            {unreadCount > 0 && (
              <span style={{ background: p, color: "#fff", fontSize: "0.72rem", fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>
                {unreadCount} new
              </span>
            )}
          </h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            Stay updated on lesson changes, reminders and alerts.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {unreadCount > 0 && (
            <button className="zd-mark-all-btn" onClick={markAllRead}>
              <CheckCircle size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="zd-notif-filter-bar">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`zd-filter-pill${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span style={{ marginLeft: 5, background: filter === "Unread" ? "rgba(255,255,255,0.25)" : `${p}20`, color: filter === "Unread" ? "#fff" : p, borderRadius: 20, padding: "0 5px", fontSize: "0.68rem", fontWeight: 800 }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {displayed.length === 0 ? (
        <div className="zd-empty-state" style={{ background: "var(--zd-surface)", border: "1px solid var(--zd-border)", borderRadius: 14 }}>
          <BellOff size={36} color="var(--zd-border)" style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--zd-text)", marginBottom: 4 }}>No notifications</div>
          <div style={{ fontSize: "0.82rem" }}>You're all caught up!</div>
        </div>
      ) : (
        <div>
          {displayed.map(n => {
            const cfg  = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            const Icon = cfg.icon;
            const open = expanded === n.id;

            return (
              <div
                key={n.id}
                className="zd-notif-card"
                style={{ background: n.read ? "var(--zd-surface)" : cfg.bg, borderColor: n.read ? "var(--zd-border)" : cfg.border }}
                onClick={() => { setExpand(open ? null : n.id); if (!n.read) markRead(n.id); }}
              >
                <div className="zd-notif-inner">
                  {/* Icon */}
                  <div className="zd-notif-icon-wrap" style={{ background: `${cfg.color}18` }}>
                    <Icon size={17} color={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="zd-notif-body">
                    <div className="zd-notif-title">
                      {n.title}
                      <span className="zd-type-badge" style={{ background: `${cfg.color}18`, color: cfg.color }}>{cfg.label}</span>
                    </div>
                    <div className="zd-notif-msg" style={{
                      maxHeight: open ? 200 : 40,
                      overflow: "hidden",
                      transition: "max-height 0.25s ease",
                    }}>
                      {n.msg}
                    </div>
                    <div className="zd-notif-meta">
                      <span className="zd-notif-time">{n.time}</span>
                      {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: p, display: "inline-block" }} />}
                    </div>
                  </div>

                  {/* Close / dismiss */}
                  <button
                    onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--zd-text-muted)", padding: "2px", flexShrink: 0, borderRadius: 6, display: "flex", alignItems: "center" }}
                    title="Dismiss"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Expanded actions */}
                {open && n.action && (
                  <div className="zd-notif-actions" onClick={e => e.stopPropagation()}>
                    <button className="zd-action-link">{n.action}</button>
                    <button className="zd-dismiss-btn" onClick={() => dismiss(n.id)}>Dismiss</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}