import { useState, useMemo } from "react";
import {
  Search, Plus, Filter, Trash2, Edit2, Phone,
  CheckCircle2, X, User, BookOpen, Car,
  CreditCard, TrendingUp, AlertCircle, ChevronDown,
  Check, GraduationCap, Clock, MoreVertical, Eye,
} from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════ */
const SEED_STUDENTS = [
  { id: 1,  name: "Rudo Kambarami",  phone: "+263 77 123 4567", email: "rudo.k@mail.com",     licenseClass: "Class 1", paid: 15, used: 13, instructor: "Blessing Chikwanda", status: "active",    joined: "2026-01-05" },
  { id: 2,  name: "Takudzwa Ndoro",  phone: "+263 71 987 6543", email: "tndoro@mail.com",      licenseClass: "Class 2", paid: 10, used: 2,  instructor: "Grace Mutasa",       status: "active",    joined: "2026-01-18" },
  { id: 3,  name: "Farai Zimba",     phone: "+263 78 444 5555", email: "farai.z@mail.com",     licenseClass: "Class 1", paid: 20, used: 20, instructor: "Blessing Chikwanda", status: "completed", joined: "2025-11-02" },
  { id: 4,  name: "Nyasha Dube",     phone: "+263 73 222 1111", email: "nyasha.d@mail.com",    licenseClass: "Class 2", paid: 12, used: 4,  instructor: "John Sithole",       status: "active",    joined: "2026-01-28" },
  { id: 5,  name: "Chipo Mutendi",   phone: "+263 77 888 2233", email: "chipomu@mail.com",     licenseClass: "Class 1", paid: 12, used: 7,  instructor: "Grace Mutasa",       status: "active",    joined: "2026-02-03" },
  { id: 6,  name: "Tendai Makoni",   phone: "+263 71 333 4455", email: "tendai.m@mail.com",    licenseClass: "Class 1", paid: 8,  used: 6,  instructor: "John Sithole",       status: "active",    joined: "2026-01-10" },
  { id: 7,  name: "Simba Choto",     phone: "+263 78 999 0011", email: "simba.c@mail.com",     licenseClass: "Class 1", paid: 10, used: 8,  instructor: "Blessing Chikwanda", status: "active",    joined: "2025-12-15" },
  { id: 8,  name: "Rutendo Mhuri",   phone: "+263 73 555 6677", email: "rmhuri@mail.com",      licenseClass: "Class 1", paid: 6,  used: 2,  instructor: "Grace Mutasa",       status: "inactive",  joined: "2026-02-10" },
  { id: 9,  name: "Panashe Moyo",    phone: "+263 77 111 2222", email: "panashe.m@mail.com",   licenseClass: "Class 2", paid: 15, used: 15, instructor: "John Sithole",       status: "completed", joined: "2025-10-20" },
  { id: 10, name: "Vimbai Ncube",    phone: "+263 71 444 3333", email: "vncube@mail.com",      licenseClass: "Class 1", paid: 12, used: 1,  instructor: "Blessing Chikwanda", status: "active",    joined: "2026-02-15" },
];

const INSTRUCTORS = ["Blessing Chikwanda", "Grace Mutasa", "John Sithole"];

const STATUS_CFG = {
  active:    { label: "Active",    color: "#22c55e", bg: "rgba(34,197,94,0.12)"  },
  inactive:  { label: "Inactive",  color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  completed: { label: "Completed", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
};

const EMPTY_FORM = {
  name: "", phone: "", email: "", licenseClass: "Class 1",
  paid: 0, used: 0, instructor: "Blessing Chikwanda", status: "active",
};

/* ═══════════════════════════════════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════════════════════════════════ */
function LessonBar({ paid, used, primary }) {
  const pct  = paid > 0 ? Math.min((used / paid) * 100, 100) : 0;
  const left = paid - used;
  const barColor = left <= 2 ? "#ef4444" : left <= 4 ? "#f59e0b" : primary;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--zd-text-muted)", marginBottom: 3 }}>
        <span>{used}/{paid} used</span>
        <span style={{ fontWeight: 700, color: left <= 2 ? "#ef4444" : "var(--zd-text)" }}>{left} left</span>
      </div>
      <div style={{ height: 5, borderRadius: 10, background: "var(--zd-border)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 10, background: barColor, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STUDENT FORM MODAL — glassmorphic
═══════════════════════════════════════════════════════════════════ */
function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(student ? { ...student } : { ...EMPTY_FORM });
  const remaining = form.paid - form.used;

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.065)", border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 10, color: "#e2e8f0", padding: "0.58rem 0.8rem",
    fontSize: "0.83rem", fontFamily: "inherit", outline: "none", colorScheme: "dark",
  };
  const labelStyle = {
    fontSize: "0.68rem", fontWeight: 700, color: "#64748b",
    display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,8,20,0.75)", backdropFilter: "blur(12px)" }} onClick={onClose} />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 520,
        background: "rgba(255,255,255,0.052)", border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 22, backdropFilter: "blur(40px)",
        boxShadow: "0 32px 96px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
        padding: "1.85rem", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0",
        maxHeight: "92vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
                {student ? "Edit Student" : "Register Student"}
              </div>
              <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: 1 }}>
                {student ? `Editing ${student.name}` : "Create a new student profile"}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 9, width: 32, height: 32, cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form); onClose(); }}>
          {/* Name + Phone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input required style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Rudo Kambarami" />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input required style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+263 77 ..." />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} placeholder="student@example.com" />
          </div>

          {/* Class + Instructor */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>License Class</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.licenseClass} onChange={e => set("licenseClass", e.target.value)}>
                <option value="Class 1">Class 1 — Light vehicles</option>
                <option value="Class 2">Class 2 — Heavy vehicles</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Assigned Instructor</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.instructor} onChange={e => set("instructor", e.target.value)}>
                {INSTRUCTORS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* Paid + Used */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
            <div>
              <label style={labelStyle}>Lessons Paid</label>
              <input type="number" min={0} style={inputStyle} value={form.paid} onChange={e => set("paid", Math.max(0, parseInt(e.target.value) || 0))} />
            </div>
            <div>
              <label style={labelStyle}>Lessons Used</label>
              <input type="number" min={0} max={form.paid} style={inputStyle} value={form.used} onChange={e => set("used", Math.max(0, Math.min(form.paid, parseInt(e.target.value) || 0)))} />
            </div>
          </div>

          {/* Balance preview */}
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 11, padding: "0.85rem 1rem", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Lesson Balance</span>
              <span style={{ fontSize: "1.15rem", fontWeight: 900, color: remaining <= 2 ? "#ef4444" : remaining <= 4 ? "#f59e0b" : "#22c55e" }}>{remaining} remaining</span>
            </div>
            <div style={{ height: 6, borderRadius: 10, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${form.paid > 0 ? (form.used / form.paid) * 100 : 0}%`, borderRadius: 10, background: remaining <= 2 ? "#ef4444" : remaining <= 4 ? "#f59e0b" : "linear-gradient(90deg,#4f46e5,#7c3aed)", transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.entries(STATUS_CFG).map(([val, cfg]) => (
                <button key={val} type="button" onClick={() => set("status", val)}
                  style={{ flex: 1, padding: "0.42rem 0", borderRadius: 8, border: `1px solid ${form.status === val ? cfg.color + "88" : "rgba(255,255,255,0.14)"}`, background: form.status === val ? cfg.bg : "rgba(255,255,255,0.04)", color: form.status === val ? cfg.color : "#94a3b8", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.13s" }}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose}
              style={{ padding: "0.68rem 1rem", borderRadius: 11, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontWeight: 500, fontSize: "0.85rem", fontFamily: "inherit", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit"
              style={{ flex: 1, padding: "0.68rem", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontWeight: 800, fontSize: "0.88rem", fontFamily: "inherit", cursor: "pointer" }}>
              {student ? "Save Changes" : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DELETE CONFIRM MODAL
═══════════════════════════════════════════════════════════════════ */
function DeleteModal({ student, onClose, onConfirm }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,8,20,0.78)", backdropFilter: "blur(12px)" }} onClick={onClose} />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 400,
        background: "rgba(255,255,255,0.052)", border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 20, backdropFilter: "blur(40px)",
        boxShadow: "0 32px 96px rgba(0,0,0,0.6)",
        padding: "1.75rem", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0",
        textAlign: "center",
      }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <Trash2 size={22} color="#ef4444" />
        </div>
        <div style={{ fontWeight: 900, fontSize: "1.05rem", marginBottom: 6 }}>Remove Student?</div>
        <div style={{ fontSize: "0.83rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          This will permanently remove <strong style={{ color: "#e2e8f0" }}>{student.name}</strong> and all their lesson records. This action cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "0.65rem", borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontWeight: 500, fontFamily: "inherit", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={() => { onConfirm(student.id); onClose(); }}
            style={{ flex: 1, padding: "0.65rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#dc2626,#ef4444)", color: "#fff", fontWeight: 800, fontFamily: "inherit", cursor: "pointer" }}>
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════════════════════════ */
function DetailPanel({ student, onClose, onEdit, primary }) {
  if (!student) return null;
  const sc  = STATUS_CFG[student.status];
  const rem = student.paid - student.used;
  const pct = student.paid > 0 ? Math.round((student.used / student.paid) * 100) : 0;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.22)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1000, width: "100%", maxWidth: 380,
        background: "var(--zd-surface)", borderLeft: "1px solid var(--zd-border)",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.4rem", borderBottom: "1px solid var(--zd-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--zd-text)" }}>Student Profile</div>
          <button onClick={onClose} style={{ background: "var(--zd-surface-alt)", border: "1px solid var(--zd-border)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "var(--zd-text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.4rem" }}>
          {/* Avatar + name */}
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--zd-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", fontWeight: 900, color: "#fff", margin: "0 auto 0.75rem" }}>
              {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--zd-text)" }}>{student.name}</div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: sc.bg, color: sc.color, marginTop: 5 }}>
              {sc.label}
            </span>
          </div>

          {/* Balance card */}
          <div style={{ background: "var(--zd-gradient)", borderRadius: 13, padding: "1rem 1.1rem", marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Lesson Balance</div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{rem}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>of {student.paid} remaining</div>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "rgba(255,255,255,0.4)" }}>{pct}%</div>
            </div>
            <div style={{ height: 5, borderRadius: 10, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "rgba(255,255,255,0.85)", borderRadius: 10 }} />
            </div>
          </div>

          {/* Info rows */}
          {[
            { label: "Phone",       value: student.phone,      icon: Phone },
            { label: "Email",       value: student.email || "—", icon: User },
            { label: "Class",       value: student.licenseClass, icon: Car },
            { label: "Instructor",  value: student.instructor,  icon: GraduationCap },
            { label: "Joined",      value: student.joined,      icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.6rem 0", borderBottom: "1px solid var(--zd-border)" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `${primary}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={13} color={primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--zd-text)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
              </div>
            </div>
          ))}

          {/* Low balance warning */}
          {rem <= 2 && rem > 0 && (
            <div style={{ marginTop: "1rem", display: "flex", gap: 8, padding: "0.7rem 0.85rem", borderRadius: 10, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <AlertCircle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: "0.78rem", color: "#f59e0b", fontWeight: 600 }}>Low balance — {rem} lesson{rem !== 1 ? "s" : ""} remaining</div>
            </div>
          )}
          {rem === 0 && (
            <div style={{ marginTop: "1rem", display: "flex", gap: 8, padding: "0.7rem 0.85rem", borderRadius: 10, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)" }}>
              <CheckCircle2 size={15} color="#8b5cf6" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: "0.78rem", color: "#8b5cf6", fontWeight: 600 }}>All lessons completed</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.4rem", borderTop: "1px solid var(--zd-border)" }}>
          <button onClick={onEdit}
            style={{ width: "100%", padding: "0.65rem", borderRadius: 10, border: "none", background: "var(--zd-gradient)", color: "#fff", fontWeight: 700, fontSize: "0.87rem", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Edit2 size={15} /> Edit Student
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════ */
function Toast({ msg }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 4000, background: "#22c55e", color: "#fff", padding: "0.75rem 1.25rem", borderRadius: 10, fontSize: "0.84rem", fontWeight: 600, fontFamily: "inherit", boxShadow: "0 8px 28px rgba(34,197,94,0.4)", display: "flex", alignItems: "center", gap: 8 }}>
      <Check size={16} /> {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function StudentsManagement() {
  const { theme } = useAuth();
  const p = theme?.primary || "#4f46e5";

  const [students, setStudents]     = useState(SEED_STUDENTS);
  const [search, setSearch]         = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [instrFilter, setInstrFilter]   = useState("All");
  const [showFilters, setShowFilters]   = useState(false);
  const [modal, setModal]           = useState(null); // { type: "add"|"edit"|"delete", student? }
  const [detailStudent, setDetailStudent] = useState(null);
  const [toast, setToast]           = useState(null);
  const [sortBy, setSortBy]         = useState("name_asc");

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  /* Filter + sort */
  const filtered = useMemo(() => {
    let arr = [...students];
    if (search)         arr = arr.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search) || (s.email && s.email.toLowerCase().includes(search.toLowerCase())));
    if (classFilter  !== "All") arr = arr.filter(s => s.licenseClass === classFilter);
    if (statusFilter !== "All") arr = arr.filter(s => s.status       === statusFilter.toLowerCase());
    if (instrFilter  !== "All") arr = arr.filter(s => s.instructor   === instrFilter);
    arr.sort((a, b) => {
      if (sortBy === "name_asc")   return a.name.localeCompare(b.name);
      if (sortBy === "name_desc")  return b.name.localeCompare(a.name);
      if (sortBy === "balance")    return (a.paid - a.used) - (b.paid - b.used);
      if (sortBy === "joined_desc")return b.joined.localeCompare(a.joined);
      return 0;
    });
    return arr;
  }, [students, search, classFilter, statusFilter, instrFilter, sortBy]);

  /* Actions */
  const saveStudent = (form) => {
    if (modal?.student) {
      setStudents(prev => prev.map(s => s.id === modal.student.id ? { ...form, id: s.id } : s));
      if (detailStudent?.id === modal.student.id) setDetailStudent({ ...form, id: modal.student.id });
      fireToast(`${form.name}'s profile updated`);
    } else {
      const newS = { ...form, id: Date.now(), joined: new Date().toISOString().split("T")[0] };
      setStudents(prev => [newS, ...prev]);
      fireToast(`${form.name} registered successfully`);
    }
    setModal(null);
  };

  const deleteStudent = (id) => {
    const name = students.find(s => s.id === id)?.name;
    setStudents(prev => prev.filter(s => s.id !== id));
    if (detailStudent?.id === id) setDetailStudent(null);
    fireToast(`${name} removed`);
  };

  /* Summary stats */
  const totalStudents  = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const lowBalance     = students.filter(s => (s.paid - s.used) <= 2 && s.status === "active").length;
  const completed      = students.filter(s => s.status === "completed").length;
  const activeFilters  = [classFilter !== "All", statusFilter !== "All", instrFilter !== "All"].filter(Boolean).length;

  return (
    <Layout>
      <style>{`
        .zd-sm-stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
        @media(min-width:680px){ .zd-sm-stats { grid-template-columns: repeat(4,1fr); } }

        .zd-sm-stat { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 13px; padding: 1rem; transition: transform 0.13s; cursor: default; }
        .zd-sm-stat:hover { transform: translateY(-2px); }

        .zd-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 0.85rem; }
        .zd-search-wrap { position: relative; flex: 1; min-width: 220px; }
        .zd-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--zd-text-muted); pointer-events: none; }
        .zd-search-input { width: 100%; background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 10px; color: var(--zd-text); padding: 0.55rem 0.85rem 0.55rem 2.3rem; font-size: 0.83rem; font-family: inherit; box-sizing: border-box; outline: none; }
        .zd-search-input:focus { border-color: var(--zd-primary); }
        .zd-tbtn { display: flex; align-items: center; gap: 6px; padding: 0.52rem 0.95rem; border-radius: 10px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.8rem; font-weight: 600; font-family: inherit; cursor: pointer; white-space: nowrap; transition: all 0.13s; }
        .zd-tbtn:hover { border-color: var(--zd-primary); color: var(--zd-primary); }
        .zd-tbtn.primary { background: var(--zd-gradient); color: #fff; border: none; box-shadow: 0 4px 14px rgba(79,70,229,0.28); }
        .zd-tbtn.primary:hover { filter: brightness(1.07); border: none; color: #fff; }
        .zd-tbtn.filt-active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }

        .zd-filter-drawer { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 13px; padding: 1rem 1.1rem; margin-bottom: 1rem; display: grid; grid-template-columns: repeat(2,1fr); gap: 0.75rem; }
        @media(min-width:800px){ .zd-filter-drawer { grid-template-columns: repeat(4,1fr); } }
        .zd-fgroup label { font-size: 0.68rem; font-weight: 700; color: var(--zd-text-muted); display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.06em; }
        .zd-fsel { width: 100%; background: var(--zd-surface-alt); border: 1px solid var(--zd-border); border-radius: 8px; color: var(--zd-text); padding: 0.45rem 0.65rem; font-size: 0.8rem; font-family: inherit; cursor: pointer; outline: none; }
        .zd-fsel:focus { border-color: var(--zd-primary); }
        .zd-sort-sel { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 10px; color: var(--zd-text); padding: 0.53rem 0.75rem; font-size: 0.8rem; font-family: inherit; cursor: pointer; outline: none; }

        .zd-pill-row { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 1rem; }
        .zd-pill { padding: 0.35rem 0.85rem; border-radius: 20px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.76rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.13s; white-space: nowrap; }
        .zd-pill.active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }
        .zd-pill:hover:not(.active) { border-color: var(--zd-primary); color: var(--zd-primary); }

        /* Table */
        .zd-tbl-wrap { border-radius: 14px; border: 1px solid var(--zd-border); overflow: hidden; overflow-x: auto; }
        .zd-tbl { width: 100%; border-collapse: collapse; min-width: 760px; }
        .zd-tbl thead tr { border-bottom: 1px solid var(--zd-border); }
        .zd-tbl th { background: var(--zd-surface-alt); color: var(--zd-text-muted); font-weight: 700; font-size: 0.68rem; letter-spacing: 0.07em; text-transform: uppercase; padding: 0.72rem 1rem; text-align: left; white-space: nowrap; }
        .zd-tbl td { background: var(--zd-surface); padding: 0.9rem 1rem; border-bottom: 1px solid var(--zd-border); color: var(--zd-text); vertical-align: middle; font-size: 0.83rem; }
        .zd-tbl tbody tr:last-child td { border-bottom: none; }
        .zd-tbl tbody tr { transition: background 0.11s; cursor: pointer; }
        .zd-tbl tbody tr:hover td { background: var(--zd-surface-alt); }

        .zd-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.67rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
        .zd-cls-badge { display: inline-block; font-size: 0.67rem; font-weight: 700; padding: 3px 9px; border-radius: 7px; white-space: nowrap; }

        .zd-avatar-sm { width: 34px; height: 34px; border-radius: 50%; background: var(--zd-gradient); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.65rem; color: #fff; flex-shrink: 0; }

        .zd-act-btn { padding: 0.3rem 0.7rem; border-radius: 7px; border: none; font-size: 0.73rem; font-weight: 700; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: filter 0.12s; white-space: nowrap; }
        .zd-act-btn:hover { filter: brightness(1.12); }

        .zd-empty { text-align: center; padding: 3rem 1rem; color: var(--zd-text-muted); background: var(--zd-surface); }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <GraduationCap size={22} color={p} /> Student Directory
          </h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            Manage enrollments, balances and lesson tracking.
            {lowBalance > 0 && <strong style={{ color: "#f59e0b", marginLeft: 6 }}>{lowBalance} student{lowBalance !== 1 ? "s" : ""} with low balance.</strong>}
          </p>
        </div>
        <button className="zd-tbtn primary" onClick={() => setModal({ type: "add" })}>
          <Plus size={17} /> Add Student
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="zd-sm-stats">
        {[
          { label: "Total Students",  value: totalStudents,  color: p,         icon: GraduationCap, bg: `${p}18`                  },
          { label: "Active",          value: activeStudents, color: "#22c55e", icon: TrendingUp,    bg: "rgba(34,197,94,0.12)"    },
          { label: "Low Balance ⚠",  value: lowBalance,     color: "#f59e0b", icon: AlertCircle,   bg: "rgba(245,158,11,0.12)"   },
          { label: "Completed",       value: completed,      color: "#8b5cf6", icon: CheckCircle2,  bg: "rgba(139,92,246,0.12)"   },
        ].map(({ label, value, color, icon: Icon, bg }) => (
          <div key={label} className="zd-sm-stat">
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
        {["All","Active","Inactive","Completed"].map(s => (
          <button key={s} className={`zd-pill${statusFilter === s ? " active" : ""}`} onClick={() => setStatusFilter(s)}>
            {s}
            {s === "Active" && activeStudents > 0 && (
              <span style={{ marginLeft: 5, background: statusFilter === "Active" ? "rgba(255,255,255,0.25)" : "rgba(34,197,94,0.2)", color: statusFilter === "Active" ? "#fff" : "#22c55e", borderRadius: 20, padding: "0 5px", fontSize: "0.66rem", fontWeight: 800 }}>{activeStudents}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="zd-toolbar">
        <div className="zd-search-wrap">
          <span className="zd-search-icon"><Search size={14} /></span>
          <input className="zd-search-input" placeholder="Search name, phone or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`zd-tbtn${showFilters ? " filt-active" : ""}`} onClick={() => setShowFilters(v => !v)}>
          <Filter size={14} /> Filters
          {activeFilters > 0 && (
            <span style={{ background: showFilters ? "rgba(255,255,255,0.3)" : "var(--zd-primary)", color: "#fff", borderRadius: 20, padding: "0 5px", fontSize: "0.66rem", fontWeight: 800 }}>{activeFilters}</span>
          )}
        </button>
        <select className="zd-sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name_asc">A → Z</option>
          <option value="name_desc">Z → A</option>
          <option value="balance">Lowest balance first</option>
          <option value="joined_desc">Newest joined</option>
        </select>
        <span style={{ fontSize: "0.78rem", color: "var(--zd-text-muted)", whiteSpace: "nowrap" }}>
          {filtered.length} of {students.length}
        </span>
      </div>

      {/* ── Filter drawer ── */}
      {showFilters && (
        <div className="zd-filter-drawer">
          <div className="zd-fgroup">
            <label>License Class</label>
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
            <label>Balance Alert</label>
            <select className="zd-fsel" onChange={e => {/* handled in filter logic */ }} disabled style={{ opacity: 0.5 }}>
              <option>All students</option>
            </select>
          </div>
          <div className="zd-fgroup" style={{ display: "flex", alignItems: "flex-end" }}>
            <button onClick={() => { setClassFilter("All"); setStatusFilter("All"); setInstrFilter("All"); setSearch(""); }}
              style={{ padding: "0.45rem 0.85rem", borderRadius: 8, border: "1px solid var(--zd-border)", background: "transparent", color: "var(--zd-text-muted)", fontSize: "0.78rem", fontFamily: "inherit", cursor: "pointer", width: "100%" }}>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="zd-tbl-wrap">
        {filtered.length === 0 ? (
          <div className="zd-empty">
            <GraduationCap size={36} color="var(--zd-border)" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 600, color: "var(--zd-text)", marginBottom: 4 }}>No students found</div>
            <div style={{ fontSize: "0.82rem" }}>Try adjusting your search or filters.</div>
          </div>
        ) : (
          <table className="zd-tbl">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Instructor</th>
                <th>Balance</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const sc  = STATUS_CFG[s.status];
                const rem = s.paid - s.used;
                const balColor = rem <= 2 ? "#ef4444" : rem <= 4 ? "#f59e0b" : "var(--zd-text)";
                const initials = s.name.split(" ").map(n => n[0]).join("").slice(0, 2);
                return (
                  <tr key={s.id} onClick={() => setDetailStudent(s)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="zd-avatar-sm" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--zd-text)" }}>{s.name}</div>
                          <div style={{ fontSize: "0.73rem", color: "var(--zd-text-muted)", marginTop: 1 }}>{s.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="zd-cls-badge" style={{ background: `${p}14`, color: p }}>{s.licenseClass}</span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--zd-text-muted)" }}>{s.instructor.split(" ")[0]} {s.instructor.split(" ")[1]?.[0]}.</td>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: "0.95rem", color: balColor }}>{rem}</span>
                      <span style={{ color: "var(--zd-text-muted)", fontSize: "0.73rem" }}> / {s.paid}</span>
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <LessonBar paid={s.paid} used={s.used} primary={p} />
                    </td>
                    <td>
                      <span className="zd-badge" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </td>
                    <td style={{ color: "var(--zd-text-muted)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>{s.joined}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button className="zd-act-btn"
                          style={{ background: `${p}14`, color: p }}
                          onClick={() => setModal({ type: "edit", student: s })}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="zd-act-btn"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                          onClick={() => setModal({ type: "delete", student: s })}>
                          <Trash2 size={12} />
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

      {/* ── Modals ── */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <StudentModal
          student={modal.student || null}
          onClose={() => setModal(null)}
          onSave={saveStudent}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteModal
          student={modal.student}
          onClose={() => setModal(null)}
          onConfirm={deleteStudent}
        />
      )}

      {/* ── Detail panel ── */}
      {detailStudent && (
        <DetailPanel
          student={detailStudent}
          primary={p}
          onClose={() => setDetailStudent(null)}
          onEdit={() => { setModal({ type: "edit", student: detailStudent }); setDetailStudent(null); }}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast} />}
    </Layout>
  );
}