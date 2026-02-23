import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Calendar,
  Fuel,
  Truck,
  Car,
  Wrench,
  AlertTriangle,
  Edit,
  Trash2,
  ChevronRight,
  X
} from "lucide-react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const MOCK_VEHICLES = [
  {
    id: 1,
    plate: "ABC 123 GP",
    type: "Sedan",
    model: "Toyota Corolla 2022",
    status: "Active",
    fuel: 78,
    serviceDue: "2026-03-12",
    faults: 1,
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442"
  },
  {
    id: 2,
    plate: "TRK 908 GP",
    type: "2-Tonne Truck",
    model: "Isuzu NPR 2021",
    status: "Maintenance",
    fuel: 40,
    serviceDue: "2026-03-02",
    faults: 3,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7"
  },
  {
    id: 3,
    plate: "XYZ 445 GP",
    type: "Sedan",
    model: "VW Polo 2023",
    status: "Active",
    fuel: 92,
    serviceDue: "2026-04-28",
    faults: 0,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a"
  }
];

export default function FleetManagementPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filteredVehicles = useMemo(() => {
    return MOCK_VEHICLES.filter(vehicle => {
      const matchesSearch =
        vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || vehicle.status === statusFilter;

      const matchesType =
        typeFilter === "All" || vehicle.type === typeFilter;

      const today = new Date();
      const serviceDate = new Date(vehicle.serviceDue);
      const diffDays = (serviceDate - today) / (1000 * 60 * 60 * 24);

      const matchesService =
        serviceFilter === "All" ||
        (serviceFilter === "Due Soon" && diffDays <= 14) ||
        (serviceFilter === "Overdue" && diffDays < 0);

      return matchesSearch && matchesStatus && matchesType && matchesService;
    });
  }, [search, statusFilter, typeFilter, serviceFilter]);

  return (
    <Layout>
      <style>{`
        .fleet-card {
          background: var(--zd-surface);
          border: 1px solid var(--zd-border);
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .fleet-card:hover {
          transform: translateY(-4px);
          border-color: var(--zd-primary);
        }
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.5rem;
        }
        .vehicle-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .input-field {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--zd-border);
          background: var(--zd-surface-alt);
          color: var(--zd-text);
        }
        .fuel-bar {
          height: 6px;
          border-radius: 6px;
          background: var(--zd-border);
          overflow: hidden;
        }
        .fuel-fill {
          height: 100%;
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
      `}</style>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h4 style={{ fontWeight: 900 }}>Fleet Management</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--zd-text-muted)" }}>
            Real-time operational oversight of all training vehicles.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Plus size={18} /> Add New Vehicle
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)", color: "#6b7280" }} />
          <input
            className="input-field"
            style={{ paddingLeft: 36, width: "100%" }}
            placeholder="Search by plate or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="input-field" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Maintenance</option>
          <option>Out of Service</option>
        </select>

        <select className="input-field" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option>All</option>
          <option>Sedan</option>
          <option>2-Tonne Truck</option>
        </select>

        <select className="input-field" value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
          <option>All</option>
          <option>Due Soon</option>
          <option>Overdue</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid-layout">
        {filteredVehicles.map(vehicle => {
          const fuelColor =
            vehicle.fuel > 60 ? "#22c55e" :
            vehicle.fuel > 30 ? "#f59e0b" : "#ef4444";

          return (
            <div key={vehicle.id} className="fleet-card">
              <img src={vehicle.image} className="vehicle-image" alt={vehicle.model} />

              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {vehicle.type === "Sedan" ? (
                      <Car size={18} color="#3b82f6" />
                    ) : (
                      <Truck size={18} color="#8b5cf6" />
                    )}
                    <h3 style={{ margin: 0, fontWeight: 800 }}>{vehicle.plate}</h3>
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="action-btn"><Edit size={16} color="#3b82f6" /></button>
                    <button className="action-btn"><Wrench size={16} color="#f59e0b" /></button>
                    <button className="action-btn"><AlertTriangle size={16} color="#ef4444" /></button>
                    <button className="action-btn"><Trash2 size={16} color="#ef4444" /></button>
                  </div>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--zd-text-muted)", marginBottom: 12 }}>
                  {vehicle.model}
                </div>

                {/* Service */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Calendar size={16} color="#6366f1" />
                  <span>Service: {vehicle.serviceDue}</span>
                </div>

                {/* Fuel */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Fuel size={14} color={fuelColor} /> Fuel Level
                    </span>
                    <span style={{ fontWeight: 700 }}>{vehicle.fuel}%</span>
                  </div>
                  <div className="fuel-bar">
                    <div
                      className="fuel-fill"
                      style={{ width: `${vehicle.fuel}%`, background: fuelColor }}
                    />
                  </div>
                </div>

                {/* Faults */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={14} color={vehicle.faults > 0 ? "#ef4444" : "#22c55e"} />
                  <span>
                    {vehicle.faults} Fault Record{vehicle.faults !== 1 && "s"}
                  </span>
                </div>
              </div>

              <div
                onClick={() => navigate(`/admin/fleet/${vehicle.id}`)}
                style={{
                  borderTop: "1px solid var(--zd-border)",
                  padding: "0.75rem 1.5rem",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "var(--zd-primary)",
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer"
                }}
              >
                View Vehicle Profile <ChevronRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}