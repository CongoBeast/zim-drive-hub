import { useState, useMemo } from "react";
import {
  RefreshCw, UmbrellaOff, Coffee, XCircle, CheckCircle, Clock,
  AlertTriangle, Search, Filter, ChevronDown, ChevronUp, Eye,
  User, CalendarDays, MessageSquare, MoreHorizontal, X,
  TrendingUp, Inbox, Zap, Check, ClipboardList,
} from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════ */
const SEED_REQUESTS = [
  { id: 1,  instructor: "Blessing Chikwanda", avatar: "BC", type: "reschedule", priority: "urgent",  status: "pending",  submitted: "2026-02-19", affectedDate: "2026-02-22", student: "Rudo Kambarami",   detail: "Move lesson from 22 Feb 10:00 to 24 Feb 14:00", reason: "Medical appointment conflict that cannot be rescheduled.", adminNote: "" },
  { id: 2,  instructor: "Grace Mutasa",       avatar: "GM", type: "leave",      priority: "normal",  status: "pending",  submitted: "2026-02-19", affectedDate: "2026-02-28", student: "—",                detail: "Full day leave on 28 Feb 2026",                reason: "Family event outside Harare. Will return 1 March.", adminNote: "" },
  { id: 3,  instructor: "John Sithole",       avatar: "JS", type: "offday",     priority: "normal",  status: "pending",  submitted: "2026-02-18", affectedDate: "2026-03-07", student: "—",                detail: "Off day request for 7 March 2026",             reason: "Annual rest day entitlement.", adminNote: "" },
  { id: 4,  instructor: "Blessing Chikwanda", avatar: "BC", type: "reschedule", priority: "normal",  status: "approved", submitted: "2026-02-16", affectedDate: "2026-02-20", student: "Nyasha Dube",      detail: "Move lesson from 20 Feb 13:00 to 22 Feb 13:00", reason: "Vehicle maintenance scheduled.", adminNote: "Approved. New time confirmed with student." },
  { id: 5,  instructor: "Grace Mutasa",       avatar: "GM", type: "swap",       priority: "urgent",  status: "rejected", submitted: "2026-02-17", affectedDate: "2026-02-25", student: "Simba Choto",      detail: "Swap with another instructor on 25 Feb",       reason: "Cannot attend, family emergency.", adminNote: "Rejected. No available instructor for that slot." },
  { id: 6,  instructor: "John Sithole",       avatar: "JS", type: "cancel",     priority: "normal",  status: "approved", submitted: "2026-02-15", affectedDate: "2026-02-22", student: "Rutendo Mhuri",    detail: "Cancel lesson on 22 Feb 13:00",                reason: "Student requested cancellation. Lesson credit to be returned.", adminNote: "Approved. Credit returned to student balance." },
  { id: 7,  instructor: "Blessing Chikwanda", avatar: "BC", type: "leave",      priority: "normal",  status: "approved", submitted: "2026-02-10", affectedDate: "2026-02-14", student: "—",                detail: "Full day leave on 14 Feb 2026",                reason: "Public holiday make-up leave.",               adminNote: "Approved. Students notified." },
  { id: 8,  instructor: "Grace Mutasa",       avatar: "GM", type: "reschedule", priority: "normal",  status: "pending",  submitted: "2026-02-20", affectedDate: "2026-02-26", student: "Tendai Makoni",    detail: "Move lesson from 26 Feb 09:00 to 27 Feb 09:00", reason: "Test centre booking conflict on that day.",  adminNote: "" },
  { id: 9,  instructor: "John Sithole",       avatar: "JS", type: "offday",     priority: "urgent",  status: "pending",  submitted: "2026-02-20", affectedDate: "2026-02-24", student: "—",                detail: "Emergency off day for 24 Feb",                reason: "Urgent personal matter — cannot attend.", adminNote: "" },
  { id: 10, instructor: "Grace Mutasa",       avatar: "GM", type: "cancel",     priority: "normal",  status: "rejected", submitted: "2026-02-12", affectedDate: "2026-02-18", student: "Chipo Mutendi",    detail: "Cancel lesson on 18 Feb 10:00",                reason: "Instructor unavailable due to illness.", adminNote: "Rejected. Please provide medical certificate first." },
];

/* ═══════════════════════════════════════════════════════════════════
   CONFIG MAPS
═══════════════════════════════════════════════════════════════════ */
const TYPE_CFG = {
  reschedule: { icon: RefreshCw,   color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  label: "Reschedule",    gradient: "linear-gradient(135deg,#2563eb,#3b82f6)" },
  leave:      { icon: UmbrellaOff, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", label: "Leave Day",     gradient: "linear-gradient(135deg,#7c3aed,#8b5cf6)" },
  offday:     { icon: Coffee,      color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Off Day",       gradient: "linear-gradient(135deg,#d97706,#f59e0b)" },
  swap:       { icon: RefreshCw,   color: "#06b6d4", bg: "rgba(6,182,212,0.12)",  label: "Instructor Swap",gradient: "linear-gradient(135deg,#0891b2,#06b6d4)" },
  cancel:     { icon: XCircle,     color: "#ef4444", bg: "rgba(239,68,68,0.12)",  label: "Cancel Lesson", gradient: "linear-gradient(135deg,#dc2626,#ef4444)" },
};

const STATUS_CFG = {
  pending:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  icon: Clock         },
  approved: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.12)",   icon: CheckCircle   },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.12)",   icon: XCircle       },
};

const PRIORITY_CFG = {
  urgent: { label: "Urgent", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  normal: { label: "Normal", color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

/* ═══════════════════════════════════════════════════════════════════
   ACTION MODAL
═══════════════════════════════════════════════════════════════════ */
function ActionModal({ request, mode, onClose, onConfirm }) {
  const [note, setNote] = useState(request.adminNote || "");
  const isApprove = mode === "approve";
  const tc = TYPE_CFG[request.type];

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 10, color: "#e2e8f0", padding: "0.6rem 0.8rem", fontSize: "0.83rem",
    fontFamily: "inherit", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6,
    outline: "none",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(5,8,20,0.78)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      />
      {/* Glass card */}
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 480,
        background: "rgba(255,255,255,0.052)",
        border: "1px solid rgba(255,255,255,0.13)",
        borderRadius: 22,
        backdropFilter: "blur(40px)",
        boxShadow: "0 32px 96px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
        padding: "1.85rem",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e2e8f0",
      }}>
        {/* Icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.4rem" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: isApprove ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {isApprove
              ? <CheckCircle size={22} color="#22c55e" />
              : <XCircle    size={22} color="#ef4444" />
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              {isApprove ? "Approve Request" : "Reject Request"}
            </div>
            <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: 2 }}>
              {request.instructor} · {tc?.label}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 9, width: 32, height: 32, cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} />
          </button>
        </div>

        {/* Summary box */}
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0.9rem 1rem", marginBottom: "1.25rem" }}>
          {[
            { label: "Instructor", value: request.instructor },
            { label: "Type",       value: tc?.label },
            { label: "Affected",   value: request.affectedDate },
            { label: "Detail",     value: request.detail },
            { label: "Reason",     value: request.reason },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: 12, padding: "0.3rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", width: 72, flexShrink: 0, paddingTop: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
              <span style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Admin note */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Admin Response Note {!isApprove && <span style={{ color: "#ef4444" }}>*</span>}
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={isApprove ? "Optional: add a note for the instructor…" : "Explain the reason for rejection…"}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { if (!isApprove && !note.trim()) return; onConfirm(note); onClose(); }}
            disabled={!isApprove && !note.trim()}
            style={{
              flex: 1, padding: "0.7rem", borderRadius: 11, border: "none",
              background: isApprove
                ? "linear-gradient(135deg,#16a34a,#22c55e)"
                : "linear-gradient(135deg,#dc2626,#ef4444)",
              color: "#fff", fontWeight: 800, fontSize: "0.88rem",
              fontFamily: "inherit", cursor: "pointer", letterSpacing: "-0.01em",
              opacity: (!isApprove && !note.trim()) ? 0.45 : 1,
            }}
          >
            {isApprove ? "✓ Confirm Approval" : "✕ Confirm Rejection"}
          </button>
          <button onClick={onClose} style={{ padding: "0.7rem 1rem", borderRadius: 11, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontWeight: 500, fontSize: "0.85rem", fontFamily: "inherit", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DETAIL PANEL (slide-in right side)
═══════════════════════════════════════════════════════════════════ */
function DetailPanel({ request, onClose, onApprove, onReject }) {
  if (!request) return null;
  const tc = TYPE_CFG[request.type];
  const sc = STATUS_CFG[request.status];
  const pc = PRIORITY_CFG[request.priority];
  const StatusIcon = sc.icon;

  return (
    <>
      {/* Overlay on small screens */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.25)", display: "block" }}
      />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1000,
        width: "100%", maxWidth: 420,
        background: "var(--zd-surface)",
        borderLeft: "1px solid var(--zd-border)",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.4rem", borderBottom: "1px solid var(--zd-border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: tc?.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {tc && <tc.icon size={19} color={tc.color} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--zd-text)" }}>{tc?.label}</div>
              <div style={{ fontSize: "0.74rem", color: "var(--zd-text-muted)", marginTop: 1 }}>Request #{request.id}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "var(--zd-surface-alt)", border: "1px solid var(--zd-border)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "var(--zd-text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "1.25rem 1.4rem", overflowY: "auto" }}>

          {/* Status + priority */}
          <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: sc.bg, color: sc.color }}>
              <StatusIcon size={12} /> {sc.label}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: pc.bg, color: pc.color }}>
              {request.priority === "urgent" && <Zap size={11} />} {pc.label}
            </span>
          </div>

          {/* Instructor */}
          <div style={{ background: "var(--zd-surface-alt)", border: "1px solid var(--zd-border)", borderRadius: 12, padding: "0.85rem 1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--zd-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", color: "#fff", flexShrink: 0 }}>
              {request.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--zd-text)", fontSize: "0.88rem" }}>{request.instructor}</div>
              <div style={{ fontSize: "0.73rem", color: "var(--zd-text-muted)" }}>Instructor</div>
            </div>
          </div>

          {/* Detail rows */}
          {[
            { label: "Request Type",   value: tc?.label },
            { label: "Submitted",      value: request.submitted },
            { label: "Affected Date",  value: request.affectedDate },
            { label: "Student",        value: request.student },
            { label: "Detail",         value: request.detail },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: "0.85rem" }}>
              <span style={{ fontSize: "0.69rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
              <span style={{ fontSize: "0.84rem", color: "var(--zd-text)", lineHeight: 1.5 }}>{value}</span>
            </div>
          ))}

          {/* Reason */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.69rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Instructor's Reason</div>
            <div style={{ background: "var(--zd-surface-alt)", border: "1px solid var(--zd-border)", borderRadius: 10, padding: "0.75rem 0.9rem", fontSize: "0.83rem", color: "var(--zd-text)", lineHeight: 1.6, fontStyle: "italic" }}>
              "{request.reason}"
            </div>
          </div>

          {/* Admin note (if exists) */}
          {request.adminNote && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.69rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Admin Response</div>
              <div style={{ background: request.status === "approved" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${request.status === "approved" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`, borderRadius: 10, padding: "0.75rem 0.9rem", fontSize: "0.83rem", color: "var(--zd-text)", lineHeight: 1.6 }}>
                {request.adminNote}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {request.status === "pending" && (
          <div style={{ padding: "1rem 1.4rem", borderTop: "1px solid var(--zd-border)", display: "flex", gap: 8 }}>
            <button onClick={onApprove}
              style={{ flex: 1, padding: "0.65rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Check size={15} /> Approve
            </button>
            <button onClick={onReject}
              style={{ flex: 1, padding: "0.65rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#dc2626,#ef4444)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <X size={15} /> Reject
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════ */
function Toast({ msg, type }) {
  const bg = type === "approved" ? "#22c55e" : type === "rejected" ? "#ef4444" : "#4f46e5";
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 4000, background: bg, color: "#fff", padding: "0.75rem 1.25rem", borderRadius: 10, fontSize: "0.84rem", fontWeight: 600, fontFamily: "inherit", boxShadow: `0 8px 28px ${bg}55`, display: "flex", alignItems: "center", gap: 8, animation: "none" }}>
      <CheckCircle size={16} /> {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function ApprovalsManagement() {
  const { theme } = useAuth();
  const p = theme?.primary || "#4f46e5";

  const [requests, setRequests]       = useState(SEED_REQUESTS);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter]   = useState("All");
  const [instrFilter, setInstrFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy]           = useState("submitted_desc");
  const [detailReq, setDetailReq]     = useState(null);
  const [actionModal, setActionModal] = useState(null); // { request, mode }
  const [toast, setToast]             = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkSelected, setBulkSelected] = useState(new Set());

  /* Derived lists */
  const instructors = ["All", ...new Set(SEED_REQUESTS.map(r => r.instructor))];

  const filtered = useMemo(() => {
    let arr = [...requests];
    if (search)       arr = arr.filter(r => r.instructor.toLowerCase().includes(search.toLowerCase()) || r.detail.toLowerCase().includes(search.toLowerCase()) || (r.student && r.student.toLowerCase().includes(search.toLowerCase())));
    if (statusFilter   !== "All") arr = arr.filter(r => r.status   === statusFilter.toLowerCase());
    if (typeFilter     !== "All") arr = arr.filter(r => r.type     === typeFilter);
    if (instrFilter    !== "All") arr = arr.filter(r => r.instructor === instrFilter);
    if (priorityFilter !== "All") arr = arr.filter(r => r.priority  === priorityFilter.toLowerCase());
    // sort
    arr.sort((a, b) => {
      if (sortBy === "submitted_desc") return b.submitted.localeCompare(a.submitted);
      if (sortBy === "submitted_asc")  return a.submitted.localeCompare(b.submitted);
      if (sortBy === "instructor")     return a.instructor.localeCompare(b.instructor);
      if (sortBy === "priority")       return a.priority === "urgent" ? -1 : 1;
      return 0;
    });
    return arr;
  }, [requests, search, statusFilter, typeFilter, instrFilter, priorityFilter, sortBy]);

  /* Stats */
  const pendingCount  = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;
  const urgentCount   = requests.filter(r => r.status === "pending" && r.priority === "urgent").length;

  /* Actions */
  const fireToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };

  const applyDecision = (id, status, note) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, adminNote: note } : r));
    if (detailReq?.id === id) setDetailReq(prev => ({ ...prev, status, adminNote: note }));
    fireToast(`Request ${status === "approved" ? "approved" : "rejected"} successfully`, status);
  };

  const bulkApprove = () => {
    setRequests(prev => prev.map(r => bulkSelected.has(r.id) && r.status === "pending" ? { ...r, status: "approved", adminNote: "Bulk approved by admin." } : r));
    fireToast(`${bulkSelected.size} request(s) approved`, "approved");
    setBulkSelected(new Set());
  };

  const toggleBulk = (id) => {
    setBulkSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activeFiltersCount = [
    statusFilter !== "All", typeFilter !== "All", instrFilter !== "All", priorityFilter !== "All"
  ].filter(Boolean).length;

  /* ── Render ── */
  return (
    <Layout>
      <style>{`
        .zd-apr-stats { display: grid; grid-template-columns: repeat(2,1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
        @media(min-width:700px){ .zd-apr-stats { grid-template-columns: repeat(4,1fr); } }

        .zd-apr-stat { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 13px; padding: 1rem; display: flex; flex-direction: column; gap: 4px; transition: transform 0.13s; cursor: default; }
        .zd-apr-stat:hover { transform: translateY(-2px); }

        .zd-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }
        .zd-search-wrap { position: relative; flex: 1; min-width: 220px; }
        .zd-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--zd-text-muted); pointer-events: none; }
        .zd-search-input { width: 100%; background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 10px; color: var(--zd-text); padding: 0.55rem 0.85rem 0.55rem 2.3rem; font-size: 0.83rem; font-family: inherit; box-sizing: border-box; }
        .zd-search-input:focus { outline: none; border-color: var(--zd-primary); }
        .zd-toolbar-btn { display: flex; align-items: center; gap: 6px; padding: 0.52rem 0.95rem; border-radius: 10px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.8rem; font-weight: 600; font-family: inherit; cursor: pointer; white-space: nowrap; transition: all 0.13s; }
        .zd-toolbar-btn:hover { border-color: var(--zd-primary); color: var(--zd-primary); }
        .zd-toolbar-btn.active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }

        .zd-filter-drawer { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 13px; padding: 1rem 1.1rem; margin-bottom: 1rem; display: grid; grid-template-columns: repeat(2,1fr); gap: 0.75rem; }
        @media(min-width:800px){ .zd-filter-drawer { grid-template-columns: repeat(4,1fr); } }
        .zd-fgroup label { font-size: 0.68rem; font-weight: 700; color: var(--zd-text-muted); display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.06em; }
        .zd-fselect { width: 100%; background: var(--zd-surface-alt); border: 1px solid var(--zd-border); border-radius: 8px; color: var(--zd-text); padding: 0.45rem 0.65rem; font-size: 0.8rem; font-family: inherit; cursor: pointer; }
        .zd-fselect:focus { outline: none; border-color: var(--zd-primary); }

        .zd-bulk-bar { display: flex; align-items: center; gap: 10px; padding: 0.65rem 1rem; background: var(--zd-gradient); border-radius: 10px; margin-bottom: 0.85rem; color: #fff; font-size: 0.82rem; font-weight: 600; }
        .zd-bulk-btn { padding: 0.35rem 0.85rem; border-radius: 7px; border: 1px solid rgba(255,255,255,0.35); background: rgba(255,255,255,0.12); color: #fff; font-size: 0.75rem; font-weight: 700; font-family: inherit; cursor: pointer; }
        .zd-bulk-btn:hover { background: rgba(255,255,255,0.22); }

        /* Table */
        .zd-tbl-wrap { border-radius: 14px; border: 1px solid var(--zd-border); overflow: hidden; overflow-x: auto; }
        .zd-tbl { width: 100%; border-collapse: collapse; min-width: 780px; }
        .zd-tbl thead tr { border-bottom: 1px solid var(--zd-border); }
        .zd-tbl th { background: var(--zd-surface-alt); color: var(--zd-text-muted); font-weight: 700; font-size: 0.68rem; letter-spacing: 0.07em; text-transform: uppercase; padding: 0.7rem 1rem; text-align: left; white-space: nowrap; }
        .zd-tbl th.center { text-align: center; }
        .zd-tbl td { background: var(--zd-surface); padding: 0.85rem 1rem; border-bottom: 1px solid var(--zd-border); color: var(--zd-text); vertical-align: middle; font-size: 0.83rem; }
        .zd-tbl tbody tr:last-child td { border-bottom: none; }
        .zd-tbl tbody tr:hover td { background: var(--zd-surface-alt); cursor: pointer; }
        .zd-tbl tbody tr.selected td { background: rgba(79,70,229,0.06); }

        .zd-badge  { display: inline-flex; align-items: center; gap: 4px; font-size: 0.67rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
        .zd-tbadge { display: inline-block; font-size: 0.67rem; font-weight: 700; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }

        .zd-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--zd-gradient); display: flex; align-items: center; justifyContent: center; font-weight: 800; font-size: 0.68rem; color: #fff; flex-shrink: 0; }

        .zd-act-row { display: flex; gap: 5px; align-items: center; }
        .zd-act-btn { padding: 0.3rem 0.7rem; border-radius: 7px; border: none; font-size: 0.72rem; font-weight: 700; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: filter 0.12s; white-space: nowrap; }
        .zd-act-btn.approve { background: rgba(34,197,94,0.15);  color: #22c55e; }
        .zd-act-btn.reject  { background: rgba(239,68,68,0.12); color: #ef4444; }
        .zd-act-btn.view    { background: var(--zd-surface-alt); color: var(--zd-text-muted); border: 1px solid var(--zd-border); }
        .zd-act-btn:hover { filter: brightness(1.12); }

        .zd-empty { text-align: center; padding: 3rem 1rem; color: var(--zd-text-muted); background: var(--zd-surface); }
        .zd-sort-select { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 9px; color: var(--zd-text); padding: 0.52rem 0.75rem; font-size: 0.8rem; font-family: inherit; cursor: pointer; }
        .zd-sort-select:focus { outline: none; border-color: var(--zd-primary); }

        .zd-pill-tabs { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 1rem; }
        .zd-ptab { padding: 0.38rem 0.9rem; border-radius: 20px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.78rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.13s; white-space: nowrap; }
        .zd-ptab.active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }
        .zd-ptab:hover:not(.active) { border-color: var(--zd-primary); color: var(--zd-primary); }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <ClipboardList size={22} color={p} /> Approvals Management
          </h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            Review, approve or reject instructor change requests. {pendingCount > 0 && <strong style={{ color: "#f59e0b" }}>{pendingCount} pending.</strong>}
          </p>
        </div>
        {urgentCount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "0.5rem 1rem", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", fontSize: "0.8rem", fontWeight: 700, color: "#ef4444" }}>
            <Zap size={14} /> {urgentCount} urgent request{urgentCount !== 1 ? "s" : ""} need attention
          </div>
        )}
      </div>

      {/* ── Stat cards ── */}
      <div className="zd-apr-stats">
        {[
          { label: "Pending",  value: pendingCount,        color: "#f59e0b", icon: Clock,        bg: "rgba(245,158,11,0.12)" },
          { label: "Approved", value: approvedCount,       color: "#22c55e", icon: CheckCircle,  bg: "rgba(34,197,94,0.12)"  },
          { label: "Rejected", value: rejectedCount,       color: "#ef4444", icon: XCircle,      bg: "rgba(239,68,68,0.12)"  },
          { label: "Total",    value: requests.length,     color: p,         icon: Inbox,        bg: `${p}18`                },
        ].map(({ label, value, color, icon: Icon, bg }) => (
          <div key={label} className="zd-apr-stat"
            onClick={() => label !== "Total" && setStatusFilter(statusFilter === label ? "All" : label)}
            style={{ cursor: label !== "Total" ? "pointer" : "default" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
              <Icon size={17} color={color} />
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--zd-text)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: "0.74rem", color: "var(--zd-text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick status pills ── */}
      <div className="zd-pill-tabs">
        {["All","Pending","Approved","Rejected"].map(s => (
          <button key={s} className={`zd-ptab${statusFilter === s ? " active" : ""}`} onClick={() => setStatusFilter(s)}>
            {s}
            {s === "Pending" && pendingCount > 0 && (
              <span style={{ marginLeft: 5, background: statusFilter === "Pending" ? "rgba(255,255,255,0.25)" : "rgba(245,158,11,0.2)", color: statusFilter === "Pending" ? "#fff" : "#f59e0b", borderRadius: 20, padding: "0 5px", fontSize: "0.68rem", fontWeight: 800 }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="zd-toolbar">
        <div className="zd-search-wrap">
          <span className="zd-search-icon"><Search size={14} /></span>
          <input
            className="zd-search-input"
            placeholder="Search instructor, student or detail…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className={`zd-toolbar-btn${showFilters ? " active" : ""}`} onClick={() => setShowFilters(v => !v)}>
          <Filter size={14} />
          Filters
          {activeFiltersCount > 0 && (
            <span style={{ background: showFilters ? "rgba(255,255,255,0.3)" : "var(--zd-primary)", color: "#fff", borderRadius: 20, padding: "0 5px", fontSize: "0.68rem", fontWeight: 800 }}>{activeFiltersCount}</span>
          )}
        </button>
        <select className="zd-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="submitted_desc">Newest first</option>
          <option value="submitted_asc">Oldest first</option>
          <option value="priority">Urgent first</option>
          <option value="instructor">By instructor</option>
        </select>
        <span style={{ fontSize: "0.78rem", color: "var(--zd-text-muted)", whiteSpace: "nowrap" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Filter drawer ── */}
      {showFilters && (
        <div className="zd-filter-drawer">
          <div className="zd-fgroup">
            <label>Type</label>
            <select className="zd-fselect" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option>All</option>
              {Object.entries(TYPE_CFG).map(([val, cfg]) => <option key={val} value={val}>{cfg.label}</option>)}
            </select>
          </div>
          <div className="zd-fgroup">
            <label>Instructor</label>
            <select className="zd-fselect" value={instrFilter} onChange={e => setInstrFilter(e.target.value)}>
              {instructors.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div className="zd-fgroup">
            <label>Priority</label>
            <select className="zd-fselect" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option>All</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <div className="zd-fgroup" style={{ display: "flex", alignItems: "flex-end" }}>
            <button onClick={() => { setTypeFilter("All"); setInstrFilter("All"); setPriorityFilter("All"); setSearch(""); setStatusFilter("All"); }}
              style={{ padding: "0.45rem 0.85rem", borderRadius: 8, border: "1px solid var(--zd-border)", background: "transparent", color: "var(--zd-text-muted)", fontSize: "0.78rem", fontFamily: "inherit", cursor: "pointer", width: "100%" }}>
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* ── Bulk action bar ── */}
      {bulkSelected.size > 0 && (
        <div className="zd-bulk-bar">
          <CheckCircle size={16} />
          <span>{bulkSelected.size} request{bulkSelected.size !== 1 ? "s" : ""} selected</span>
          <button className="zd-bulk-btn" onClick={bulkApprove}>Bulk Approve</button>
          <button className="zd-bulk-btn" style={{ background: "rgba(239,68,68,0.25)", borderColor: "rgba(239,68,68,0.5)" }} onClick={() => setBulkSelected(new Set())}>Clear</button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="zd-tbl-wrap">
        {filtered.length === 0 ? (
          <div className="zd-empty">
            <Inbox size={36} color="var(--zd-border)" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 600, color: "var(--zd-text)", marginBottom: 4 }}>No requests match your filters</div>
            <div style={{ fontSize: "0.82rem" }}>Try adjusting the search or filter settings above.</div>
          </div>
        ) : (
          <table className="zd-tbl">
            <thead>
              <tr>
                <th style={{ width: 40, paddingLeft: "0.75rem" }}>
                  <input type="checkbox"
                    style={{ cursor: "pointer", accentColor: "var(--zd-primary)" }}
                    checked={bulkSelected.size === filtered.filter(r => r.status === "pending").length && filtered.some(r => r.status === "pending")}
                    onChange={e => {
                      if (e.target.checked) setBulkSelected(new Set(filtered.filter(r => r.status === "pending").map(r => r.id)));
                      else setBulkSelected(new Set());
                    }}
                  />
                </th>
                <th>#</th>
                <th>Instructor</th>
                <th>Type</th>
                <th>Affected Date</th>
                <th>Student</th>
                <th>Priority</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => {
                const tc = TYPE_CFG[req.type]    || TYPE_CFG.reschedule;
                const sc = STATUS_CFG[req.status] || STATUS_CFG.pending;
                const pc = PRIORITY_CFG[req.priority];
                const StatusIcon = sc.icon;
                const isSel = bulkSelected.has(req.id);

                return (
                  <tr key={req.id} className={isSel ? "selected" : ""} onClick={() => setDetailReq(req)}>
                    <td style={{ paddingLeft: "0.75rem" }} onClick={e => e.stopPropagation()}>
                      {req.status === "pending" && (
                        <input type="checkbox" style={{ cursor: "pointer", accentColor: "var(--zd-primary)" }}
                          checked={isSel}
                          onChange={() => toggleBulk(req.id)} />
                      )}
                    </td>
                    <td style={{ color: "var(--zd-text-muted)", fontWeight: 500 }}>#{req.id}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="zd-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{req.avatar}</div>
                        <span style={{ fontWeight: 600 }}>{req.instructor}</span>
                      </div>
                    </td>
                    <td>
                      <span className="zd-tbadge" style={{ background: tc.bg, color: tc.color, display: "flex", alignItems: "center", gap: 5, width: "fit-content" }}>
                        <tc.icon size={11} />
                        {tc.label}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{req.affectedDate}</td>
                    <td style={{ color: req.student === "—" ? "var(--zd-text-muted)" : "var(--zd-text)" }}>{req.student}</td>
                    <td>
                      <span className="zd-badge" style={{ background: pc.bg, color: pc.color }}>
                        {req.priority === "urgent" && <Zap size={10} />}
                        {pc.label}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--zd-text-muted)" }}>{req.submitted}</td>
                    <td>
                      <span className="zd-badge" style={{ background: sc.bg, color: sc.color }}>
                        <StatusIcon size={11} /> {sc.label}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="zd-act-row">
                        {req.status === "pending" && <>
                          <button className="zd-act-btn approve"
                            onClick={() => setActionModal({ request: req, mode: "approve" })}>
                            <Check size={11} /> Approve
                          </button>
                          <button className="zd-act-btn reject"
                            onClick={() => setActionModal({ request: req, mode: "reject" })}>
                            <X size={11} /> Reject
                          </button>
                        </>}
                        <button className="zd-act-btn view" onClick={() => setDetailReq(req)}>
                          <Eye size={11} /> View
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

      {/* ── Detail panel ── */}
      {detailReq && (
        <DetailPanel
          request={detailReq}
          onClose={() => setDetailReq(null)}
          onApprove={() => setActionModal({ request: detailReq, mode: "approve" })}
          onReject={()  => setActionModal({ request: detailReq, mode: "reject" })}
        />
      )}

      {/* ── Action modal ── */}
      {actionModal && (
        <ActionModal
          request={actionModal.request}
          mode={actionModal.mode}
          onClose={() => setActionModal(null)}
          onConfirm={(note) => applyDecision(actionModal.request.id, actionModal.mode === "approve" ? "approved" : "rejected", note)}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </Layout>
  );
}