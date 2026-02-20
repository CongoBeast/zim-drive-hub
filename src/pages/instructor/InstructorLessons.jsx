import { useState } from "react";
import { BookOpen, Search, Filter, ChevronDown, ChevronUp, Edit3, Eye, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

/* ─── Mock lesson data ─── */
const LESSONS = [
  /* Past */
  { id: 1,  date: "15 Feb 2026", time: "08:00", student: "Farai Zimba",    cls: "Class 1", duration: "1hr", status: "completed", location: "Avondale Centre",
    covered: ["Three-point turn", "Reversing into bay", "Mirror checks"], grade: "Pass", gradeColor: "#22c55e", comment: "Good spatial awareness. Needs to check mirrors more frequently at junctions. Overall confident progress." },
  { id: 2,  date: "15 Feb 2026", time: "10:00", student: "Rudo Kambarami", cls: "Class 1", duration: "1hr", status: "completed", location: "Avondale Centre",
    covered: ["Highway driving", "Lane discipline", "Speed management"], grade: "Excellent", gradeColor: "#4f46e5", comment: "Exceptional lane discipline on the highway. Very smooth gear transitions. Ready for advanced manoeuvres." },
  { id: 3,  date: "12 Feb 2026", time: "09:00", student: "Nyasha Dube",    cls: "Class 2", duration: "2hr", status: "completed", location: "Belvedere Grounds",
    covered: ["Coupling/uncoupling trailer", "Wide turns", "Loading zone parking"], grade: "Needs Work", gradeColor: "#f59e0b", comment: "Struggles with wide turning radius on Class 2. Clipped the curb twice. Recommend additional practice at low speeds before moving on." },
  { id: 4,  date: "12 Feb 2026", time: "14:00", student: "Tendai Makoni",  cls: "Class 1", duration: "1hr", status: "completed", location: "Borrowdale Track",
    covered: ["Uphill starts", "Downhill braking", "Hill parking"], grade: "Pass", gradeColor: "#22c55e", comment: "Solid control on the hill starts. Handbrake technique is good. Slight hesitation on release — will improve with more practice." },
  { id: 5,  date: "08 Feb 2026", time: "10:00", student: "Chiedza Moyo",   cls: "Class 1", duration: "1hr", status: "completed", location: "Avondale Centre",
    covered: ["Roundabout navigation", "Yielding", "Signalling"], grade: "Pass", gradeColor: "#22c55e", comment: "Handles roundabouts well with proper signalling. Can get flustered with heavy traffic — needs more exposure." },
  { id: 6,  date: "05 Feb 2026", time: "11:00", student: "Simba Ndlovu",   cls: "Class 2", duration: "2hr", status: "completed", location: "Belvedere Grounds",
    covered: ["Air brake system", "Pre-trip inspection", "Straight-line reversing"], grade: "Excellent", gradeColor: "#4f46e5", comment: "Excellent understanding of the air brake system. Methodical and thorough with pre-trip inspection. Strong candidate." },
  { id: 7,  date: "01 Feb 2026", time: "09:00", student: "Tatenda Rusere", cls: "Class 1", duration: "1hr", status: "completed", location: "Avondale Centre",
    covered: ["Parallel parking", "Perpendicular parking", "Exiting tight spaces"], grade: "Needs Work", gradeColor: "#f59e0b", comment: "Parking is still challenging. Misjudges distance to curb. Suggest using reference points on the vehicle to improve accuracy." },
  /* Upcoming */
  { id: 8,  date: "20 Feb 2026", time: "13:00", student: "Nyasha Dube",    cls: "Class 2", duration: "2hr", status: "upcoming",  location: "Belvedere Grounds",
    covered: [], grade: null, gradeColor: null, comment: null },
  { id: 9,  date: "20 Feb 2026", time: "16:00", student: "Tendai Makoni",  cls: "Class 1", duration: "1hr", status: "upcoming",  location: "Avondale Centre",
    covered: [], grade: null, gradeColor: null, comment: null },
  { id: 10, date: "21 Feb 2026", time: "09:00", student: "Chiedza Moyo",   cls: "Class 1", duration: "1hr", status: "upcoming",  location: "Borrowdale Track",
    covered: [], grade: null, gradeColor: null, comment: null },
  { id: 11, date: "22 Feb 2026", time: "10:00", student: "Farai Zimba",    cls: "Class 1", duration: "1hr", status: "upcoming",  location: "Avondale Centre",
    covered: [], grade: null, gradeColor: null, comment: null },
  { id: 12, date: "23 Feb 2026", time: "09:00", student: "Simba Ndlovu",   cls: "Class 2", duration: "2hr", status: "upcoming",  location: "Belvedere Grounds",
    covered: [], grade: null, gradeColor: null, comment: null },
];

const STATUS_CFG = {
  completed: { label: "Completed", color: "#22c55e", bg: "rgba(34,197,94,0.1)"    },
  upcoming:  { label: "Upcoming",  color: "#059669", bg: "rgba(5,150,105,0.1)"    },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.1)"    },
};
const GRADE_COLORS = { "Excellent": "#4f46e5", "Pass": "#22c55e", "Needs Work": "#f59e0b" };

export default function InstructorLessons() {
  const { theme } = useAuth();
  const p = theme?.primary || "#059669";

  const [tab,        setTab]      = useState("past");   // "past" | "upcoming"
  const [search,     setSearch]   = useState("");
  const [filterCls,  setFilterCls]= useState("All");
  const [expanded,   setExpanded] = useState(null);
  const [editLesson, setEditLesson]= useState(null);
  const [editData,   setEditData] = useState({});

  const displayed = LESSONS.filter(l => {
    const matchTab    = tab === "past" ? l.status === "completed" : l.status === "upcoming";
    const matchSearch = l.student.toLowerCase().includes(search.toLowerCase()) || l.date.includes(search);
    const matchCls    = filterCls === "All" || l.cls === filterCls;
    return matchTab && matchSearch && matchCls;
  });

  const openEdit = (lesson) => {
    setEditLesson(lesson);
    setEditData({
      grade:   lesson.grade   || "Pass",
      comment: lesson.comment || "",
      covered: (lesson.covered || []).join(", "),
    });
  };

  const saveEdit = () => {
    setEditLesson(null);
  };

  return (
    <Layout>
      <style>{`
        .zd-less-tabs { display: flex; gap: 4px; margin-bottom: 1.25rem; background: var(--zd-surface-alt); padding: 4px; border-radius: 10px; width: fit-content; border: 1px solid var(--zd-border); }
        .zd-less-tab  { padding: 0.45rem 1.1rem; border-radius: 7px; border: none; font-family: inherit; font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: all 0.15s; background: transparent; color: var(--zd-text-muted); }
        .zd-less-tab.active { background: var(--zd-surface); color: var(--zd-primary); box-shadow: 0 1px 4px rgba(0,0,0,0.08); border: 1px solid var(--zd-border); }

        .zd-toolbar { display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
        .zd-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .zd-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--zd-text-muted); pointer-events: none; }
        .zd-search-input {
          width: 100%; padding: 0.5rem 0.75rem 0.5rem 2.2rem;
          background: var(--zd-surface); border: 1px solid var(--zd-border);
          border-radius: 9px; color: var(--zd-text); font-size: 0.84rem;
          font-family: inherit; outline: none; transition: border-color 0.13s; box-shadow: none;
        }
        .zd-search-input:focus { border-color: var(--zd-primary); }
        .zd-filter-sel {
          padding: 0.5rem 0.8rem; background: var(--zd-surface);
          border: 1px solid var(--zd-border); border-radius: 9px;
          color: var(--zd-text); font-size: 0.84rem; font-family: inherit;
          outline: none; cursor: pointer;
        }

        /* Table */
        .zd-table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid var(--zd-border); }
        .zd-table { width: 100%; border-collapse: collapse; min-width: 700px; }
        .zd-table th {
          background: var(--zd-surface-alt); color: var(--zd-text-muted);
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; padding: 0.7rem 0.9rem;
          text-align: left; border-bottom: 1px solid var(--zd-border);
          white-space: nowrap;
        }
        .zd-table td {
          padding: 0.85rem 0.9rem;
          border-bottom: 1px solid var(--zd-border);
          color: var(--zd-text); background: var(--zd-surface);
          vertical-align: top; font-size: 0.84rem;
        }
        .zd-table tr:last-child td { border-bottom: none; }
        .zd-table tr:hover td { background: var(--zd-surface-alt); }

        .zd-badge { display: inline-block; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
        .zd-chip  { display: inline-block; font-size: 0.7rem; font-weight: 500; padding: 2px 7px; border-radius: 5px; background: var(--zd-surface-alt); color: var(--zd-text-muted); border: 1px solid var(--zd-border); margin: 1px; }

        .zd-action-icon { background: none; border: none; cursor: pointer; padding: 5px; border-radius: 7px; color: var(--zd-text-muted); display: inline-flex; align-items: center; transition: all 0.12s; }
        .zd-action-icon:hover { background: var(--zd-surface-alt); color: var(--zd-primary); }

        .zd-expand-row td { background: var(--zd-surface-alt) !important; }
        .zd-expand-box { padding: 0.75rem 1rem; background: var(--zd-surface-alt); border-radius: 10px; }

        /* Edit modal */
        .zd-modal-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.55); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .zd-modal {
          background: rgba(255,255,255,0.1); backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(255,255,255,0.2); border-radius: 20px;
          padding: 1.75rem; width: 100%; max-width: 520px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.35);
        }
        [data-theme="instructor"] .zd-modal { background: rgba(255,255,255,0.78); border: 1px solid rgba(255,255,255,0.6); }
        .zd-modal-input {
          width: 100%; padding: 0.55rem 0.75rem;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
          border-radius: 8px; color: var(--zd-text); font-size: 0.84rem;
          font-family: inherit; outline: none; transition: border-color 0.13s; box-shadow: none;
        }
        .zd-modal-input:focus { border-color: var(--zd-primary); }
        [data-theme="instructor"] .zd-modal-input { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.15); }
        .zd-grade-opt { display: flex; gap: 8px; flex-wrap: wrap; }
        .zd-grade-pill { padding: 0.4rem 1rem; border-radius: 20px; border: 1px solid var(--zd-border); background: transparent; color: var(--zd-text-muted); font-size: 0.8rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.13s; }
        .zd-grade-pill.sel-excellent { background: rgba(79,70,229,0.15); border-color: #4f46e5; color: #4f46e5; }
        .zd-grade-pill.sel-pass      { background: rgba(34,197,94,0.15); border-color: #22c55e; color: #22c55e; }
        .zd-grade-pill.sel-needs     { background: rgba(245,158,11,0.15); border-color: #f59e0b; color: #f59e0b; }
        .zd-modal-submit { width: 100%; padding: 0.7rem; border-radius: 10px; border: none; background: var(--zd-gradient); color: #fff; font-size: 0.9rem; font-weight: 700; font-family: inherit; cursor: pointer; transition: filter 0.13s; margin-top: 0.75rem; }
        .zd-modal-submit:hover { filter: brightness(1.08); }
        .zd-modal-cancel { width: 100%; padding: 0.55rem; border-radius: 10px; border: 1px solid var(--zd-border); background: transparent; color: var(--zd-text-muted); font-size: 0.84rem; font-family: inherit; cursor: pointer; margin-top: 6px; transition: background 0.12s; }
        .zd-modal-cancel:hover { background: var(--zd-surface-alt); }

        .zd-empty { text-align: center; padding: 2.5rem; color: var(--zd-text-muted); background: var(--zd-surface); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h4 style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.025em", color: "var(--zd-text)", margin: 0, marginBottom: 4 }}>
          Lessons
        </h4>
        <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>
          Full lesson history with grades, topics covered and student progress notes.
        </p>
      </div>

      {/* Tabs */}
      <div className="zd-less-tabs">
        {[{ key: "past", label: `📋 Past Lessons (${LESSONS.filter(l=>l.status==="completed").length})` },
          { key: "upcoming", label: `📅 Upcoming (${LESSONS.filter(l=>l.status==="upcoming").length})` }
        ].map(t => (
          <button key={t.key} className={`zd-less-tab${tab===t.key?" active":""}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="zd-toolbar">
        <div className="zd-search-wrap">
          <Search size={14} className="zd-search-icon" />
          <input className="zd-search-input" placeholder="Search student or date…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="zd-filter-sel" value={filterCls} onChange={e => setFilterCls(e.target.value)}>
          <option>All</option><option>Class 1</option><option>Class 2</option>
        </select>
        <div style={{ fontSize: "0.78rem", color: "var(--zd-text-muted)", marginLeft: "auto" }}>{displayed.length} records</div>
      </div>

      {/* Table */}
      <div className="zd-table-wrap">
        <table className="zd-table">
          <thead>
            <tr>
              {tab === "past"
                ? ["Date & Time","Student","Class","Duration","Location","Grade","Actions"].map(h => <th key={h}>{h}</th>)
                : ["Date & Time","Student","Class","Duration","Location","Status","Actions"].map(h => <th key={h}>{h}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={7} className="zd-empty">No lessons found</td></tr>
            ) : displayed.map(lesson => {
              const s    = STATUS_CFG[lesson.status];
              const isEx = expanded === lesson.id;
              return (
                <>
                  <tr key={lesson.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{lesson.date}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--zd-text-muted)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Clock size={11} />{lesson.time}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{lesson.student}</td>
                    <td><span className="zd-badge" style={{ background: `${p}18`, color: p }}>{lesson.cls}</span></td>
                    <td style={{ color: "var(--zd-text-muted)" }}>{lesson.duration}</td>
                    <td style={{ color: "var(--zd-text-muted)", fontSize: "0.78rem" }}>{lesson.location}</td>
                    <td>
                      {tab === "past" && lesson.grade ? (
                        <span className="zd-badge" style={{ background: `${GRADE_COLORS[lesson.grade]}18`, color: GRADE_COLORS[lesson.grade] }}>{lesson.grade}</span>
                      ) : (
                        <span className="zd-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="zd-action-icon" title="View details" onClick={() => setExpanded(isEx ? null : lesson.id)}>
                          {isEx ? <ChevronUp size={15} /> : <Eye size={15} />}
                        </button>
                        {tab === "past" && (
                          <button className="zd-action-icon" title="Update lesson" onClick={() => openEdit(lesson)} style={{ color: p }}>
                            <Edit3 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {isEx && (
                    <tr className="zd-expand-row" key={`${lesson.id}-exp`}>
                      <td colSpan={7}>
                        <div className="zd-expand-box">
                          {tab === "past" ? (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                              <div>
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Topics Covered</div>
                                {lesson.covered?.length ? lesson.covered.map((t, i) => (
                                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                    <CheckCircle size={13} color="#22c55e" />
                                    <span style={{ fontSize: "0.8rem", color: "var(--zd-text)" }}>{t}</span>
                                  </div>
                                )) : <div style={{ fontSize: "0.8rem", color: "var(--zd-text-muted)" }}>None recorded</div>}
                              </div>
                              <div>
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--zd-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Instructor Comment</div>
                                <div style={{ fontSize: "0.82rem", color: "var(--zd-text)", lineHeight: 1.6, background: "var(--zd-surface)", padding: "0.65rem", borderRadius: 8, border: "1px solid var(--zd-border)" }}>
                                  {lesson.comment || "No comment recorded."}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <AlertCircle size={15} color={p} />
                              <span style={{ fontSize: "0.83rem", color: "var(--zd-text-muted)" }}>
                                This lesson has not taken place yet. Grades and notes will be added after completion.
                              </span>
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

      {/* Edit Modal */}
      {editLesson && (
        <div className="zd-modal-overlay" onClick={() => setEditLesson(null)}>
          <div className="zd-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem" }}>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--zd-text)" }}>Update Lesson Record</div>
                <div style={{ fontSize: "0.78rem", color: "var(--zd-text-muted)", marginTop: 2 }}>{editLesson.student} · {editLesson.date} · {editLesson.time}</div>
              </div>
              <button onClick={() => setEditLesson(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--zd-text-muted)", fontSize: "1.2rem", padding: 0, lineHeight: 1 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: "0.85rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--zd-text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Grade</div>
              <div className="zd-grade-opt">
                {[{v:"Excellent",cls:"sel-excellent"},{v:"Pass",cls:"sel-pass"},{v:"Needs Work",cls:"sel-needs"}].map(g => (
                  <button key={g.v} className={`zd-grade-pill${editData.grade===g.v ? " "+g.cls : ""}`} onClick={() => setEditData(d => ({ ...d, grade: g.v }))}>
                    {g.v}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "0.85rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--zd-text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Topics Covered <span style={{ fontWeight: 400, textTransform: "none" }}>(comma-separated)</span></div>
              <input className="zd-modal-input" value={editData.covered} onChange={e => setEditData(d => ({ ...d, covered: e.target.value }))} placeholder="e.g. Three-point turn, Lane discipline" />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--zd-text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Student Ability Comment</div>
              <textarea className="zd-modal-input" rows={4} value={editData.comment} onChange={e => setEditData(d => ({ ...d, comment: e.target.value }))} placeholder="Describe the student's performance and areas for improvement…" style={{ resize: "vertical" }} />
            </div>

            <button className="zd-modal-submit" onClick={saveEdit}>Save Changes</button>
            <button className="zd-modal-cancel" onClick={() => setEditLesson(null)}>Cancel</button>
          </div>
        </div>
      )}
    </Layout>
  );
}