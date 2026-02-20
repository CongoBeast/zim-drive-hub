import { useState } from "react";
import { RefreshCw, Plus, Clock, CheckCircle, X, AlertTriangle, Calendar, Umbrella, Coffee, ArrowLeftRight, ChevronDown } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

/* ─── Mock previous requests ─── */
const PREV_REQUESTS = [
  { id: 1, type: "reschedule", typeLabel: "Reschedule Lesson", date: "18 Feb 2026", submitted: "14 Feb 2026",
    detail: "Rescheduling Rudo Kambarami's 10:00 lesson to 20 Feb at 10:00 due to scheduling conflict.",
    status: "approved", adminNote: "Approved. Student has been notified." },
  { id: 2, type: "leave", typeLabel: "Leave Request", date: "25–26 Feb 2026", submitted: "16 Feb 2026",
    detail: "Requesting two days of personal leave on 25 and 26 February 2026.",
    status: "pending", adminNote: null },
  { id: 3, type: "offday", typeLabel: "Off Day", date: "10 Feb 2026", submitted: "07 Feb 2026",
    detail: "Requesting off day on 10 Feb 2026 due to a family event.",
    status: "approved", adminNote: "Granted. Schedule has been cleared for that day." },
  { id: 4, type: "reschedule", typeLabel: "Reschedule Lesson", date: "12 Feb 2026", submitted: "09 Feb 2026",
    detail: "Requesting to move Farai Zimba's 08:00 lesson to 14:00 on same day.",
    status: "declined", adminNote: "Declined — student unavailable in the afternoon. Original time kept." },
  { id: 5, type: "swap", typeLabel: "Lesson Swap", date: "05 Feb 2026", submitted: "02 Feb 2026",
    detail: "Requesting to swap Tendai Makoni's 09:00 slot with Simba Ndlovu's 14:00 slot on 05 Feb.",
    status: "approved", adminNote: "Approved. Both students have been notified of the swap." },
  { id: 6, type: "other", typeLabel: "Other Request", date: "28 Jan 2026", submitted: "25 Jan 2026",
    detail: "Requesting a permanent venue change for all Class 2 lessons from Belvedere to Borrowdale.",
    status: "pending", adminNote: null },
];

const STATUS_CFG = {
  approved: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  icon: CheckCircle  },
  pending:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", icon: Clock        },
  declined: { label: "Declined", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)",   icon: X            },
};

const REQUEST_TYPES = [
  { key: "reschedule", label: "Reschedule Lesson",  icon: ArrowLeftRight, color: "#2563eb",  desc: "Move a specific lesson to a new date or time" },
  { key: "leave",      label: "Leave Request",       icon: Umbrella,       color: "#8b5cf6",  desc: "Request consecutive days of leave" },
  { key: "offday",     label: "Off Day",             icon: Coffee,         color: "#059669",  desc: "Request a single day off" },
  { key: "swap",       label: "Lesson Swap",         icon: RefreshCw,      color: "#f59e0b",  desc: "Swap two lesson slots between students" },
  { key: "other",      label: "Other Request",       icon: Plus,           color: "#ef4444",  desc: "Any other schedule or operational request" },
];

const STUDENTS = ["Farai Zimba","Rudo Kambarami","Nyasha Dube","Tendai Makoni","Chiedza Moyo","Simba Ndlovu","Tatenda Rusere"];

export default function ChangeRequests() {
  const { theme } = useAuth();
  const p = theme?.primary || "#059669";

  const [showModal,   setShowModal]   = useState(false);
  const [reqType,     setReqType]     = useState(null);
  const [form,        setForm]        = useState({ student: "", fromDate: "", fromTime: "", toDate: "", toTime: "", fromDate2: "", toDate2: "", note: "", leaveStart: "", leaveEnd: "", offDate: "" });
  const [submitted,   setSubmitted]   = useState(false);
  const [expandedId,  setExpandedId]  = useState(null);
  const [filterStatus,setFilterStatus]= useState("All");

  const openModal = () => { setShowModal(true); setReqType(null); setSubmitted(false); setForm({ student:"",fromDate:"",fromTime:"",toDate:"",toTime:"",fromDate2:"",toDate2:"",note:"",leaveStart:"",leaveEnd:"",offDate:"" }); };

  const handleSubmit = () => { setSubmitted(true); };

  const filtered = filterStatus === "All" ? PREV_REQUESTS : PREV_REQUESTS.filter(r => r.status === filterStatus.toLowerCase());

  const counts = { approved: PREV_REQUESTS.filter(r=>r.status==="approved").length, pending: PREV_REQUESTS.filter(r=>r.status==="pending").length, declined: PREV_REQUESTS.filter(r=>r.status==="declined").length };

  return (
    <Layout>
      <style>{`
        /* ── Layout ── */
        .zd-cr-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 1050px) { .zd-cr-grid { grid-template-columns: 1fr 300px; } }

        .zd-cr-stat-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.75rem; margin-bottom: 1.25rem; }

        /* ── Table ── */
        .zd-cr-table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid var(--zd-border); }
        .zd-cr-table { width: 100%; border-collapse: collapse; min-width: 580px; }
        .zd-cr-table th { background: var(--zd-surface-alt); color: var(--zd-text-muted); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; padding: 0.65rem 0.9rem; text-align: left; border-bottom: 1px solid var(--zd-border); }
        .zd-cr-table td { padding: 0.8rem 0.9rem; border-bottom: 1px solid var(--zd-border); color: var(--zd-text); background: var(--zd-surface); font-size: 0.83rem; vertical-align: top; }
        .zd-cr-table tr:last-child td { border-bottom: none; }
        .zd-cr-table tr:hover td { background: var(--zd-surface-alt); }
        .zd-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
        .zd-expand-td { background: var(--zd-surface-alt) !important; }
        .zd-expand-box { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 9px; padding: 0.85rem 1rem; }
        .zd-expand-btn { background: none; border: none; cursor: pointer; color: var(--zd-text-muted); padding: 4px; border-radius: 6px; display: flex; align-items: center; transition: color 0.12s; }
        .zd-expand-btn:hover { color: var(--zd-primary); }

        /* ── Filter pills ── */
        .zd-cr-filters { display: flex; gap: 6px; margin-bottom: 1rem; flex-wrap: wrap; }
        .zd-cr-pill { padding: 0.35rem 0.85rem; border-radius: 20px; border: 1px solid var(--zd-border); background: var(--zd-surface); color: var(--zd-text-muted); font-size: 0.76rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.12s; }
        .zd-cr-pill.active { background: var(--zd-primary); color: #fff; border-color: var(--zd-primary); }

        /* ── New request side card ── */
        .zd-new-req-card { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 14px; padding: 1.1rem; position: sticky; top: 1.5rem; }
        .zd-type-option { display: flex; align-items: center; gap: 10px; padding: 0.65rem 0.75rem; border-radius: 9px; border: 1px solid var(--zd-border); background: var(--zd-surface-alt); cursor: pointer; margin-bottom: 6px; transition: all 0.13s; }
        .zd-type-option:last-child { margin-bottom: 0; }
        .zd-type-option:hover { border-color: var(--zd-primary); }
        .zd-type-option.sel { border-color: var(--zd-primary); background: var(--zd-surface); }

        /* ── Glassmorphism modal ── */
        .zd-mo-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .zd-mo {
          background: rgba(30,30,50,0.75);
          backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 22px; padding: 2rem;
          width: 100%; max-width: 520px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
          position: relative; overflow: hidden;
        }
        [data-theme="instructor"] .zd-mo { background: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 24px 60px rgba(0,0,0,0.18); }
        .zd-mo::before {
          content: ""; position: absolute; top: -60px; right: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(5,150,105,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .zd-mo-title { font-size: 1.15rem; font-weight: 900; color: var(--zd-text); margin-bottom: 4px; position: relative; }
        .zd-mo-sub   { font-size: 0.79rem; color: var(--zd-text-muted); margin-bottom: 1.25rem; position: relative; }
        .zd-mo-label { font-size: 0.72rem; font-weight: 700; color: var(--zd-text-muted); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 0.35rem; display: block; }
        .zd-mo-input {
          width: 100%; padding: 0.58rem 0.8rem;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 9px; color: var(--zd-text); font-size: 0.84rem;
          font-family: inherit; outline: none; transition: border-color 0.13s; box-shadow: none;
          position: relative;
        }
        .zd-mo-input:focus { border-color: var(--zd-primary); background: rgba(255,255,255,0.12); }
        [data-theme="instructor"] .zd-mo-input { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.15); color: var(--zd-text); }
        [data-theme="instructor"] .zd-mo-input:focus { border-color: var(--zd-primary); }
        .zd-mo-field  { margin-bottom: 0.85rem; position: relative; }
        .zd-mo-row    { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem; }
        .zd-mo-submit { width: 100%; padding: 0.72rem; border-radius: 11px; border: none; background: var(--zd-gradient); color: #fff; font-size: 0.9rem; font-weight: 800; font-family: inherit; cursor: pointer; transition: filter 0.13s; margin-top: 0.5rem; letter-spacing: -0.01em; box-shadow: 0 4px 20px rgba(5,150,105,0.35); position: relative; }
        .zd-mo-submit:hover { filter: brightness(1.08); }
        .zd-mo-cancel { width: 100%; padding: 0.55rem; border-radius: 11px; border: 1px solid rgba(255,255,255,0.15); background: transparent; color: var(--zd-text-muted); font-size: 0.84rem; font-family: inherit; cursor: pointer; margin-top: 6px; position: relative; transition: background 0.12s; }
        .zd-mo-cancel:hover { background: rgba(255,255,255,0.08); }
        [data-theme="instructor"] .zd-mo-cancel { border-color: var(--zd-border); }
        [data-theme="instructor"] .zd-mo-cancel:hover { background: var(--zd-surface-alt); }

        .zd-type-step { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1rem; }
        .zd-type-tile { padding: 0.75rem; border-radius: 11px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); cursor: pointer; text-align: left; transition: all 0.13s; }
        [data-theme="instructor"] .zd-type-tile { border-color: var(--zd-border); background: var(--zd-surface-alt); }
        .zd-type-tile:hover { border-color: var(--zd-primary); background: rgba(255,255,255,0.1); }
        .zd-type-tile.sel { border-color: var(--zd-primary); background: rgba(5,150,105,0.15); }
        [data-theme="instructor"] .zd-type-tile.sel { background: rgba(5,150,105,0.1); }
        .zd-success-mo { text-align: center; padding: 1.5rem 0; }

        .zd-add-btn { display: flex; align-items: center; gap: 7px; padding: 0.6rem 1.1rem; border-radius: 10px; border: none; background: var(--zd-gradient); color: #fff; font-size: 0.85rem; font-weight: 700; font-family: inherit; cursor: pointer; transition: filter 0.13s; box-shadow: 0 3px 14px rgba(5,150,105,0.3); }
        .zd-add-btn:hover { filter: brightness(1.08); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4 }}>
            Change Requests
          </h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            Submit and track schedule changes, leave and off-day requests.
          </p>
        </div>
        <button className="zd-add-btn" onClick={openModal}>
          <Plus size={16} />
          New Request
        </button>
      </div>

      {/* Status summary */}
      <div className="zd-cr-stat-row">
        {Object.entries(STATUS_CFG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} style={{ background: "var(--zd-surface)", border: "1px solid var(--zd-border)", borderRadius: 12, padding: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.4rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color={cfg.color} />
                </div>
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--zd-text)", letterSpacing: "-0.03em" }}>{counts[key]}</div>
              <div style={{ fontSize: "0.74rem", color: "var(--zd-text-muted)", marginTop: 2 }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter pills */}
      <div className="zd-cr-filters">
        {["All","Approved","Pending","Declined"].map(f => (
          <button key={f} className={`zd-cr-pill${filterStatus===f?" active":""}`} onClick={() => setFilterStatus(f)}>{f}</button>
        ))}
      </div>

      {/* Requests table */}
      <div className="zd-cr-table-wrap">
        <table className="zd-cr-table">
          <thead>
            <tr>
              {["Request Type","Date Requested","For Date","Detail","Status",""].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--zd-text-muted)", background: "var(--zd-surface)" }}>No requests found</td></tr>
            ) : filtered.map(req => {
              const s    = STATUS_CFG[req.status];
              const Sico = s.icon;
              const isEx = expandedId === req.id;
              const typeInfo = REQUEST_TYPES.find(t => t.key === req.type);
              const TypeIcon = typeInfo?.icon || RefreshCw;
              return (
                <>
                  <tr key={req.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${typeInfo?.color || p}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <TypeIcon size={13} color={typeInfo?.color || p} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{req.typeLabel}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--zd-text-muted)" }}>{req.submitted}</td>
                    <td style={{ fontWeight: 600 }}>{req.date}</td>
                    <td style={{ color: "var(--zd-text-muted)", maxWidth: 240 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.detail}</div>
                    </td>
                    <td>
                      <span className="zd-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                        <Sico size={11} />{s.label}
                      </span>
                    </td>
                    <td>
                      <button className="zd-expand-btn" onClick={() => setExpandedId(isEx ? null : req.id)} title="View details">
                        <ChevronDown size={15} style={{ transform: isEx ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </button>
                    </td>
                  </tr>
                  {isEx && (
                    <tr key={`${req.id}-ex`}>
                      <td colSpan={6} className="zd-expand-td">
                        <div className="zd-expand-box">
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Full Detail</div>
                            <div style={{ fontSize: "0.83rem", color: "var(--zd-text)", lineHeight: 1.6 }}>{req.detail}</div>
                          </div>
                          {req.adminNote && (
                            <div style={{ borderTop: "1px solid var(--zd-border)", paddingTop: 8, marginTop: 4 }}>
                              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Admin Response</div>
                              <div style={{ fontSize: "0.83rem", color: "var(--zd-text)", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 7 }}>
                                <AlertTriangle size={13} color={s.color} style={{ marginTop: 2, flexShrink: 0 }} />{req.adminNote}
                              </div>
                            </div>
                          )}
                          {!req.adminNote && req.status === "pending" && (
                            <div style={{ borderTop: "1px solid var(--zd-border)", paddingTop: 8, marginTop: 4, display: "flex", alignItems: "center", gap: 7, fontSize: "0.8rem", color: "var(--zd-text-muted)" }}>
                              <Clock size={13} color="#f59e0b" />Awaiting admin review…
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── GLASSMORPHISM MODAL ── */}
      {showModal && (
        <div className="zd-mo-overlay" onClick={() => setShowModal(false)}>
          <div className="zd-mo" onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="zd-success-mo">
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <CheckCircle size={32} color="#22c55e" />
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--zd-text)", marginBottom: 6 }}>Request Submitted!</div>
                <div style={{ fontSize: "0.82rem", color: "var(--zd-text-muted)", marginBottom: "1.25rem" }}>
                  Your request has been sent to admin for review. You'll be notified once a decision is made.
                </div>
                <button className="zd-mo-submit" onClick={() => setShowModal(false)}>Close</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.25rem", position: "relative" }}>
                  <div>
                    <div className="zd-mo-title">New Request</div>
                    <div className="zd-mo-sub">{reqType ? `Type: ${REQUEST_TYPES.find(t=>t.key===reqType)?.label}` : "Choose a request type below"}</div>
                  </div>
                  <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--zd-text-muted)", fontSize: "1.2rem", padding: 0, lineHeight: 1, position: "relative" }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Step 1 — pick type */}
                {!reqType && (
                  <>
                    <div className="zd-type-step">
                      {REQUEST_TYPES.map(t => {
                        const Icon = t.icon;
                        return (
                          <div key={t.key} className={`zd-type-tile${reqType===t.key?" sel":""}`} onClick={() => setReqType(t.key)}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${t.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                              <Icon size={15} color={t.color} />
                            </div>
                            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--zd-text)", marginBottom: 2 }}>{t.label}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--zd-text-muted)", lineHeight: 1.4 }}>{t.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                    <button className="zd-mo-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  </>
                )}

                {/* Step 2 — fill in form by type */}
                {reqType === "reschedule" && (
                  <>
                    <div className="zd-mo-field">
                      <label className="zd-mo-label">Student</label>
                      <select className="zd-mo-input" value={form.student} onChange={e => setForm(f=>({...f, student: e.target.value}))}>
                        <option value="">Select student…</option>
                        {STUDENTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="zd-mo-row">
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">Current Date</label>
                        <input type="date" className="zd-mo-input" value={form.fromDate} onChange={e => setForm(f=>({...f, fromDate: e.target.value}))} />
                      </div>
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">Current Time</label>
                        <input type="time" className="zd-mo-input" value={form.fromTime} onChange={e => setForm(f=>({...f, fromTime: e.target.value}))} />
                      </div>
                    </div>
                    <div style={{ textAlign: "center", padding: "0.4rem 0", color: "var(--zd-text-muted)", fontSize: "0.8rem" }}>↓ Reschedule to</div>
                    <div className="zd-mo-row">
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">New Date</label>
                        <input type="date" className="zd-mo-input" value={form.toDate} onChange={e => setForm(f=>({...f, toDate: e.target.value}))} />
                      </div>
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">New Time</label>
                        <input type="time" className="zd-mo-input" value={form.toTime} onChange={e => setForm(f=>({...f, toTime: e.target.value}))} />
                      </div>
                    </div>
                    <div className="zd-mo-field" style={{ marginTop: "0.85rem" }}>
                      <label className="zd-mo-label">Reason</label>
                      <textarea className="zd-mo-input" rows={2} value={form.note} onChange={e => setForm(f=>({...f, note: e.target.value}))} placeholder="Explain why this lesson needs to be rescheduled…" style={{ resize: "none" }} />
                    </div>
                  </>
                )}

                {reqType === "leave" && (
                  <>
                    <div className="zd-mo-row">
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">Leave Start</label>
                        <input type="date" className="zd-mo-input" value={form.leaveStart} onChange={e => setForm(f=>({...f, leaveStart: e.target.value}))} />
                      </div>
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">Leave End</label>
                        <input type="date" className="zd-mo-input" value={form.leaveEnd} onChange={e => setForm(f=>({...f, leaveEnd: e.target.value}))} />
                      </div>
                    </div>
                    <div className="zd-mo-field" style={{ marginTop: "0.85rem" }}>
                      <label className="zd-mo-label">Type of Leave</label>
                      <select className="zd-mo-input">
                        <option>Personal</option><option>Medical</option><option>Family</option><option>Other</option>
                      </select>
                    </div>
                    <div className="zd-mo-field">
                      <label className="zd-mo-label">Additional Notes</label>
                      <textarea className="zd-mo-input" rows={3} value={form.note} onChange={e => setForm(f=>({...f, note: e.target.value}))} placeholder="Any context for admin…" style={{ resize: "none" }} />
                    </div>
                  </>
                )}

                {reqType === "offday" && (
                  <>
                    <div className="zd-mo-field">
                      <label className="zd-mo-label">Off Day Date</label>
                      <input type="date" className="zd-mo-input" value={form.offDate} onChange={e => setForm(f=>({...f, offDate: e.target.value}))} />
                    </div>
                    <div className="zd-mo-field">
                      <label className="zd-mo-label">Reason</label>
                      <select className="zd-mo-input">
                        <option>Personal</option><option>Family event</option><option>Medical appointment</option><option>Other</option>
                      </select>
                    </div>
                    <div className="zd-mo-field">
                      <label className="zd-mo-label">Notes</label>
                      <textarea className="zd-mo-input" rows={2} value={form.note} onChange={e => setForm(f=>({...f, note: e.target.value}))} placeholder="Optional context…" style={{ resize: "none" }} />
                    </div>
                  </>
                )}

                {reqType === "swap" && (
                  <>
                    <div style={{ fontSize: "0.78rem", color: "var(--zd-text-muted)", marginBottom: "0.75rem", padding: "0.6rem 0.8rem", background: "rgba(255,255,255,0.06)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)" }}>
                      Swap two lesson time slots between different students on the same day.
                    </div>
                    <div className="zd-mo-field">
                      <label className="zd-mo-label">Lesson Date</label>
                      <input type="date" className="zd-mo-input" value={form.fromDate} onChange={e => setForm(f=>({...f, fromDate: e.target.value}))} />
                    </div>
                    <div className="zd-mo-row">
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">Student A</label>
                        <select className="zd-mo-input" value={form.student} onChange={e => setForm(f=>({...f, student: e.target.value}))}>
                          <option value="">Select…</option>{STUDENTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">Their Time</label>
                        <input type="time" className="zd-mo-input" value={form.fromTime} onChange={e => setForm(f=>({...f, fromTime: e.target.value}))} />
                      </div>
                    </div>
                    <div style={{ textAlign: "center", padding: "0.35rem 0", color: "var(--zd-text-muted)", fontSize: "0.8rem" }}>⇄ swap with</div>
                    <div className="zd-mo-row">
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">Student B</label>
                        <select className="zd-mo-input" value={form.fromDate2} onChange={e => setForm(f=>({...f, fromDate2: e.target.value}))}>
                          <option value="">Select…</option>{STUDENTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="zd-mo-field" style={{ marginBottom: 0 }}>
                        <label className="zd-mo-label">Their Time</label>
                        <input type="time" className="zd-mo-input" value={form.toTime} onChange={e => setForm(f=>({...f, toTime: e.target.value}))} />
                      </div>
                    </div>
                    <div className="zd-mo-field" style={{ marginTop: "0.85rem" }}>
                      <label className="zd-mo-label">Reason for Swap</label>
                      <textarea className="zd-mo-input" rows={2} value={form.note} onChange={e => setForm(f=>({...f, note: e.target.value}))} placeholder="Why do these slots need to be swapped?" style={{ resize: "none" }} />
                    </div>
                  </>
                )}

                {reqType === "other" && (
                  <>
                    <div className="zd-mo-field">
                      <label className="zd-mo-label">Request Subject</label>
                      <input type="text" className="zd-mo-input" placeholder="Brief title for your request" />
                    </div>
                    <div className="zd-mo-field">
                      <label className="zd-mo-label">Full Description</label>
                      <textarea className="zd-mo-input" rows={5} value={form.note} onChange={e => setForm(f=>({...f, note: e.target.value}))} placeholder="Describe your request in detail…" style={{ resize: "vertical" }} />
                    </div>
                  </>
                )}

                {reqType && (
                  <>
                    <button className="zd-mo-submit" onClick={handleSubmit}>Submit Request</button>
                    <button className="zd-mo-cancel" onClick={() => setReqType(null)}>← Back</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}