import { useState, useMemo } from "react";
import {
  CalendarDays, CheckCircle, XCircle, RefreshCcw,
  Search, Filter, ChevronLeft, ChevronRight, Clock,
  User, Plus, X, Check, AlertCircle, Car, MapPin,
  GraduationCap, Zap, Eye, Inbox,
} from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════ */
const TODAY_STR = "2026-02-20";

const SEED_BOOKINGS = [
  { id: 1,  student: "Rudo Kambarami",  instructor: "Blessing Chikwanda", cls: "Class 1", date: "2026-02-20", time: "10:00", duration: "1hr",  location: "Avondale Test Centre",  status: "confirmed" },
  { id: 2,  student: "Takudzwa Ndoro",  instructor: "Grace Mutasa",        cls: "Class 2", date: "2026-02-20", time: "14:00", duration: "2hr",  location: "Belvedere Grounds",     status: "pending"   },
  { id: 3,  student: "Farai Zimba",     instructor: "John Sithole",        cls: "Class 1", date: "2026-02-21", time: "09:00", duration: "1hr",  location: "Avondale Test Centre",  status: "cancelled" },
  { id: 4,  student: "Nyasha Dube",     instructor: "Blessing Chikwanda",  cls: "Class 2", date: "2026-02-22", time: "08:00", duration: "2hr",  location: "Belvedere Grounds",     status: "confirmed" },
  { id: 5,  student: "Chipo Mutendi",   instructor: "Grace Mutasa",        cls: "Class 1", date: "2026-02-22", time: "10:00", duration: "1hr",  location: "Avondale Test Centre",  status: "pending"   },
  { id: 6,  student: "Tendai Makoni",   instructor: "John Sithole",        cls: "Class 1", date: "2026-02-23", time: "13:00", duration: "1hr",  location: "Avondale Test Centre",  status: "confirmed" },
  { id: 7,  student: "Simba Choto",     instructor: "Blessing Chikwanda",  cls: "Class 1", date: "2026-02-24", time: "09:00", duration: "1hr",  location: "Belvedere Grounds",     status: "pending"   },
  { id: 8,  student: "Rutendo Mhuri",   instructor: "Grace Mutasa",        cls: "Class 1", date: "2026-02-24", time: "11:00", duration: "1hr",  location: "Avondale Test Centre",  status: "confirmed" },
  { id: 9,  student: "Panashe Moyo",    instructor: "John Sithole",        cls: "Class 2", date: "2026-02-25", time: "08:00", duration: "2hr",  location: "Belvedere Grounds",     status: "confirmed" },
  { id: 10, student: "Vimbai Ncube",    instructor: "Blessing Chikwanda",  cls: "Class 1", date: "2026-02-25", time: "10:00", duration: "1hr",  location: "Avondale Test Centre",  status: "pending"   },
  { id: 11, student: "Farai Zimba",     instructor: "Grace Mutasa",        cls: "Class 1", date: "2026-02-26", time: "13:00", duration: "1hr",  location: "Belvedere Grounds",     status: "cancelled" },
  { id: 12, student: "Rudo Kambarami",  instructor: "Blessing Chikwanda",  cls: "Class 1", date: "2026-02-27", time: "10:00", duration: "1hr",  location: "Avondale Test Centre",  status: "confirmed" },
];

const INSTRUCTORS = ["Blessing Chikwanda", "Grace Mutasa", "John Sithole"];
const LOCATIONS   = ["Avondale Test Centre", "Belvedere Grounds"];
const TIME_SLOTS  = ["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"];
const MONTHS      = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_SHORT   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUS_CFG = {
  confirmed: { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  label: "Confirmed",  icon: CheckCircle  },
  pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Pending",    icon: Clock        },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  label: "Cancelled",  icon: XCircle      },
};

const INSTR_AVATARS = {
  "Blessing Chikwanda": "BC",
  "Grace Mutasa":       "GM",
  "John Sithole":       "JS",
};

/* ═══════════════════════════════════════════════════════════════════
   GLASSMORPHIC RESCHEDULE MODAL
═══════════════════════════════════════════════════════════════════ */
function RescheduleModal({ booking, onClose, onConfirm }) {
  const [newDate, setNewDate]     = useState(booking.date);
  const [newTime, setNewTime]     = useState(booking.time);
  const [newInstr, setNewInstr]   = useState(booking.instructor);
  const [newLoc, setNewLoc]       = useState(booking.location);
  const [reason, setReason]       = useState("");

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.065)", border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 10, color: "#e2e8f0", padding: "0.56rem 0.78rem",
    fontSize: "0.83rem", fontFamily: "inherit", outline: "none", colorScheme: "dark",
  };
  const labelStyle = {
    fontSize: "0.68rem", fontWeight: 700, color: "#64748b",
    display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,8,20,0.78)", backdropFilter: "blur(14px)" }} onClick={onClose} />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 500,
        background: "rgba(255,255,255,0.052)", border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 22, backdropFilter: "blur(40px)",
        boxShadow: "0 32px 96px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
        padding: "1.85rem", fontFamily: "inherit", color: "#e2e8f0",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.4rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <RefreshCcw size={20} color="#3b82f6" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>Reschedule Lesson</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 1 }}>{booking.student} · {booking.cls}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 9, width: 32, height: 32, cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <X size={15} />
          </button>
        </div>

        {/* Current summary */}
        <div style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "0.85rem 1rem", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Current Booking</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.81rem" }}>
            {[
              { icon: CalendarDays, val: booking.date },
              { icon: Clock,        val: booking.time },
              { icon: User,         val: booking.instructor },
              { icon: MapPin,       val: booking.location },
            ].map(({ icon: Icon, val }) => (
              <span key={val} style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8" }}>
                <Icon size={12} color="#64748b" /> {val}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); onConfirm({ ...booking, date: newDate, time: newTime, instructor: newInstr, location: newLoc, status: "confirmed" }); onClose(); }}>
          {/* Date + Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>New Date</label>
              <input type="date" required style={inputStyle} value={newDate} onChange={e => setNewDate(e.target.value)} min={TODAY_STR} />
            </div>
            <div>
              <label style={labelStyle}>New Time</label>
              <select required style={{ ...inputStyle, cursor: "pointer" }} value={newTime} onChange={e => setNewTime(e.target.value)}>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Instructor + Location */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Instructor</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={newInstr} onChange={e => setNewInstr(e.target.value)}>
                {INSTRUCTORS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={newLoc} onChange={e => setNewLoc(e.target.value)}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Reason */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Reason for change (optional)</label>
            <textarea rows={2} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Instructor unavailable, venue conflict…" />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose}
              style={{ padding: "0.68rem 1rem", borderRadius: 11, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontWeight: 500, fontSize: "0.85rem", fontFamily: "inherit", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit"
              style={{ flex: 1, padding: "0.68rem", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontWeight: 800, fontSize: "0.88rem", fontFamily: "inherit", cursor: "pointer" }}>
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADD BOOKING MODAL
═══════════════════════════════════════════════════════════════════ */
function AddBookingModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    student: "", instructor: INSTRUCTORS[0], cls: "Class 1",
    date: TODAY_STR, time: "08:00", duration: "1hr",
    location: LOCATIONS[0], status: "confirmed",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.065)", border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 10, color: "#e2e8f0", padding: "0.56rem 0.78rem",
    fontSize: "0.83rem", fontFamily: "inherit", outline: "none", colorScheme: "dark",
  };
  const labelStyle = {
    fontSize: "0.68rem", fontWeight: 700, color: "#64748b",
    display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,8,20,0.78)", backdropFilter: "blur(14px)" }} onClick={onClose} />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 500,
        background: "rgba(255,255,255,0.052)", border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 22, backdropFilter: "blur(40px)",
        boxShadow: "0 32px 96px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
        padding: "1.85rem", fontFamily: "inherit", color: "#e2e8f0",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>New Booking</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 1 }}>Schedule a lesson</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 9, width: 32, height: 32, cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave({ ...form, id: Date.now() }); onClose(); }}>
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Student Name</label>
            <input required style={inputStyle} value={form.student} onChange={e => set("student", e.target.value)} placeholder="e.g. Rudo Kambarami" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Instructor</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.instructor} onChange={e => set("instructor", e.target.value)}>
                {INSTRUCTORS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>License Class</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.cls} onChange={e => set("cls", e.target.value)}>
                <option value="Class 1">Class 1 — Light</option>
                <option value="Class 2">Class 2 — Heavy</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" required style={inputStyle} value={form.date} min={TODAY_STR} onChange={e => set("date", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.time} onChange={e => set("time", e.target.value)}>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Duration</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.duration} onChange={e => set("duration", e.target.value)}>
                <option value="1hr">1 hour</option>
                <option value="2hr">2 hours</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.location} onChange={e => set("location", e.target.value)}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Status selector */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.entries(STATUS_CFG).map(([val, cfg]) => (
                <button key={val} type="button" onClick={() => set("status", val)}
                  style={{ flex: 1, padding: "0.42rem 0", borderRadius: 8, border: `1px solid ${form.status === val ? cfg.color + "88" : "rgba(255,255,255,0.14)"}`, background: form.status === val ? cfg.bg : "rgba(255,255,255,0.04)", color: form.status === val ? cfg.color : "#94a3b8", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.13s" }}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose}
              style={{ padding: "0.68rem 1rem", borderRadius: 11, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontWeight: 500, fontFamily: "inherit", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit"
              style={{ flex: 1, padding: "0.68rem", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontWeight: 800, fontSize: "0.88rem", fontFamily: "inherit", cursor: "pointer" }}>
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════════════════════════ */
function DetailPanel({ booking, onClose, onReschedule, onConfirm, onCancel, primary }) {
  if (!booking) return null;
  const sc = STATUS_CFG[booking.status];
  const StatusIcon = sc.icon;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.22)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1000,
        width: "100%", maxWidth: 360,
        background: "var(--zd-surface)", borderLeft: "1px solid var(--zd-border)",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "1.2rem 1.4rem", borderBottom: "1px solid var(--zd-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--zd-text)" }}>Booking Detail</div>
          <button onClick={onClose} style={{ background: "var(--zd-surface-alt)", border: "1px solid var(--zd-border)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "var(--zd-text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.4rem" }}>
          {/* Status */}
          <div style={{ marginBottom: "1.1rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: sc.bg, color: sc.color }}>
              <StatusIcon size={12} /> {sc.label}
            </span>
          </div>

          {/* Student + class */}
          <div style={{ background: "var(--zd-gradient)", borderRadius: 14, padding: "1rem 1.1rem", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -15, top: -15, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
            <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Student</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff", marginBottom: 4 }}>{booking.student}</div>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: "rgba(255,255,255,0.2)", color: "#fff" }}>{booking.cls}</span>
          </div>

          {/* Detail rows */}
          {[
            { label: "Instructor", value: booking.instructor,  icon: GraduationCap },
            { label: "Date",       value: booking.date,         icon: CalendarDays  },
            { label: "Time",       value: booking.time,         icon: Clock         },
            { label: "Duration",   value: booking.duration,     icon: Zap           },
            { label: "Location",   value: booking.location,     icon: MapPin        },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.6rem 0", borderBottom: "1px solid var(--zd-border)" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `${primary}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={13} color={primary} />
              </div>
              <div>
                <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                <div style={{ fontSize: "0.83rem", color: "var(--zd-text)", marginTop: 1 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions footer */}
        <div style={{ padding: "1rem 1.4rem", borderTop: "1px solid var(--zd-border)", display: "flex", flexDirection: "column", gap: 7 }}>
          {booking.status !== "confirmed" && (
            <button onClick={onConfirm}
              style={{ width: "100%", padding: "0.6rem", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontWeight: 700, fontSize: "0.84rem", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Check size={14} /> Confirm Booking
            </button>
          )}
          <button onClick={onReschedule}
            style={{ width: "100%", padding: "0.6rem", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontWeight: 700, fontSize: "0.84rem", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <RefreshCcw size={14} /> Reschedule
          </button>
          {booking.status !== "cancelled" && (
            <button onClick={onCancel}
              style={{ width: "100%", padding: "0.6rem", borderRadius: 9, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#ef4444", fontWeight: 700, fontSize: "0.84rem", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <X size={14} /> Cancel Booking
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CALENDAR COMPONENT
═══════════════════════════════════════════════════════════════════ */
function MonthCalendar({ bookings, calYear, calMonth, onNav, primary, onDayClick, activeDateFilter }) {
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateKey = (d) => `${calYear}-${String(calMonth + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const countFor = (d) => d ? bookings.filter(b => b.date === dateKey(d)).length : 0;
  const confirmedFor = (d) => d ? bookings.filter(b => b.date === dateKey(d) && b.status === "confirmed").length : 0;
  const pendingFor = (d) => d ? bookings.filter(b => b.date === dateKey(d) && b.status === "pending").length : 0;

  const todayKey = TODAY_STR;
  const isToday = (d) => d && dateKey(d) === todayKey;
  const isActive = (d) => d && dateKey(d) === activeDateFilter;

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--zd-text)" }}>
          {MONTHS[calMonth]} {calYear}
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {[{ icon: ChevronLeft, n: -1 }, { icon: ChevronRight, n: 1 }].map(({ icon: Icon, n }, i) => (
            <button key={i} onClick={() => onNav(n)}
              style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--zd-border)", background: "var(--zd-surface-alt)", color: "var(--zd-text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 4 }}>
        {DAY_SHORT.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.6rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", padding: "2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          const cnt  = countFor(d);
          const conf = confirmedFor(d);
          const pend = pendingFor(d);
          const today = isToday(d);
          const active = isActive(d);

          return (
            <div key={i}
              onClick={() => d && cnt > 0 && onDayClick(active ? null : dateKey(d))}
              style={{
                aspectRatio: "1", borderRadius: 9,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: today || active ? 800 : 400,
                cursor: d && cnt > 0 ? "pointer" : "default",
                background: active ? primary : today ? `${primary}18` : "transparent",
                color: active ? "#fff" : today ? primary : d ? "var(--zd-text)" : "transparent",
                border: `1px solid ${active ? primary : today ? `${primary}35` : "transparent"}`,
                position: "relative",
                transition: "all 0.12s",
              }}
              onMouseEnter={e => { if (d && cnt > 0 && !active) e.currentTarget.style.background = "var(--zd-surface-alt)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span>{d}</span>
              {cnt > 0 && (
                <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                  {conf > 0 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: active ? "rgba(255,255,255,0.8)" : "#22c55e" }} />}
                  {pend > 0 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: active ? "rgba(255,255,255,0.6)" : "#f59e0b" }} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginTop: "0.75rem", fontSize: "0.7rem", color: "var(--zd-text-muted)", justifyContent: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> Confirmed
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} /> Pending
        </span>
        <span style={{ fontSize: "0.68rem" }}>Click date to filter</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════ */
function Toast({ msg, type }) {
  const bg = type === "confirmed" ? "#22c55e" : type === "cancelled" ? "#ef4444" : type === "rescheduled" ? "#3b82f6" : "#4f46e5";
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 4000, background: bg, color: "#fff", padding: "0.75rem 1.25rem", borderRadius: 10, fontSize: "0.84rem", fontWeight: 600, fontFamily: "inherit", boxShadow: `0 8px 28px ${bg}55`, display: "flex", alignItems: "center", gap: 8 }}>
      <Check size={16} /> {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function BookingsManagement() {
  const { theme } = useAuth();
  const p = theme?.primary || "#4f46e5";

  const today = new Date(2026, 1, 20);
  const [bookings, setBookings]       = useState(SEED_BOOKINGS);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [classFilter, setClassFilter]   = useState("All");
  const [instrFilter, setInstrFilter]   = useState("All");
  const [showFilters, setShowFilters]   = useState(false);
  const [dateFilter, setDateFilter]     = useState(null);
  const [calYear,  setCalYear]          = useState(2026);
  const [calMonth, setCalMonth]         = useState(1);
  const [sortBy, setSortBy]             = useState("date_asc");
  const [modal, setModal]               = useState(null); // { type, booking? }
  const [detailBooking, setDetailBooking] = useState(null);
  const [toast, setToast]               = useState(null);

  const fireToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };

  const handleCalNav = (dir) => {
    if (dir === -1) { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); } else setCalMonth(m => m-1); }
    else            { if (calMonth === 11){ setCalYear(y => y+1); setCalMonth(0);  } else setCalMonth(m => m+1); }
    setDateFilter(null);
  };

  /* Actions */
  const updateStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (detailBooking?.id === id) setDetailBooking(p => ({ ...p, status }));
  };

  const confirmBooking = (id) => { updateStatus(id, "confirmed"); fireToast("Booking confirmed", "confirmed"); };
  const cancelBooking  = (id) => { updateStatus(id, "cancelled"); fireToast("Booking cancelled", "cancelled"); if (detailBooking?.id === id) setDetailBooking(null); };

  const rescheduleBooking = (updated) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    if (detailBooking?.id === updated.id) setDetailBooking(updated);
    fireToast(`Rescheduled to ${updated.date} ${updated.time}`, "rescheduled");
  };

  const addBooking = (b) => {
    setBookings(prev => [...prev, b]);
    fireToast(`Booking created for ${b.student}`, "added");
  };

  /* Filter + sort */
  const filtered = useMemo(() => {
    let arr = [...bookings];
    if (search)       arr = arr.filter(b => b.student.toLowerCase().includes(search.toLowerCase()) || b.instructor.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "All") arr = arr.filter(b => b.status    === statusFilter.toLowerCase());
    if (classFilter  !== "All") arr = arr.filter(b => b.cls       === classFilter);
    if (instrFilter  !== "All") arr = arr.filter(b => b.instructor === instrFilter);
    if (dateFilter)             arr = arr.filter(b => b.date       === dateFilter);
    arr.sort((a, b) => {
      if (sortBy === "date_asc")   return (a.date + a.time).localeCompare(b.date + b.time);
      if (sortBy === "date_desc")  return (b.date + b.time).localeCompare(a.date + a.time);
      if (sortBy === "student")    return a.student.localeCompare(b.student);
      if (sortBy === "instructor") return a.instructor.localeCompare(b.instructor);
      return 0;
    });
    return arr;
  }, [bookings, search, statusFilter, classFilter, instrFilter, dateFilter, sortBy]);

  /* Stats */
  const totalCount     = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const pendingCount   = bookings.filter(b => b.status === "pending").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const todayCount     = bookings.filter(b => b.date === TODAY_STR).length;
  const activeFilters  = [statusFilter !== "All", classFilter !== "All", instrFilter !== "All"].filter(Boolean).length;

  return (
    <Layout>
      <style>{`
        .zd-bk-stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
        @media(min-width:680px){ .zd-bk-stats { grid-template-columns: repeat(5,1fr); } }
        .zd-bk-stat { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 13px; padding: 1rem; transition: transform 0.13s; cursor: default; }
        .zd-bk-stat:hover { transform: translateY(-2px); }

        .zd-main-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media(min-width:1100px) { .zd-main-grid { grid-template-columns: 1fr 300px; } }

        .zd-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 0.85rem; }
        .zd-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .zd-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--zd-text-muted); pointer-events: none; }
        .zd-search-input { width: 100%; background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 10px; color: var(--zd-text); padding: 0.53rem 0.85rem 0.53rem 2.3rem; font-size: 0.83rem; font-family: inherit; box-sizing: border-box; outline: none; }
        .zd-search-input:focus { border-color: var(--zd-primary); }

        .zd-tbtn { display: flex; align-items: center; gap: 6px; padding: 0.5rem 0.9rem; border-radius: 10px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.8rem; font-weight: 600; font-family: inherit; cursor: pointer; white-space: nowrap; transition: all 0.13s; }
        .zd-tbtn:hover { border-color: var(--zd-primary); color: var(--zd-primary); }
        .zd-tbtn.primary { background: var(--zd-gradient); color: #fff; border: none; }
        .zd-tbtn.primary:hover { filter: brightness(1.07); color: #fff; border: none; }
        .zd-tbtn.filt-active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }

        .zd-pill-row { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 1rem; }
        .zd-pill { padding: 0.35rem 0.85rem; border-radius: 20px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.76rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.13s; white-space: nowrap; }
        .zd-pill.active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }
        .zd-pill:hover:not(.active) { border-color: var(--zd-primary); color: var(--zd-primary); }

        .zd-filter-drawer { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 13px; padding: 1rem 1.1rem; margin-bottom: 1rem; display: grid; grid-template-columns: repeat(2,1fr); gap: 0.75rem; }
        @media(min-width:800px){ .zd-filter-drawer { grid-template-columns: repeat(4,1fr); } }
        .zd-fgroup label { font-size: 0.68rem; font-weight: 700; color: var(--zd-text-muted); display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.06em; }
        .zd-fsel { width: 100%; background: var(--zd-surface-alt); border: 1px solid var(--zd-border); border-radius: 8px; color: var(--zd-text); padding: 0.45rem 0.65rem; font-size: 0.8rem; font-family: inherit; cursor: pointer; outline: none; }
        .zd-sort-sel { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 10px; color: var(--zd-text); padding: 0.5rem 0.75rem; font-size: 0.8rem; font-family: inherit; cursor: pointer; outline: none; }

        .zd-tbl-wrap { border-radius: 14px; border: 1px solid var(--zd-border); overflow: hidden; overflow-x: auto; }
        .zd-tbl { width: 100%; border-collapse: collapse; min-width: 700px; }
        .zd-tbl thead tr { border-bottom: 1px solid var(--zd-border); }
        .zd-tbl th { background: var(--zd-surface-alt); color: var(--zd-text-muted); font-weight: 700; font-size: 0.68rem; letter-spacing: 0.07em; text-transform: uppercase; padding: 0.72rem 1rem; text-align: left; white-space: nowrap; }
        .zd-tbl td { background: var(--zd-surface); padding: 0.88rem 1rem; border-bottom: 1px solid var(--zd-border); color: var(--zd-text); vertical-align: middle; font-size: 0.83rem; }
        .zd-tbl tbody tr:last-child td { border-bottom: none; }
        .zd-tbl tbody tr { transition: background 0.11s; cursor: pointer; }
        .zd-tbl tbody tr:hover td { background: var(--zd-surface-alt); }

        .zd-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.67rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
        .zd-cls-badge { display: inline-block; font-size: 0.67rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
        .zd-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.62rem; color: #fff; flex-shrink: 0; background: var(--zd-gradient); }

        .zd-act-btn { padding: 0.28rem 0.65rem; border-radius: 7px; border: none; font-size: 0.72rem; font-weight: 700; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: filter 0.12s; white-space: nowrap; }
        .zd-act-btn:hover { filter: brightness(1.1); }

        .zd-cal-card { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 14px; padding: 1.25rem; }
        .zd-empty { text-align: center; padding: 3rem 1rem; color: var(--zd-text-muted); background: var(--zd-surface); }

        .zd-date-chip { display: inline-flex; align-items: center; gap: 6px; padding: 0.35rem 0.85rem; border-radius: 20px; background: var(--zd-primary); color: #fff; font-size: 0.76rem; font-weight: 700; margin-bottom: 0.85rem; }
        .zd-chip-clear { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1; padding: 0; display: flex; align-items: center; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <CalendarDays size={22} color={p} /> Lesson Schedule
          </h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            Manage instructor availability and student bookings.
            {pendingCount > 0 && <strong style={{ color: "#f59e0b", marginLeft: 6 }}>{pendingCount} pending approval.</strong>}
          </p>
        </div>
        <button className="zd-tbtn primary" onClick={() => setModal({ type: "add" })}>
          <Plus size={17} /> New Booking
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="zd-bk-stats">
        {[
          { label: "Total",     value: totalCount,     color: p,         icon: Inbox,         bg: `${p}18`                  },
          { label: "Today",     value: todayCount,     color: "#8b5cf6", icon: CalendarDays,  bg: "rgba(139,92,246,0.12)"   },
          { label: "Confirmed", value: confirmedCount, color: "#22c55e", icon: CheckCircle,   bg: "rgba(34,197,94,0.12)"    },
          { label: "Pending",   value: pendingCount,   color: "#f59e0b", icon: Clock,         bg: "rgba(245,158,11,0.12)"   },
          { label: "Cancelled", value: cancelledCount, color: "#ef4444", icon: XCircle,       bg: "rgba(239,68,68,0.12)"    },
        ].map(({ label, value, color, icon: Icon, bg }) => (
          <div key={label} className="zd-bk-stat"
            onClick={() => label !== "Total" && label !== "Today" && setStatusFilter(statusFilter === label ? "All" : label)}
            style={{ cursor: ["Confirmed","Pending","Cancelled"].includes(label) ? "pointer" : "default" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
              <Icon size={16} color={color} />
            </div>
            <div style={{ fontSize: "1.55rem", fontWeight: 900, color: "var(--zd-text)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: "0.73rem", color: "var(--zd-text-muted)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Status pill filter ── */}
      <div className="zd-pill-row">
        {["All","Confirmed","Pending","Cancelled"].map(s => (
          <button key={s} className={`zd-pill${statusFilter === s ? " active" : ""}`} onClick={() => setStatusFilter(s)}>
            {s}
            {s === "Pending" && pendingCount > 0 && (
              <span style={{ marginLeft: 5, background: statusFilter === "Pending" ? "rgba(255,255,255,0.25)" : "rgba(245,158,11,0.2)", color: statusFilter === "Pending" ? "#fff" : "#f59e0b", borderRadius: 20, padding: "0 5px", fontSize: "0.66rem", fontWeight: 800 }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Main grid: table + calendar ── */}
      <div className="zd-main-grid">
        {/* Left: table */}
        <div>
          {/* Toolbar */}
          <div className="zd-toolbar">
            <div className="zd-search-wrap">
              <span className="zd-search-icon"><Search size={14} /></span>
              <input className="zd-search-input" placeholder="Search student or instructor…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className={`zd-tbtn${showFilters ? " filt-active" : ""}`} onClick={() => setShowFilters(v => !v)}>
              <Filter size={14} /> Filters
              {activeFilters > 0 && <span style={{ background: showFilters ? "rgba(255,255,255,0.3)" : "var(--zd-primary)", color: "#fff", borderRadius: 20, padding: "0 5px", fontSize: "0.66rem", fontWeight: 800 }}>{activeFilters}</span>}
            </button>
            <select className="zd-sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date_asc">Date ↑</option>
              <option value="date_desc">Date ↓</option>
              <option value="student">Student A–Z</option>
              <option value="instructor">Instructor A–Z</option>
            </select>
            <span style={{ fontSize: "0.78rem", color: "var(--zd-text-muted)", whiteSpace: "nowrap" }}>{filtered.length} bookings</span>
          </div>

          {/* Filter drawer */}
          {showFilters && (
            <div className="zd-filter-drawer">
              <div className="zd-fgroup">
                <label>Class</label>
                <select className="zd-fsel" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                  <option>All</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                </select>
              </div>
              <div className="zd-fgroup">
                <label>Instructor</label>
                <select className="zd-fsel" value={instrFilter} onChange={e => setInstrFilter(e.target.value)}>
                  <option>All</option>
                  {INSTRUCTORS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="zd-fgroup">
                <label>Date</label>
                <input type="date" className="zd-fsel" value={dateFilter || ""} onChange={e => setDateFilter(e.target.value || null)} style={{ colorScheme: "auto" }} />
              </div>
              <div className="zd-fgroup" style={{ display: "flex", alignItems: "flex-end" }}>
                <button onClick={() => { setClassFilter("All"); setInstrFilter("All"); setDateFilter(null); setSearch(""); setStatusFilter("All"); }}
                  style={{ padding: "0.45rem 0.85rem", borderRadius: 8, border: "1px solid var(--zd-border)", background: "transparent", color: "var(--zd-text-muted)", fontSize: "0.78rem", fontFamily: "inherit", cursor: "pointer", width: "100%" }}>
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Active date chip */}
          {dateFilter && (
            <div>
              <span className="zd-date-chip">
                <CalendarDays size={13} /> {dateFilter}
                <button className="zd-chip-clear" onClick={() => setDateFilter(null)}><X size={13} /></button>
              </span>
            </div>
          )}

          {/* Table */}
          <div className="zd-tbl-wrap">
            {filtered.length === 0 ? (
              <div className="zd-empty">
                <Inbox size={36} color="var(--zd-border)" style={{ marginBottom: 12 }} />
                <div style={{ fontWeight: 600, color: "var(--zd-text)", marginBottom: 4 }}>No bookings found</div>
                <div style={{ fontSize: "0.82rem" }}>Try adjusting your filters.</div>
              </div>
            ) : (
              <table className="zd-tbl">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Instructor</th>
                    <th>Schedule</th>
                    <th>Class</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => {
                    const sc = STATUS_CFG[b.status];
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={b.id} onClick={() => setDetailBooking(b)}>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--zd-text)" }}>{b.student}</div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="zd-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{INSTR_AVATARS[b.instructor] || "??"}</div>
                            <span style={{ fontSize: "0.8rem" }}>{b.instructor.split(" ")[0]}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{b.date}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.73rem", color: "var(--zd-text-muted)", marginTop: 1 }}>
                            <Clock size={11} /> {b.time} · {b.duration}
                          </div>
                        </td>
                        <td>
                          <span className="zd-cls-badge" style={{ background: `${p}14`, color: p }}>{b.cls}</span>
                        </td>
                        <td style={{ fontSize: "0.77rem", color: "var(--zd-text-muted)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {b.location}
                        </td>
                        <td>
                          <span className="zd-badge" style={{ background: sc.bg, color: sc.color }}>
                            <StatusIcon size={11} /> {sc.label}
                          </span>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", gap: 4 }}>
                            {b.status !== "confirmed" && (
                              <button className="zd-act-btn" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
                                onClick={() => confirmBooking(b.id)} title="Confirm">
                                <Check size={11} />
                              </button>
                            )}
                            <button className="zd-act-btn" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
                              onClick={() => setModal({ type: "reschedule", booking: b })} title="Reschedule">
                              <RefreshCcw size={11} />
                            </button>
                            {b.status !== "cancelled" && (
                              <button className="zd-act-btn" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                                onClick={() => cancelBooking(b.id)} title="Cancel">
                                <X size={11} />
                              </button>
                            )}
                            <button className="zd-act-btn" style={{ background: "var(--zd-surface-alt)", color: "var(--zd-text-muted)", border: "1px solid var(--zd-border)" }}
                              onClick={() => setDetailBooking(b)} title="View">
                              <Eye size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: calendar */}
        <div className="zd-cal-card" style={{ alignSelf: "start" }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--zd-text)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 7 }}>
            <CalendarDays size={15} color={p} /> Booking Calendar
          </div>
          <MonthCalendar
            bookings={bookings}
            calYear={calYear} calMonth={calMonth}
            onNav={handleCalNav}
            primary={p}
            onDayClick={setDateFilter}
            activeDateFilter={dateFilter}
          />

          {/* Day summary when filtered */}
          {dateFilter && (() => {
            const dayBookings = bookings.filter(b => b.date === dateFilter);
            return dayBookings.length > 0 ? (
              <div style={{ marginTop: "1rem", borderTop: "1px solid var(--zd-border)", paddingTop: "1rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                  {dateFilter} · {dayBookings.length} lesson{dayBookings.length !== 1 ? "s" : ""}
                </div>
                {dayBookings.map(b => {
                  const sc = STATUS_CFG[b.status];
                  return (
                    <div key={b.id} onClick={() => setDetailBooking(b)}
                      style={{ padding: "0.55rem 0.7rem", borderRadius: 9, background: "var(--zd-surface-alt)", border: "1px solid var(--zd-border)", marginBottom: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--zd-primary)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--zd-border)"}>
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--zd-text)" }}>{b.student}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--zd-text-muted)" }}>{b.time} · {b.instructor.split(" ")[0]}</div>
                      </div>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: sc.bg, color: sc.color, flexShrink: 0 }}>{sc.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : null;
          })()}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal?.type === "reschedule" && (
        <RescheduleModal booking={modal.booking} onClose={() => setModal(null)} onConfirm={rescheduleBooking} />
      )}
      {modal?.type === "add" && (
        <AddBookingModal onClose={() => setModal(null)} onSave={addBooking} />
      )}

      {/* ── Detail panel ── */}
      {detailBooking && (
        <DetailPanel
          booking={detailBooking}
          primary={p}
          onClose={() => setDetailBooking(null)}
          onReschedule={() => { setModal({ type: "reschedule", booking: detailBooking }); setDetailBooking(null); }}
          onConfirm={() => { confirmBooking(detailBooking.id); }}
          onCancel={() => { cancelBooking(detailBooking.id); setDetailBooking(null); }}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </Layout>
  );
}