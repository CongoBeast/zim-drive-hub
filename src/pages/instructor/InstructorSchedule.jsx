import { useState } from "react";
import { CalendarDays, Clock, User, MapPin, RefreshCw, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

/* ─── Mock schedule data ─── */
const TODAY = new Date(2026, 1, 20); // Feb 20 2026

function daysFromToday(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d;
}

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS    = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ALL_LESSONS = [
  /* TODAY */
  { id: 1,  date: daysFromToday(0),  time: "08:00", student: "Farai Zimba",     cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "completed",   phone: "+263 77 123 4567" },
  { id: 2,  date: daysFromToday(0),  time: "10:00", student: "Rudo Kambarami",  cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "in-progress", phone: "+263 71 234 5678" },
  { id: 3,  date: daysFromToday(0),  time: "13:00", student: "Nyasha Dube",     cls: "Class 2", duration: "2hr", location: "Belvedere Grounds", status: "upcoming",    phone: "+263 73 345 6789" },
  { id: 4,  date: daysFromToday(0),  time: "16:00", student: "Tendai Makoni",   cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 77 456 7890" },
  /* +1 */
  { id: 5,  date: daysFromToday(1),  time: "09:00", student: "Chiedza Moyo",    cls: "Class 1", duration: "1hr", location: "Borrowdale Track",  status: "upcoming",    phone: "+263 71 567 8901" },
  { id: 6,  date: daysFromToday(1),  time: "11:00", student: "Simba Ndlovu",    cls: "Class 2", duration: "2hr", location: "Belvedere Grounds", status: "upcoming",    phone: "+263 73 678 9012" },
  { id: 7,  date: daysFromToday(1),  time: "14:00", student: "Tatenda Rusere",  cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 77 789 0123" },
  /* +2 */
  { id: 8,  date: daysFromToday(2),  time: "08:00", student: "Farai Zimba",     cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 77 123 4567" },
  { id: 9,  date: daysFromToday(2),  time: "10:30", student: "Rudo Kambarami",  cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 71 234 5678" },
  /* +3 */
  { id: 10, date: daysFromToday(3),  time: "09:00", student: "Nyasha Dube",     cls: "Class 2", duration: "2hr", location: "Belvedere Grounds", status: "upcoming",    phone: "+263 73 345 6789" },
  { id: 11, date: daysFromToday(3),  time: "13:00", student: "Tendai Makoni",   cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 77 456 7890" },
  { id: 12, date: daysFromToday(3),  time: "15:00", student: "Chiedza Moyo",    cls: "Class 1", duration: "1hr", location: "Borrowdale Track",  status: "upcoming",    phone: "+263 71 567 8901" },
  /* +4 */
  { id: 13, date: daysFromToday(4),  time: "08:00", student: "Simba Ndlovu",    cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 73 678 9012" },
  { id: 14, date: daysFromToday(4),  time: "11:00", student: "Tatenda Rusere",  cls: "Class 1", duration: "1hr", location: "Borrowdale Track",  status: "upcoming",    phone: "+263 77 789 0123" },
  /* +5 */
  { id: 15, date: daysFromToday(5),  time: "09:00", student: "Farai Zimba",     cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 77 123 4567" },
  /* +6 */
  { id: 16, date: daysFromToday(6),  time: "10:00", student: "Rudo Kambarami",  cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 71 234 5678" },
  { id: 17, date: daysFromToday(6),  time: "14:00", student: "Nyasha Dube",     cls: "Class 2", duration: "2hr", location: "Belvedere Grounds", status: "upcoming",    phone: "+263 73 345 6789" },
  /* +7 */
  { id: 18, date: daysFromToday(7),  time: "09:00", student: "Tendai Makoni",   cls: "Class 1", duration: "1hr", location: "Avondale Centre",   status: "upcoming",    phone: "+263 77 456 7890" },
  { id: 19, date: daysFromToday(7),  time: "11:00", student: "Chiedza Moyo",    cls: "Class 1", duration: "1hr", location: "Borrowdale Track",  status: "upcoming",    phone: "+263 71 567 8901" },
];

const STATUS_CFG = {
  "completed":   { label: "Completed",   color: "#64748b", bg: "rgba(100,116,139,0.12)" },
  "in-progress": { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  "upcoming":    { label: "Upcoming",    color: "#059669", bg: "rgba(5,150,105,0.12)"   },
};

function fmtDate(d) {
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
function isToday(d) {
  return d.getDate() === TODAY.getDate() && d.getMonth() === TODAY.getMonth();
}
function isSameDay(a, b) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export default function InstructorSchedule() {
  const { theme, user } = useAuth();
  const p = theme?.primary || "#059669";

  const [selectedDay, setSelectedDay]       = useState(0); // offset from today
  const [weekOffset,  setWeekOffset]        = useState(0); // 0 = this week, 1 = next
  const [requestLesson, setRequestLesson]   = useState(null);
  const [requestSent, setRequestSent]       = useState(new Set());

  /* Build the 8-day strip (today + 7 days) */
  const stripDays = Array.from({ length: 8 }, (_, i) => daysFromToday(i + weekOffset * 8));

  const focusDate   = daysFromToday(selectedDay + weekOffset * 8);
  const dayLessons  = ALL_LESSONS.filter(l => isSameDay(l.date, focusDate));
  const totalToday  = ALL_LESSONS.filter(l => isToday(l.date)).length;

  const handleRequestChange = (lesson) => {
    setRequestLesson(lesson);
  };

  const handleSendRequest = () => {
    if (!requestLesson) return;
    setRequestSent(prev => new Set([...prev, requestLesson.id]));
    setRequestLesson(null);
  };

  return (
    <Layout>
      <style>{`
        .zd-sched-strip {
          display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;
          margin-bottom: 1.25rem; scrollbar-width: none;
        }
        .zd-sched-strip::-webkit-scrollbar { display: none; }

        .zd-day-chip {
          flex-shrink: 0; min-width: 64px;
          text-align: center; padding: 0.65rem 0.5rem;
          border-radius: 12px; border: 1px solid var(--zd-border);
          background: var(--zd-surface); cursor: pointer;
          transition: all 0.14s ease;
        }
        .zd-day-chip:hover { border-color: var(--zd-primary); }
        .zd-day-chip.active { background: var(--zd-primary); border-color: var(--zd-primary); }
        .zd-day-chip.today-chip { border-color: var(--zd-primary); }

        .zd-sched-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 1050px) { .zd-sched-grid { grid-template-columns: 1fr 300px; } }

        .zd-lesson-row {
          display: flex; align-items: stretch; gap: 0;
          border-radius: 12px; border: 1px solid var(--zd-border);
          background: var(--zd-surface); overflow: hidden;
          margin-bottom: 10px; transition: box-shadow 0.14s, transform 0.14s;
        }
        .zd-lesson-row:last-child { margin-bottom: 0; }
        .zd-lesson-row:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.07); }

        .zd-lesson-accent { width: 4px; flex-shrink: 0; }
        .zd-lesson-body { display: flex; align-items: flex-start; gap: 12px; padding: 0.9rem 1rem; flex: 1; flex-wrap: wrap; }
        .zd-lesson-time-block { min-width: 52px; flex-shrink: 0; }
        .zd-lesson-info { flex: 1; min-width: 140px; }
        .zd-lesson-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; margin-left: auto; }

        .zd-badge { display: inline-block; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }

        .zd-req-btn {
          padding: 0.35rem 0.75rem; border-radius: 7px; border: 1px solid var(--zd-border);
          background: var(--zd-surface-alt); color: var(--zd-text-muted);
          font-size: 0.74rem; font-weight: 600; font-family: inherit;
          cursor: pointer; display: flex; align-items: center; gap: 5px;
          transition: all 0.13s; white-space: nowrap;
        }
        .zd-req-btn:hover { border-color: var(--zd-primary); color: var(--zd-primary); }
        .zd-req-btn.sent { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.08); cursor: default; }

        .zd-week-side-card {
          background: var(--zd-surface); border: 1px solid var(--zd-border);
          border-radius: 14px; padding: 1.1rem;
          position: sticky; top: 1.5rem;
        }

        .zd-week-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.55rem 0.65rem; border-radius: 8px; margin-bottom: 4px;
          cursor: pointer; transition: background 0.12s;
          border: 1px solid transparent;
        }
        .zd-week-row:hover { background: var(--zd-surface-alt); }
        .zd-week-row.active { background: var(--zd-surface-alt); border-color: var(--zd-primary); }
        .zd-week-row:last-child { margin-bottom: 0; }

        .zd-empty { text-align: center; padding: 2.5rem 1rem; color: var(--zd-text-muted); }

        /* Modal overlay */
        .zd-modal-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .zd-modal {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 20px;
          padding: 1.75rem;
          width: 100%; max-width: 440px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.35);
          position: relative;
        }
        [data-theme="instructor"] .zd-modal,
        [data-theme="student"] .zd-modal {
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.6);
        }
        .zd-modal-title { font-size: 1.1rem; font-weight: 800; color: var(--zd-text); margin-bottom: 0.25rem; }
        .zd-modal-sub   { font-size: 0.8rem; color: var(--zd-text-muted); margin-bottom: 1.25rem; }
        .zd-modal-field { margin-bottom: 0.85rem; }
        .zd-modal-label { font-size: 0.75rem; font-weight: 600; color: var(--zd-text-muted); margin-bottom: 0.35rem; display: block; }
        .zd-modal-input {
          width: 100%; padding: 0.55rem 0.75rem;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
          border-radius: 8px; color: var(--zd-text); font-size: 0.84rem;
          font-family: inherit; outline: none; transition: border-color 0.13s;
          box-shadow: none;
        }
        .zd-modal-input:focus { border-color: var(--zd-primary); }
        [data-theme="instructor"] .zd-modal-input,
        [data-theme="student"] .zd-modal-input {
          background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.15);
        }
        .zd-modal-submit {
          width: 100%; padding: 0.7rem; border-radius: 10px; border: none;
          background: var(--zd-gradient); color: #fff; font-size: 0.9rem;
          font-weight: 700; font-family: inherit; cursor: pointer;
          transition: filter 0.13s; margin-top: 0.5rem;
        }
        .zd-modal-submit:hover { filter: brightness(1.08); }
        .zd-modal-cancel {
          width: 100%; padding: 0.55rem; border-radius: 10px;
          border: 1px solid var(--zd-border); background: transparent;
          color: var(--zd-text-muted); font-size: 0.84rem;
          font-family: inherit; cursor: pointer; margin-top: 6px;
          transition: background 0.12s;
        }
        .zd-modal-cancel:hover { background: var(--zd-surface-alt); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4 }}>
            My Schedule
          </h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            {DAY_NAMES[TODAY.getDay()]}, {TODAY.getDate()} {MONTHS[TODAY.getMonth()]} {TODAY.getFullYear()} &mdash; {totalToday} lessons today
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setWeekOffset(0); setSelectedDay(0); }}
            style={{ padding: "0.4rem 0.9rem", borderRadius: 8, border: `1px solid ${weekOffset===0 ? "var(--zd-primary)" : "var(--zd-border)"}`, background: weekOffset===0 ? `${p}15` : "var(--zd-surface)", color: weekOffset===0 ? "var(--zd-primary)" : "var(--zd-text-muted)", fontSize: "0.78rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
            This Week
          </button>
          <button onClick={() => { setWeekOffset(1); setSelectedDay(0); }}
            style={{ padding: "0.4rem 0.9rem", borderRadius: 8, border: `1px solid ${weekOffset===1 ? "var(--zd-primary)" : "var(--zd-border)"}`, background: weekOffset===1 ? `${p}15` : "var(--zd-surface)", color: weekOffset===1 ? "var(--zd-primary)" : "var(--zd-text-muted)", fontSize: "0.78rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
            Next Week
          </button>
        </div>
      </div>

      {/* Day strip */}
      <div className="zd-sched-strip">
        {stripDays.map((d, i) => {
          const cnt    = ALL_LESSONS.filter(l => isSameDay(l.date, d)).length;
          const active = selectedDay === i;
          const today  = isToday(d);
          return (
            <div key={i} className={`zd-day-chip${active ? " active" : ""}${today && !active ? " today-chip" : ""}`}
              onClick={() => setSelectedDay(i)}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: active ? "rgba(255,255,255,0.75)" : "var(--zd-text-muted)", marginBottom: 3 }}>
                {today && !active ? "Today" : DAY_SHORT[d.getDay()]}
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, color: active ? "#fff" : "var(--zd-text)", lineHeight: 1 }}>
                {d.getDate()}
              </div>
              <div style={{ fontSize: "0.6rem", color: active ? "rgba(255,255,255,0.7)" : "var(--zd-text-muted)", marginTop: 2 }}>
                {MONTHS[d.getMonth()]}
              </div>
              {cnt > 0 && (
                <div style={{ marginTop: 5 }}>
                  <span style={{ background: active ? "rgba(255,255,255,0.25)" : `${p}20`, color: active ? "#fff" : p, fontSize: "0.6rem", fontWeight: 800, padding: "1px 7px", borderRadius: 20 }}>
                    {cnt}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="zd-sched-grid">
        {/* Lesson list */}
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--zd-text-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isToday(focusDate) ? "Today" : DAY_NAMES[focusDate.getDay()]} — {focusDate.getDate()} {MONTHS[focusDate.getMonth()]} · {dayLessons.length} lesson{dayLessons.length !== 1 ? "s" : ""}
          </div>

          {dayLessons.length === 0 ? (
            <div className="zd-empty" style={{ background: "var(--zd-surface)", border: "1px solid var(--zd-border)", borderRadius: 14 }}>
              <CalendarDays size={36} color="var(--zd-border)" style={{ marginBottom: 10 }} />
              <div style={{ fontWeight: 600, color: "var(--zd-text)" }}>No lessons scheduled</div>
              <div style={{ fontSize: "0.8rem", marginTop: 4 }}>Enjoy your day off!</div>
            </div>
          ) : dayLessons.map(lesson => {
            const s    = STATUS_CFG[lesson.status];
            const sent = requestSent.has(lesson.id);
            return (
              <div key={lesson.id} className="zd-lesson-row">
                <div className="zd-lesson-accent" style={{ background: s.color }} />
                <div className="zd-lesson-body">
                  {/* Time */}
                  <div className="zd-lesson-time-block">
                    <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--zd-text)", lineHeight: 1 }}>{lesson.time}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--zd-text-muted)", marginTop: 2 }}>{lesson.duration}</div>
                  </div>
                  {/* Info */}
                  <div className="zd-lesson-info">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--zd-text)" }}>{lesson.student}</span>
                      <span className="zd-badge" style={{ background: `${p}18`, color: p }}>{lesson.cls}</span>
                      <span className="zd-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.76rem", color: "var(--zd-text-muted)" }}>
                        <MapPin size={12} />{lesson.location}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.76rem", color: "var(--zd-text-muted)" }}>
                        <User size={12} />{lesson.phone}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="zd-lesson-actions">
                    {lesson.status === "upcoming" && (
                      <button
                        className={`zd-req-btn${sent ? " sent" : ""}`}
                        onClick={() => !sent && handleRequestChange(lesson)}
                        disabled={sent}
                      >
                        <RefreshCw size={12} />
                        {sent ? "Requested" : "Request Change"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Week overview sidebar */}
        <div>
          <div className="zd-week-side-card">
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--zd-text)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: 7 }}>
              <CalendarDays size={14} color={p} />
              Week Overview
            </div>
            {stripDays.map((d, i) => {
              const cnt  = ALL_LESSONS.filter(l => isSameDay(l.date, d)).length;
              const done = ALL_LESSONS.filter(l => isSameDay(l.date, d) && l.status === "completed").length;
              return (
                <div key={i} className={`zd-week-row${selectedDay === i ? " active" : ""}`} onClick={() => setSelectedDay(i)}>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--zd-text)" }}>
                      {isToday(d) ? "Today" : DAY_NAMES[d.getDay()]}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--zd-text-muted)" }}>{d.getDate()} {MONTHS[d.getMonth()]}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: cnt > 0 ? p : "var(--zd-text-muted)" }}>{cnt} lesson{cnt !== 1 ? "s" : ""}</div>
                    {done > 0 && <div style={{ fontSize: "0.68rem", color: "#64748b" }}>{done} done</div>}
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--zd-border)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.76rem", color: "var(--zd-text-muted)" }}>Week total</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--zd-text)" }}>
                {stripDays.reduce((s, d) => s + ALL_LESSONS.filter(l => isSameDay(l.date, d)).length, 0)} lessons
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Request Change Modal */}
      {requestLesson && (
        <div className="zd-modal-overlay" onClick={() => setRequestLesson(null)}>
          <div className="zd-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <div>
                <div className="zd-modal-title">Request Schedule Change</div>
                <div className="zd-modal-sub">{requestLesson.student} · {fmtDate(requestLesson.date)} at {requestLesson.time}</div>
              </div>
              <button onClick={() => setRequestLesson(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--zd-text-muted)", fontSize: "1.2rem", lineHeight: 1, padding: 0 }}>×</button>
            </div>

            <div className="zd-modal-field">
              <label className="zd-modal-label">Reason for change</label>
              <select className="zd-modal-input">
                <option>Scheduling conflict</option>
                <option>Personal emergency</option>
                <option>Vehicle unavailable</option>
                <option>Student request</option>
                <option>Other</option>
              </select>
            </div>
            <div className="zd-modal-field">
              <label className="zd-modal-label">Preferred new date</label>
              <input type="date" className="zd-modal-input" />
            </div>
            <div className="zd-modal-field">
              <label className="zd-modal-label">Preferred new time</label>
              <input type="time" className="zd-modal-input" />
            </div>
            <div className="zd-modal-field">
              <label className="zd-modal-label">Additional notes</label>
              <textarea className="zd-modal-input" rows={3} placeholder="Any extra details for admin…" style={{ resize: "vertical" }} />
            </div>
            <button className="zd-modal-submit" onClick={handleSendRequest}>Submit Request</button>
            <button className="zd-modal-cancel" onClick={() => setRequestLesson(null)}>Cancel</button>
          </div>
        </div>
      )}
    </Layout>
  );
}