import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Star,
  Calendar,
  Users,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  UserX,
  X
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MOCK_DRIVERS = [
  {
    id: 1,
    name: "Blessing Chikwanda",
    joined: "Jan 2024",
    totalStudents: 42,
    rating: 4.8,
    status: "Active",
    image: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Grace Mutasa",
    joined: "Mar 2024",
    totalStudents: 28,
    rating: 4.9,
    status: "Active",
    image: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "John Sithole",
    joined: "Nov 2023",
    totalStudents: 65,
    rating: 4.5,
    status: "On Leave",
    image: "https://i.pravatar.cc/150?u=3",
  },
];

export default function InstructorsPage() {
  const { theme } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filteredDrivers = useMemo(() => {
    return MOCK_DRIVERS.filter((driver) => {
      const matchesSearch = driver.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || driver.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <Layout>
      <style>{`
        .instructor-card {
          background: var(--zd-surface);
          border: 1px solid var(--zd-border);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s;
          cursor: pointer;
          position: relative;
        }
        .instructor-card:hover {
          transform: translateY(-4px);
          border-color: var(--zd-primary);
        }
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .avatar-lg {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          object-fit: cover;
        }
        .status-pill {
          font-size: 0.7rem;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 700;
        }
        .action-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
        }
        .action-btn:hover {
          background: var(--zd-surface-alt);
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .modal-card {
          background: var(--zd-surface);
          width: 500px;
          max-width: 95%;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--zd-border);
        }
        .input-field {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--zd-border);
          background: var(--zd-surface-alt);
          color: var(--zd-text);
        }
      `}</style>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", margin: 0 }}>
            Instructors Fleet
          </h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.85rem" }}>
            Manage your driving staff and their performance.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            fontWeight: 700,
          }}
        >
          <Plus size={18} /> Add Instructor
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              top: "50%",
              left: 12,
              transform: "translateY(-50%)",
              color: "var(--zd-text-muted)",
            }}
          />
          <input
            className="input-field"
            style={{ paddingLeft: "36px" }}
            placeholder="Search instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="input-field"
          style={{ width: 180 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>On Leave</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid-layout">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="instructor-card">
            <div style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <span
                  className="status-pill"
                  style={{
                    background:
                      driver.status === "Active"
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(245,158,11,0.1)",
                    color:
                      driver.status === "Active" ? "#22c55e" : "#f59e0b",
                  }}
                >
                  {driver.status}
                </span>

                <div style={{ display: "flex", gap: 4 }}>
                  <button className="action-btn">
                    <Edit size={16} />
                  </button>
                  <button className="action-btn">
                    <UserX size={16} />
                  </button>
                  <button className="action-btn">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 style={{ fontWeight: 800 }}>{driver.name}</h3>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--zd-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <Calendar size={14} /> Joined {driver.joined}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ display: "flex", gap: 4 }}>
                  <Users size={14} /> {driver.totalStudents} Students
                </span>
                <span
                  style={{
                    display: "flex",
                    gap: 4,
                    color: "#f59e0b",
                    fontWeight: 700,
                  }}
                >
                  <Star size={14} fill="#f59e0b" /> {driver.rating}
                </span>
              </div>
            </div>

            <div
              onClick={() =>
                navigate(`/admin/instructors/${driver.id}`)
              }
              style={{
                borderTop: "1px solid var(--zd-border)",
                padding: "0.75rem 1.5rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "var(--zd-primary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              View Full Profile <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* ADD INSTRUCTOR MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h5 style={{ fontWeight: 800 }}>Add New Instructor</h5>
              <button
                className="action-btn"
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <input className="input-field" placeholder="Full Name" />
              <input className="input-field" placeholder="Email Address" />
              <input className="input-field" placeholder="Phone Number" />
              <select className="input-field">
                <option>Active</option>
                <option>On Leave</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary">
                Create Instructor
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}