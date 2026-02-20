import React, { useState } from "react";
import { CreditCard, DollarSign, TrendingUp, Plus, Search, Calendar, Download, X } from "lucide-react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const PAYMENTS = [
  { student: "Rudo Kambarami", amount: 120, method: "Cash", date: "2026-02-18", status: "Completed" },
  { student: "Takudzwa Ndoro", amount: 200, method: "EcoCash", date: "2026-02-17", status: "Completed" },
  { student: "Farai Zimba", amount: 150, method: "Swipe", date: "2026-02-15", status: "Pending" },
];

const METHOD_COLORS = {
  Cash: "#22c55e",
  EcoCash: "#8b5cf6",
  Swipe: "#06b6d4",
};

export default function AdminPaymentsPage() {
  const { theme } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const total = PAYMENTS.reduce((acc, p) => acc + p.amount, 0);

  return (
    <Layout>
      <style>{`
        .glass-stats {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .glass-modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }

        .glass-modal-content {
          background: rgba(28, 28, 30, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%; max-width: 480px;
          border-radius: 24px; padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          color: white;
        }

        .input-glass {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px; padding: 12px 16px;
          color: white; width: 100%; outline: none;
          transition: all 0.2s;
        }
        .input-glass:focus { border-color: var(--zd-primary); background: rgba(255, 255, 255, 0.08); }

        .btn-glass-primary {
          background: var(--zd-primary); color: white; border: none;
          padding: 12px 24px; border-radius: 12px; font-weight: 700;
          cursor: pointer; transition: transform 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .btn-glass-primary:hover { transform: scale(1.02); opacity: 0.9; }

        .zd-table th { padding: 12px; text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--zd-text-muted); border-bottom: 1px solid var(--zd-border); }
        .zd-table td { padding: 16px 12px; border-bottom: 1px solid var(--zd-border); font-size: 0.9rem; }
      `}</style>

      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.6rem", letterSpacing: "-0.02em", color: "var(--zd-text)", margin: 0 }}>Financial Records</h4>
          <p style={{ color: "var(--zd-text-muted)", margin: 0 }}>Track revenue and student transaction history.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="zd-view-all-btn" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-glass-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> New Payment
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass-stats">
        <Stat icon={DollarSign} label="Monthly Revenue" value={`$${total.toLocaleString()}`} color="#22c55e" trend="+12.5%" />
        <Stat icon={CreditCard} label="Transactions" value={PAYMENTS.length} color={theme?.primary} trend="+3" />
        <Stat icon={TrendingUp} label="Avg. Payment" value={`$${(total / PAYMENTS.length).toFixed(0)}`} color="#f59e0b" trend="Steady" />
      </div>

      {/* Main Table Card */}
      <div style={{ background: "var(--zd-surface)", border: "1px solid var(--zd-border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--zd-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--zd-text-muted)" }} />
            <input 
              placeholder="Search payments..." 
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 10, border: "1px solid var(--zd-border)", background: "var(--zd-surface-alt)", color: "var(--zd-text)" }} 
            />
          </div>
          <div style={{ display: "flex", gap: 8, color: "var(--zd-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>
            <Calendar size={16} /> Feb 1 - Feb 28, 2026
          </div>
        </div>

        <table className="zd-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{p.student}</td>
                <td style={{ fontWeight: 800, color: "var(--zd-text)" }}>${p.amount.toFixed(2)}</td>
                <td>
                  <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, background: `${METHOD_COLORS[p.method]}15`, color: METHOD_COLORS[p.method] }}>
                    {p.method}
                  </span>
                </td>
                <td style={{ color: "var(--zd-text-muted)" }}>{p.date}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: p.status === "Completed" ? "#22c55e" : "#f59e0b" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                    {p.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Glassmorphism Modal */}
      {isModalOpen && (
        <div className="glass-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="glass-modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>Record Payment</h3>
              <X size={24} style={{ cursor: "pointer", opacity: 0.5 }} onClick={() => setIsModalOpen(false)} />
            </div>

            <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", marginBottom: 8, opacity: 0.7 }}>Student Name</label>
                <input className="input-glass" placeholder="Search student..." />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", marginBottom: 8, opacity: 0.7 }}>Amount (USD)</label>
                  <input className="input-glass" type="number" placeholder="0.00" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", marginBottom: 8, opacity: 0.7 }}>Method</label>
                  <select className="input-glass" style={{ appearance: "none" }}>
                    <option>Cash</option>
                    <option>EcoCash</option>
                    <option>Swipe</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", marginBottom: 8, opacity: 0.7 }}>Date of Payment</label>
                <input className="input-glass" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <button 
                type="button" 
                className="btn-glass-primary" 
                style={{ width: "100%", justifyContent: "center", marginTop: "1rem", height: "50px" }}
                onClick={() => setIsModalOpen(false)}
              >
                Confirm Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

function Stat({ icon: Icon, label, value, color, trend }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <Icon size={20} color={color} />
        </div>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 10 }}>
          {trend}
        </span>
      </div>
      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "white", marginTop: 4 }}>{value}</div>
    </div>
  );
}