import React, { useState } from "react";
import { Clock, BookOpen, FileText, Star, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Layout from "../components/Layout";

export default function InstructorDetails() {
  const [activeTab, setActiveTab] = useState("history"); // history, clock, requests

  return (
    <Layout>
      <style>{`
        .profile-header { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; display: flex; gap: 2rem; align-items: center; }
        .tab-menu { display: flex; gap: 1.5rem; border-bottom: 1px solid var(--zd-border); margin-bottom: 1.5rem; }
        .tab-item { padding: 0.75rem 0.25rem; cursor: pointer; font-weight: 600; font-size: 0.9rem; color: var(--zd-text-muted); position: relative; }
        .tab-item.active { color: var(--zd-primary); }
        .tab-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--zd-primary); }
        .request-card { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; }
      `}</style>

      <button onClick={() => window.history.back()} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "var(--zd-text-muted)", cursor: "pointer", marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* Profile Header */}
      <div className="profile-header">
        <img src="https://i.pravatar.cc/150?u=1" style={{ width: 100, height: 100, borderRadius: 20 }} alt="Instructor" />
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: "1.8rem" }}>Blessing Chikwanda</h2>
          <p style={{ color: "var(--zd-text-muted)", margin: "4px 0 12px 0" }}>Senior Instructor • Class 1 Specialist</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800 }}>156</div>
              <div style={{ fontSize: "0.7rem", color: "var(--zd-text-muted)" }}>Total Lessons</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, color: "#f59e0b" }}>4.8</div>
              <div style={{ fontSize: "0.7rem", color: "var(--zd-text-muted)" }}>Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-menu">
        <div className={`tab-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Previous Lessons</div>
        <div className={`tab-item ${activeTab === 'clock' ? 'active' : ''}`} onClick={() => setActiveTab('clock')}>Clock In/Out</div>
        <div className={`tab-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Staff Requests</div>
      </div>

      {/* Tab Content */}
      <div className="zd-card" style={{ padding: '0.5rem' }}>
        {activeTab === 'history' && (
          <table className="zd-table">
            <thead>
              <tr><th>Date</th><th>Student</th><th>Duration</th><th>Rating</th></tr>
            </thead>
            <tbody>
              <tr><td>Today, 10:00</td><td>Rudo Kambarami</td><td>1.5 hrs</td><td><Star size={12} fill="#f59e0b" color="#f59e0b" /> 5.0</td></tr>
              <tr><td>Yesterday</td><td>Farai Zimba</td><td>1.0 hrs</td><td><Star size={12} fill="#f59e0b" color="#f59e0b" /> 4.5</td></tr>
            </tbody>
          </table>
        )}

        {activeTab === 'clock' && (
          <table className="zd-table">
            <thead>
              <tr><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Total Hrs</th></tr>
            </thead>
            <tbody>
              <tr><td>Feb 19, 2026</td><td>07:55 AM</td><td>05:10 PM</td><td>9.25 hrs</td></tr>
              <tr><td>Feb 18, 2026</td><td>08:02 AM</td><td>04:55 PM</td><td>8.8 hrs</td></tr>
            </tbody>
          </table>
        )}

        {activeTab === 'requests' && (
          <div>
            <div className="request-card">
              <div>
                <div style={{ fontWeight: 700 }}>Pay Advance Request ($50)</div>
                <div style={{ fontSize: "0.75rem", color: "var(--zd-text-muted)" }}>Submitted 2 hours ago • Urgent</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ padding: "6px", borderRadius: "8px", border: "1px solid #22c55e", color: "#22c55e", background: "none" }}><CheckCircle size={18} /></button>
                <button style={{ padding: "6px", borderRadius: "8px", border: "1px solid #ef4444", color: "#ef4444", background: "none" }}><XCircle size={18} /></button>
              </div>
            </div>
            <div className="request-card">
              <div>
                <div style={{ fontWeight: 700 }}>Off Day: Friday, Feb 27</div>
                <div style={{ fontSize: "0.75rem", color: "var(--zd-text-muted)" }}>Submitted yesterday • Reason: Family Event</div>
              </div>
              <span className="zd-badge" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>Approved</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}