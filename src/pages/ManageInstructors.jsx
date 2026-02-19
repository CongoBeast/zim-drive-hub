import React, { useState } from "react";
import { Search, Plus, Star, MapPin, Calendar, Users, ChevronRight } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MOCK_DRIVERS = [
  { 
    id: 1, name: "Blessing Chikwanda", joined: "Jan 2024", totalStudents: 42, 
    rating: 4.8, status: "Active", image: "https://i.pravatar.cc/150?u=1" 
  },
  { 
    id: 2, name: "Grace Mutasa", joined: "Mar 2024", totalStudents: 28, 
    rating: 4.9, status: "Active", image: "https://i.pravatar.cc/150?u=2" 
  },
  { 
    id: 3, name: "John Sithole", joined: "Nov 2023", totalStudents: 65, 
    rating: 4.5, status: "On Leave", image: "https://i.pravatar.cc/150?u=3" 
  },
];

export default function InstructorsPage() {
  const { theme } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <style>{`
        .instructor-card {
          background: var(--zd-surface); border: 1px solid var(--zd-border);
          border-radius: 16px; overflow: hidden; transition: all 0.2s;
          cursor: pointer;
        }
        .instructor-card:hover { transform: translateY(-4px); border-color: var(--zd-primary); }
        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
        .avatar-lg { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; }
        .status-pill { font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 700; }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", color: "var(--zd-text)", margin: 0 }}>Instructors Fleet</h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>Manage your driving staff and their performance.</p>
        </div>
        <button className="btn-primary"><Plus size={18} /> Add Instructor</button>
      </div>

      <div className="grid-layout">
        {MOCK_DRIVERS.map(driver => (
          <div key={driver.id} className="instructor-card" onClick={() => navigate(`/admin/instructors/${driver.id}`)}>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <img src={driver.image} className="avatar-lg" alt={driver.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="status-pill" style={{ 
                      background: driver.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                      color: driver.status === "Active" ? "#22c55e" : "#f59e0b"
                    }}>{driver.status}</span>
                  </div>
                  <h3 style={{ margin: "4px 0", fontSize: "1.1rem", fontWeight: 800 }}>{driver.name}</h3>
                  <div style={{ fontSize: "0.75rem", color: "var(--zd-text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> Joined {driver.joined}
                  </div>
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "var(--zd-surface-alt)", padding: "0.75rem", borderRadius: "10px" }}>
                <div>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--zd-text-muted)", fontWeight: 700 }}>Students</div>
                  <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                    <Users size={14} /> {driver.totalStudents}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--zd-text-muted)", fontWeight: 700 }}>Rating</div>
                  <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 4, color: "#f59e0b" }}>
                    <Star size={14} fill="#f59e0b" /> {driver.rating}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--zd-border)", padding: "0.75rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", fontWeight: 600, color: "var(--zd-primary)" }}>
              View Full Profile <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}