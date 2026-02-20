import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Car, User, CalendarDays, BookOpen } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

/* ─── Mock data ─── */
const INSTRUCTORS = [
  { id: 1, name: "Blessing Chikwanda", classes: ["Class 1", "Class 2"], rating: 4.9, lessons: 312, avatar: "BC" },
  { id: 2, name: "Grace Mutasa",       classes: ["Class 1"],            rating: 4.7, lessons: 198, avatar: "GM" },
  { id: 3, name: "John Sithole",       classes: ["Class 1", "Class 2"], rating: 4.8, lessons: 245, avatar: "JS" },
];

const LESSON_HISTORY = [
  { date: "15 Feb 2026", instructor: "Blessing Chikwanda", cls: "Class 1", duration: "1hr",  status: "completed", grade: "Pass" },
  { date: "12 Feb 2026", instructor: "Grace Mutasa",       cls: "Class 1", duration: "1hr",  status: "completed", grade: "Pass" },
  { date: "08 Feb 2026", instructor: "Blessing Chikwanda", cls: "Class 1", duration: "1hr",  status: "completed", grade: "Needs Work" },
  { date: "05 Feb 2026", instructor: "John Sithole",       cls: "Class 1", duration: "1hr",  status: "completed", grade: "Pass" },
  { date: "01 Feb 2026", instructor: "Grace Mutasa",       cls: "Class 1", duration: "1hr",  status: "completed", grade: "Pass" },
  { date: "28 Jan 2026", instructor: "Blessing Chikwanda", cls: "Class 1", duration: "2hr",  status: "completed", grade: "Excellent" },
];

const TIME_SLOTS = ["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"];

/* booked slots — key: "YYYY-MM-DD-HH:MM" */
const BOOKED_SLOTS = new Set([
  "2026-02-23-10:00","2026-02-23-14:00","2026-02-25-08:00","2026-02-26-09:00",
  "2026-02-27-13:00","2026-03-02-10:00","2026-03-03-11:00",
]);

const DAYS_OF_WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const GRADE_STYLES = {
  "Excellent":  { bg: "rgba(34,197,94,0.15)",  color: "#22c55e" },
  "Pass":       { bg: "rgba(37,99,235,0.12)",   color: "#2563eb" },
  "Needs Work": { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
};

function MiniCalendar({ year, month, selected, onSelect, booked }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSel = (d) => d && selected?.day === d && selected?.month === month && selected?.year === year;
  const isPast = (d) => d && new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const hasBooked = (d) => {
    if (!d) return false;
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return [...booked].some(b => b.startsWith(key));
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.65rem", fontWeight: 700, color: "var(--zd-text-muted)", padding: "4px 0", textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {cells.map((d, i) => {
          const past = isPast(d);
          const sel  = isSel(d);
          const dot  = hasBooked(d);
          return (
            <div
              key={i}
              onClick={() => d && !past && onSelect({ day: d, month, year })}
              style={{
                aspectRatio: "1",
                borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column",
                fontSize: "0.78rem", fontWeight: sel ? 700 : 400,
                cursor: d && !past ? "pointer" : "default",
                background: sel ? "var(--zd-primary)" : "transparent",
                color: sel ? "#fff" : past ? "var(--zd-border)" : d ? "var(--zd-text)" : "transparent",
                border: `1px solid ${sel ? "var(--zd-primary)" : "transparent"}`,
                transition: "all 0.12s ease",
                position: "relative",
              }}
              onMouseEnter={e => { if (d && !past && !sel) e.currentTarget.style.background = "var(--zd-surface-alt)"; }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}
            >
              {d}
              {dot && !sel && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--zd-primary)", position: "absolute", bottom: 3 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BookLesson() {
  const { theme } = useAuth();
  const p = theme?.primary || "#2563eb";
  const today = new Date();

  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const [selSlot,  setSelSlot]  = useState(null);
  const [selInstr, setSelInstr] = useState(null);
  const [selClass, setSelClass] = useState("Class 1");
  const [confirmed, setConfirmed] = useState(false);
  const [tab, setTab] = useState("book"); // "book" | "history"

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); } else setCalMonth(m => m-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0); } else setCalMonth(m => m+1); };

  const selectedDateStr = selected
    ? `${selected.year}-${String(selected.month+1).padStart(2,"0")}-${String(selected.day).padStart(2,"0")}`
    : null;

  const slotBooked = (slot) => selectedDateStr && BOOKED_SLOTS.has(`${selectedDateStr}-${slot}`);

  const canConfirm = selected && selSlot && selInstr && !confirmed;

  const handleConfirm = () => { if (canConfirm) setConfirmed(true); };

  return (
    <Layout>
      <style>{`
        .zd-book-tabs { display: flex; gap: 4px; margin-bottom: 1.5rem; background: var(--zd-surface-alt); padding: 4px; border-radius: 10px; width: fit-content; border: 1px solid var(--zd-border); }
        .zd-book-tab  { padding: 0.45rem 1.1rem; border-radius: 7px; border: none; font-family: inherit; font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: all 0.15s; background: transparent; color: var(--zd-text-muted); }
        .zd-book-tab.active { background: var(--zd-surface); color: var(--zd-primary); box-shadow: 0 1px 4px rgba(0,0,0,0.08); border: 1px solid var(--zd-border); }

        .zd-book-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 1000px) { .zd-book-grid { grid-template-columns: 1fr 320px; } }

        .zd-card { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 14px; padding: 1.25rem; }
        .zd-card-title { font-size: 0.88rem; font-weight: 700; color: var(--zd-text); margin-bottom: 1rem; display: flex; align-items: center; gap: 7px; }

        .zd-slot-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
        @media (max-width: 500px) { .zd-slot-grid { grid-template-columns: repeat(3, 1fr); } }

        .zd-slot-btn { padding: 0.45rem 0; border-radius: 7px; border: 1px solid var(--zd-border); background: var(--zd-surface-alt); color: var(--zd-text); font-size: 0.78rem; font-weight: 500; font-family: inherit; cursor: pointer; text-align: center; transition: all 0.13s; }
        .zd-slot-btn:hover:not(:disabled) { border-color: var(--zd-primary); color: var(--zd-primary); }
        .zd-slot-btn.sel { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); font-weight: 700; }
        .zd-slot-btn:disabled { opacity: 0.35; cursor: not-allowed; text-decoration: line-through; }

        .zd-instr-card { display: flex; align-items: center; gap: 10px; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--zd-border); background: var(--zd-surface-alt); cursor: pointer; margin-bottom: 6px; transition: all 0.13s; }
        .zd-instr-card:last-child { margin-bottom: 0; }
        .zd-instr-card:hover { border-color: var(--zd-primary); }
        .zd-instr-card.sel { border-color: var(--zd-primary); background: var(--zd-surface); }

        .zd-instr-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; color: #fff; flex-shrink: 0; }

        .zd-class-toggle { display: flex; gap: 6px; }
        .zd-class-btn { padding: 0.4rem 0.9rem; border-radius: 7px; border: 1px solid var(--zd-border); background: var(--zd-surface-alt); color: var(--zd-text-muted); font-size: 0.8rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.13s; }
        .zd-class-btn.sel { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }

        .zd-confirm-btn { width: 100%; padding: 0.75rem; border-radius: 10px; border: none; background: var(--zd-gradient); color: #fff; font-size: 0.9rem; font-weight: 700; font-family: inherit; cursor: pointer; transition: filter 0.13s; margin-top: 0.75rem; }
        .zd-confirm-btn:hover:not(:disabled) { filter: brightness(1.08); }
        .zd-confirm-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .zd-hist-row { display: flex; align-items: center; gap: 12px; padding: 0.8rem 1rem; border-radius: 10px; background: var(--zd-surface-alt); border: 1px solid var(--zd-border); margin-bottom: 8px; }
        .zd-hist-row:last-child { margin-bottom: 0; }

        .zd-badge { display: inline-block; font-size: 0.68rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }

        .zd-success-box { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 1.25rem; text-align: center; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4 }}>
          Book a Lesson
        </h4>
        <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
          Schedule a new lesson or view your past sessions.
        </p>
      </div>

      {/* Tabs */}
      <div className="zd-book-tabs">
        {[{ key: "book", label: "📅 Book New Lesson" }, { key: "history", label: "🕐 Lesson History" }].map(t => (
          <button key={t.key} className={`zd-book-tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── BOOK TAB ── */}
      {tab === "book" && (
        <div className="zd-book-grid">
          {/* Left: calendar + slots */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Calendar */}
            <div className="zd-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div className="zd-card-title" style={{ marginBottom: 0 }}>
                  <CalendarDays size={15} color={p} />
                  {MONTHS[calMonth]} {calYear}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[{ icon: ChevronLeft, action: prevMonth }, { icon: ChevronRight, action: nextMonth }].map(({ icon: Icon, action }, i) => (
                    <button key={i} onClick={action} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--zd-border)", background: "var(--zd-surface-alt)", color: "var(--zd-text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </div>
              <MiniCalendar year={calYear} month={calMonth} selected={selected} onSelect={sel => { setSelected(sel); setSelSlot(null); }} booked={BOOKED_SLOTS} />
              {selected && (
                <div style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: 8, background: `${p}12`, border: `1px solid ${p}25`, fontSize: "0.8rem", color: "var(--zd-primary)", fontWeight: 600 }}>
                  Selected: {DAYS_OF_WEEK[new Date(selected.year, selected.month, selected.day).getDay()]}, {selected.day} {MONTHS[selected.month]} {selected.year}
                </div>
              )}
            </div>

            {/* Time slots */}
            {selected && (
              <div className="zd-card">
                <div className="zd-card-title"><Clock size={15} color={p} />Available Time Slots</div>
                <div className="zd-slot-grid">
                  {TIME_SLOTS.map(slot => {
                    const booked = slotBooked(slot);
                    const isSel  = selSlot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        className={`zd-slot-btn${isSel ? " sel" : ""}`}
                        onClick={() => setSelSlot(slot)}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--zd-text-muted)", marginTop: "0.75rem" }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--zd-border)", marginRight: 4 }} />
                  Strikethrough = already booked
                </div>
              </div>
            )}
          </div>

          {/* Right: instructor + summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* License class */}
            <div className="zd-card">
              <div className="zd-card-title"><Car size={15} color={p} />License Class</div>
              <div className="zd-class-toggle">
                {["Class 1", "Class 2"].map(c => (
                  <button key={c} className={`zd-class-btn${selClass === c ? " sel" : ""}`} onClick={() => setSelClass(c)}>{c}</button>
                ))}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--zd-text-muted)", margin: "0.6rem 0 0" }}>
                {selClass === "Class 1" ? "Light vehicles — cars & sedans" : "Heavy vehicles — 2-tonne trucks"}
              </p>
            </div>

            {/* Instructor */}
            <div className="zd-card">
              <div className="zd-card-title"><User size={15} color={p} />Choose Instructor</div>
              {INSTRUCTORS.filter(i => i.classes.includes(selClass)).map(instr => (
                <div
                  key={instr.id}
                  className={`zd-instr-card${selInstr?.id === instr.id ? " sel" : ""}`}
                  onClick={() => setSelInstr(instr)}
                >
                  <div className="zd-instr-avatar" style={{ background: "var(--zd-gradient)" }}>{instr.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--zd-text)" }}>{instr.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--zd-text-muted)" }}>⭐ {instr.rating} · {instr.lessons} lessons</div>
                  </div>
                  {selInstr?.id === instr.id && <CheckCircle size={16} color={p} style={{ flexShrink: 0 }} />}
                </div>
              ))}
            </div>

            {/* Summary + Confirm */}
            <div className="zd-card">
              <div className="zd-card-title"><BookOpen size={15} color={p} />Booking Summary</div>
              {confirmed ? (
                <div className="zd-success-box">
                  <CheckCircle size={28} color="#22c55e" style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, color: "#22c55e", fontSize: "0.95rem" }}>Lesson Booked!</div>
                  <div style={{ color: "var(--zd-text-muted)", fontSize: "0.8rem", marginTop: 4 }}>
                    {selected?.day} {MONTHS[selected?.month]} · {selSlot} · {selInstr?.name}
                  </div>
                  <button onClick={() => { setConfirmed(false); setSelected(null); setSelSlot(null); setSelInstr(null); }}
                    style={{ marginTop: "0.75rem", padding: "0.4rem 1rem", borderRadius: 7, border: "1px solid var(--zd-border)", background: "transparent", color: "var(--zd-text-muted)", fontSize: "0.78rem", fontFamily: "inherit", cursor: "pointer" }}>
                    Book Another
                  </button>
                </div>
              ) : (
                <div>
                  {[
                    { label: "Date",       value: selected ? `${selected.day} ${MONTHS[selected.month]} ${selected.year}` : "—" },
                    { label: "Time",       value: selSlot  || "—" },
                    { label: "Instructor", value: selInstr?.name || "—" },
                    { label: "Class",      value: selClass },
                    { label: "Duration",   value: "1 hour" },
                    { label: "Cost",       value: "1 lesson credit" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0", borderBottom: "1px solid var(--zd-border)" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--zd-text-muted)" }}>{label}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--zd-text)" }}>{value}</span>
                    </div>
                  ))}
                  <button className="zd-confirm-btn" disabled={!canConfirm} onClick={handleConfirm}>
                    Confirm Booking
                  </button>
                  {!canConfirm && (
                    <p style={{ fontSize: "0.72rem", color: "var(--zd-text-muted)", textAlign: "center", marginTop: 6, marginBottom: 0 }}>
                      Select a date, time and instructor to continue
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div className="zd-card">
          <div className="zd-card-title"><Clock size={15} color={p} />Lesson History ({LESSON_HISTORY.length} sessions)</div>
          {LESSON_HISTORY.map((h, i) => {
            const g = GRADE_STYLES[h.grade] || GRADE_STYLES["Pass"];
            return (
              <div key={i} className="zd-hist-row">
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${p}18`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--zd-primary)" }}>{h.date.split(" ")[1]}</span>
                  <span style={{ fontSize: "0.6rem", color: "var(--zd-text-muted)" }}>{h.date.split(" ")[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.855rem", fontWeight: 600, color: "var(--zd-text)" }}>{h.instructor}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--zd-text-muted)", marginTop: 1 }}>{h.cls} · {h.duration} · {h.date.split(" ").slice(1).join(" ")}</div>
                </div>
                <span className="zd-badge" style={{ background: g.bg, color: g.color }}>{h.grade}</span>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}