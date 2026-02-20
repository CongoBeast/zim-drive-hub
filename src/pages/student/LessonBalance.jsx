import { useState } from "react";
import { ChevronLeft, ChevronRight, CreditCard, TrendingDown, DollarSign, CalendarDays, AlertCircle } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

/* ─── Mock data ─── */
const LESSON_CHARGES = [
  { date: "2026-02-15", label: "Lesson — Class 1 (1hr)",   amount: 15, type: "debit",  instructor: "Blessing Chikwanda", balance_after: 8 },
  { date: "2026-02-12", label: "Lesson — Class 1 (1hr)",   amount: 15, type: "debit",  instructor: "Grace Mutasa",       balance_after: 9 },
  { date: "2026-02-10", label: "Top-up Payment",            amount: 60, type: "credit", instructor: "—",                  balance_after: 10 },
  { date: "2026-02-08", label: "Lesson — Class 1 (1hr)",   amount: 15, type: "debit",  instructor: "Blessing Chikwanda", balance_after: 6 },
  { date: "2026-02-05", label: "Lesson — Class 1 (1hr)",   amount: 15, type: "debit",  instructor: "John Sithole",       balance_after: 7 },
  { date: "2026-02-01", label: "Lesson — Class 1 (1hr)",   amount: 15, type: "debit",  instructor: "Grace Mutasa",       balance_after: 8 },
  { date: "2026-01-28", label: "Lesson — Class 1 (2hr)",   amount: 30, type: "debit",  instructor: "Blessing Chikwanda", balance_after: 9 },
  { date: "2026-01-20", label: "Initial Payment",           amount: 180, type: "credit",instructor: "—",                  balance_after: 12 },
];

/* Which days had lesson expenses — for calendar dot markers */
const EXPENSE_DATES = new Set(LESSON_CHARGES.filter(c => c.type === "debit").map(c => c.date));

const DAYS_OF_WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const TOTAL_PAID    = LESSON_CHARGES.filter(c => c.type === "credit").reduce((s, c) => s + c.amount, 0);
const TOTAL_SPENT   = LESSON_CHARGES.filter(c => c.type === "debit").reduce((s, c) => s + c.amount, 0);
const LESSONS_TAKEN = LESSON_CHARGES.filter(c => c.type === "debit").length;
const LESSONS_LEFT  = 8;
const TOTAL_LESSONS = 12;

function ExpenseCalendar({ year, month, onNav, expDates, selected, onSelect }) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateKey = (d) => `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const hasExp  = (d) => d && expDates.has(dateKey(d));
  const isSel   = (d) => d && selected === dateKey(d);

  return (
    <div>
      {/* Nav header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--zd-text)" }}>
          {MONTHS[month]} {year}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ icon: ChevronLeft, fn: () => onNav(-1) }, { icon: ChevronRight, fn: () => onNav(1) }].map(({ icon: Icon, fn }, i) => (
            <button key={i} onClick={fn} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--zd-border)", background: "var(--zd-surface-alt)", color: "var(--zd-text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.62rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          const exp = hasExp(d);
          const sel = isSel(d);
          return (
            <div
              key={i}
              onClick={() => d && exp && onSelect(sel ? null : dateKey(d))}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                fontSize: "0.78rem",
                fontWeight: sel ? 700 : exp ? 600 : 400,
                cursor: d && exp ? "pointer" : "default",
                background: sel ? "var(--zd-primary)" : exp ? `var(--zd-surface-alt)` : "transparent",
                color: sel ? "#fff" : exp ? "var(--zd-primary)" : d ? "var(--zd-text)" : "transparent",
                border: `1px solid ${sel ? "var(--zd-primary)" : exp ? "var(--zd-border)" : "transparent"}`,
                transition: "all 0.12s",
                position: "relative",
              }}
            >
              {d}
              {exp && !sel && (
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--zd-primary)", position: "absolute", bottom: 3 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: "0.75rem", fontSize: "0.7rem", color: "var(--zd-text-muted)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--zd-primary)", display: "inline-block" }} />
          Lesson day (click to filter)
        </span>
      </div>
    </div>
  );
}

export default function LessonBalance() {
  const { theme, user } = useAuth();
  const p = theme?.primary || "#2563eb";

  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [filterDate, setFilterDate] = useState(null);

  const handleCalNav = (dir) => {
    if (dir === -1) {
      if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
      else setCalMonth(m => m - 1);
    } else {
      if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
      else setCalMonth(m => m + 1);
    }
    setFilterDate(null);
  };

  const displayedCharges = filterDate
    ? LESSON_CHARGES.filter(c => c.date === filterDate)
    : LESSON_CHARGES;

  const progressPct = Math.round((LESSONS_LEFT / TOTAL_LESSONS) * 100);

  return (
    <Layout>
      <style>{`
        .zd-bal-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 1000px) { .zd-bal-grid { grid-template-columns: 1fr 340px; } }

        .zd-stat-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
        @media (min-width: 700px) { .zd-stat-row { grid-template-columns: repeat(4, 1fr); } }

        .zd-stat-mini { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 12px; padding: 1rem; }

        .zd-card { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 14px; padding: 1.25rem; }
        .zd-card-title { font-size: 0.88rem; font-weight: 700; color: var(--zd-text); margin-bottom: 1rem; display: flex; align-items: center; gap: 7px; }

        .zd-ledger-row { display: flex; align-items: center; gap: 12px; padding: 0.75rem 0.9rem; border-radius: 10px; background: var(--zd-surface-alt); border: 1px solid var(--zd-border); margin-bottom: 6px; transition: border-color 0.13s; }
        .zd-ledger-row:last-child { margin-bottom: 0; }
        .zd-ledger-row:hover { border-color: var(--zd-primary); }

        .zd-ledger-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .zd-progress-track { height: 8px; border-radius: 10px; background: var(--zd-border); overflow: hidden; margin: 0.5rem 0; }
        .zd-progress-fill  { height: 100%; border-radius: 10px; background: var(--zd-gradient); transition: width 0.6s ease; }

        .zd-warning-box { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); border-radius: 10px; padding: 0.85rem 1rem; display: flex; align-items: flex-start; gap: 9px; margin-bottom: 1rem; }

        .zd-filter-chip { display: inline-flex; align-items: center; gap: 6px; padding: 0.3rem 0.75rem; border-radius: 20px; background: var(--zd-primary); color: #fff; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.75rem; }
        .zd-filter-clear { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1; padding: 0; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4 }}>
          Lesson Balance
        </h4>
        <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
          Track your payments, lesson credits and spending history.
        </p>
      </div>

      {/* Top stat bar */}
      <div className="zd-stat-row">
        {[
          { icon: CreditCard,    label: "Lessons Left",   value: LESSONS_LEFT,  color: p,         suffix: " credits" },
          { icon: DollarSign,    label: "Total Paid",     value: `$${TOTAL_PAID}`,  color: "#22c55e", suffix: "" },
          { icon: TrendingDown,  label: "Total Spent",    value: `$${TOTAL_SPENT}`, color: "#f59e0b", suffix: "" },
          { icon: CalendarDays,  label: "Lessons Taken",  value: LESSONS_TAKEN, color: "#8b5cf6", suffix: "" },
        ].map(({ icon: Icon, label, value, color, suffix }, i) => (
          <div key={i} className="zd-stat-mini">
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.6rem" }}>
              <Icon size={16} color={color} />
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--zd-text)", letterSpacing: "-0.03em" }}>{value}{suffix}</div>
            <div style={{ fontSize: "0.74rem", color: "var(--zd-text-muted)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="zd-bal-grid">

        {/* Left: ledger */}
        <div>
          {/* Balance card */}
          <div className="zd-card" style={{ marginBottom: "1rem", background: "var(--zd-gradient)", border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.3rem" }}>
              <CreditCard size={16} color="rgba(255,255,255,0.8)" />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontWeight: 600 }}>Current Balance</span>
            </div>
            <div style={{ fontSize: "3rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.05em", lineHeight: 1 }}>
              {LESSONS_LEFT}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>lesson credits remaining</div>
            <div className="zd-progress-track" style={{ background: "rgba(255,255,255,0.25)", marginTop: "0.85rem" }}>
              <div className="zd-progress-fill" style={{ width: `${progressPct}%`, background: "rgba(255,255,255,0.85)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>
              <span>{LESSONS_LEFT} remaining</span>
              <span>{TOTAL_LESSONS} total purchased</span>
            </div>
          </div>

          {/* Low balance warning */}
          {LESSONS_LEFT <= 3 && (
            <div className="zd-warning-box">
              <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f59e0b" }}>Low Balance</div>
                <div style={{ fontSize: "0.76rem", color: "var(--zd-text-muted)", marginTop: 2 }}>
                  You have only {LESSONS_LEFT} lesson(s) left. Visit the front desk to top up your balance.
                </div>
              </div>
            </div>
          )}

          {/* Transaction ledger */}
          <div className="zd-card">
            <div className="zd-card-title" style={{ justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <DollarSign size={15} color={p} />
                Transaction History
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--zd-text-muted)", fontWeight: 400 }}>
                {displayedCharges.length} records
              </span>
            </div>

            {filterDate && (
              <div>
                <span className="zd-filter-chip">
                  Filtered: {filterDate}
                  <button className="zd-filter-clear" onClick={() => setFilterDate(null)}>×</button>
                </span>
              </div>
            )}

            {displayedCharges.map((c, i) => {
              const isCredit = c.type === "credit";
              const color    = isCredit ? "#22c55e" : "#f59e0b";
              const bg       = isCredit ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)";
              return (
                <div key={i} className="zd-ledger-row">
                  <div className="zd-ledger-icon" style={{ background: bg }}>
                    {isCredit
                      ? <DollarSign size={16} color={color} />
                      : <TrendingDown size={16} color={color} />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--zd-text)" }}>{c.label}</div>
                    <div style={{ fontSize: "0.73rem", color: "var(--zd-text-muted)", marginTop: 1 }}>
                      {c.date} {c.instructor !== "—" ? `· ${c.instructor}` : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color }}>
                      {isCredit ? "+" : "−"}${c.amount}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--zd-text-muted)", marginTop: 1 }}>
                      bal: {c.balance_after}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: expense calendar */}
        <div>
          <div className="zd-card">
            <div className="zd-card-title">
              <CalendarDays size={15} color={p} />
              Expense Calendar
            </div>
            <ExpenseCalendar
              year={calYear} month={calMonth}
              onNav={handleCalNav}
              expDates={EXPENSE_DATES}
              selected={filterDate}
              onSelect={setFilterDate}
            />
          </div>

          {/* Monthly summary */}
          <div className="zd-card" style={{ marginTop: "1rem" }}>
            <div className="zd-card-title">
              <TrendingDown size={15} color={p} />
              This Month
            </div>
            {(() => {
              const now = new Date();
              const thisMonth = LESSON_CHARGES.filter(c => {
                const d = new Date(c.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              });
              const spent   = thisMonth.filter(c => c.type === "debit").reduce((s, c) => s + c.amount, 0);
              const lessons = thisMonth.filter(c => c.type === "debit").length;
              const topups  = thisMonth.filter(c => c.type === "credit").reduce((s, c) => s + c.amount, 0);
              return (
                <>
                  {[
                    { label: "Lessons taken",  value: lessons },
                    { label: "Credits spent",  value: `$${spent}` },
                    { label: "Top-ups",        value: topups > 0 ? `+$${topups}` : "None" },
                    { label: "Avg per lesson", value: lessons > 0 ? `$${(spent / lessons).toFixed(0)}` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", borderBottom: "1px solid var(--zd-border)" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--zd-text-muted)" }}>{label}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--zd-text)" }}>{value}</span>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </Layout>
  );
}