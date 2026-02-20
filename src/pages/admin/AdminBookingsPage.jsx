import React, { useState } from "react";
import { 
  CalendarDays, CheckCircle, XCircle, RefreshCcw, 
  Search, Filter, ChevronLeft, ChevronRight, Clock, User
} from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const BOOKINGS = [
  { id: 1, student: "Rudo Kambarami", instructor: "Blessing Chikwanda", cls: "Class 1", date: "2026-02-22", time: "10:00 AM", status: "pending" },
  { id: 2, student: "Takudzwa Ndoro", instructor: "Grace Mutasa", cls: "Class 2", date: "2026-02-23", time: "02:00 PM", status: "confirmed" },
  { id: 3, student: "Farai Zimba", instructor: "John Sithole", cls: "Class 1", date: "2026-02-24", time: "09:00 AM", status: "cancelled" },
];

const STATUS_MAP = {
  confirmed: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "Confirmed" },
  pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Awaiting Approval" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "Cancelled" },
};

export default function AdminBookingsPage() {
  const { theme } = useAuth();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleReschedule = (booking) => {
    setSelectedBooking(booking);
    setRescheduleOpen(true);
  };

  return (
    <Layout>
      <style>{`
        .zd-card { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 16px; padding: 1.5rem; }
        .action-chip { 
          display: flex; alignItems: center; gap: 6px; padding: 6px 12px; 
          border-radius: 10px; border: 1px solid transparent; cursor: pointer; 
          font-size: 0.75rem; font-weight: 700; transition: all 0.2s;
        }
        .action-chip:hover { transform: translateY(-1px); filter: brightness(1.1); }
        
        .calendar-grid { 
          display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-top: 1.5rem; 
        }
        .calendar-day {
          aspect-ratio: 1/1; border-radius: 12px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column;
          align-items: center; justify-content: center; transition: 0.2s; cursor: pointer;
        }
        .calendar-day:hover { background: rgba(255,255,255,0.08); border-color: var(--zd-primary); }
        .calendar-day.active { background: var(--zd-primary); color: white; }

        .glass-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .glass-modal {
          background: rgba(30, 30, 35, 0.8); backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1); width: 400px;
          border-radius: 24px; padding: 2rem; color: white;
        }
        .input-glass {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 10px; color: white; outline: none; margin-top: 8px;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.6rem", color: "var(--zd-text)", margin: 0 }}>Lesson Schedule</h4>
          <p style={{ color: "var(--zd-text-muted)", margin: 0 }}>Manage instructor availability and student bookings.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
           <button className="zd-view-all-btn" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarDays size={16} /> View Full Calendar
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="zd-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
           <div style={{ position: "relative", width: "300px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--zd-text-muted)" }} />
            <input placeholder="Filter by student or instructor..." style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 10, border: "1px solid var(--zd-border)", background: "var(--zd-surface-alt)", color: "var(--zd-text)" }} />
          </div>
          <button className="zd-view-all-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} /> All Classes
          </button>
        </div>

        <div className="zd-table-wrap">
          <table className="zd-table">
            <thead>
              <tr>
                <th>Student & Class</th>
                <th>Instructor</th>
                <th>Schedule</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((b) => {
                const s = STATUS_MAP[b.status];
                return (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{b.student}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--zd-primary)", fontWeight: 700 }}>{b.cls}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--zd-surface-alt)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}><User size={12} /></div>
                        {b.instructor}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.date}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--zd-text-muted)", display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {b.time}
                      </div>
                    </td>
                    <td>
                      <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button className="action-chip" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }} title="Confirm"><CheckCircle size={16} /></button>
                        <button className="action-chip" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }} title="Cancel"><XCircle size={16} /></button>
                        <button 
                          className="action-chip" 
                          style={{ background: `${theme?.primary}15`, color: theme?.primary }}
                          onClick={() => handleReschedule(b)}
                        >
                          <RefreshCcw size={16} /> Reschedule
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Glass Calendar View */}
      <div style={{ 
        marginTop: "2rem", borderRadius: 24, padding: "2rem",
        background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CalendarDays size={22} color={theme?.primary} />
            <h5 style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem" }}>February 2026</h5>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="action-chip" style={{ background: "rgba(255,255,255,0.05)", color: "white" }}><ChevronLeft size={16} /></button>
            <button className="action-chip" style={{ background: "rgba(255,255,255,0.05)", color: "white" }}><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="calendar-grid">
          {["S", "M", "T", "W", "T", "F", "S"].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'var(--zd-text-muted)', paddingBottom: 10 }}>{d}</div>
          ))}
          {Array.from({ length: 28 }).map((_, i) => {
            const hasLessons = Math.random() > 0.5;
            return (
              <div key={i} className={`calendar-day ${i === 19 ? 'active' : ''}`}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{i + 1}</span>
                {hasLessons && <div style={{ width: 4, height: 4, borderRadius: '50%', background: i === 19 ? 'white' : theme?.primary, marginTop: 4 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reschedule Glass Modal */}
      {rescheduleOpen && (
        <div className="glass-overlay" onClick={() => setRescheduleOpen(false)}>
          <div className="glass-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontWeight: 800 }}>Reschedule</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
              Moving lesson for <strong>{selectedBooking?.student}</strong>
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8 }}>New Date & Time</label>
              <input type="datetime-local" className="input-glass" />
            </div>

            <div style={{ padding: '1rem', borderRadius: 12, background: 'rgba(255,255,255,0.05)', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ opacity: 0.6 }}>Current Instructor:</span>
                <span>{selectedBooking?.instructor}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setRescheduleOpen(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                style={{ flex: 2, padding: '12px', borderRadius: 12, background: theme?.primary, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}