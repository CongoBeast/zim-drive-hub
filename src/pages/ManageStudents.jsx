import React, { useState, useMemo } from "react";
import { 
  Search, Plus, Filter, MoreVertical, 
  Trash2, Edit2, Phone, GraduationCap, 
  BookOpen, CheckCircle2 
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

// Initial Mock Data
const INITIAL_STUDENTS = [
  { id: 1, name: "Rudo Kambarami", phone: "+263 77 123 4567", licenseClass: "Class 1", paid: 15, used: 10 },
  { id: 2, name: "Takudzwa Ndoro", phone: "+263 71 987 6543", licenseClass: "Class 2", paid: 10, used: 2 },
  { id: 3, name: "Farai Zimba", phone: "+263 78 444 5555", licenseClass: "Class 1", paid: 20, used: 20 },
];

export default function StudentsPage() {
  const { theme } = useAuth();
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", phone: "", licenseClass: "Class 1", paid: 0, used: 0
  });

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.phone.includes(searchTerm);
      const matchesClass = filterClass === "All" || s.licenseClass === filterClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, filterClass]);

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      setFormData({ name: "", phone: "", licenseClass: "Class 1", paid: 0, used: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...formData, id: s.id } : s));
    } else {
      setStudents([...students, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <Layout>
      <style>{`
        .zd-card { background: var(--zd-surface); border: 1px solid var(--zd-border); border-radius: 14px; padding: 1.25rem; }
        .controls-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; }
        
        .search-input-wrapper { 
          position: relative; flex: 1; min-width: 250px; 
        }
        .search-input-wrapper input {
          width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem;
          border-radius: 10px; border: 1px solid var(--zd-border);
          background: var(--zd-surface-alt); color: var(--zd-text);
          outline: none; transition: border-color 0.2s;
        }
        .search-input-wrapper input:focus { border-color: var(--zd-primary); }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--zd-text-muted); }

        .zd-select {
          padding: 0.6rem 1rem; border-radius: 10px; 
          border: 1px solid var(--zd-border); background: var(--zd-surface-alt);
          color: var(--zd-text); outline: none; cursor: pointer;
        }

        .btn-primary {
          background: var(--zd-primary); color: white; border: none;
          padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 600;
          display: flex; align-items: center; gap: 8px; cursor: pointer;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); 
          display: flex; align-items: center; justify-content: center; z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: var(--zd-surface); width: 100%; max-width: 450px;
          border-radius: 16px; padding: 2rem; border: 1px solid var(--zd-border);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--zd-text-muted); }
        .form-group input, .form-group select {
          width: 100%; padding: 0.7rem; border-radius: 8px; 
          border: 1px solid var(--zd-border); background: var(--zd-surface-alt); color: var(--zd-text);
        }

        .lessons-calc {
          background: var(--zd-surface-alt); padding: 0.75rem; border-radius: 8px;
          margin-top: 0.5rem; border: 1px dashed var(--zd-border);
          display: flex; justify-content: space-between; font-weight: 700; font-size: 0.85rem;
        }

        .action-icon-btn {
          padding: 6px; border-radius: 6px; border: none; background: transparent;
          color: var(--zd-text-muted); cursor: pointer; transition: 0.2s;
        }
        .action-icon-btn:hover { background: var(--zd-surface-alt); color: var(--zd-primary); }
        .btn-delete:hover { color: #ef4444; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h4 style={{ fontWeight: 900, fontSize: "1.45rem", color: "var(--zd-text)", margin: 0 }}>Student Directory</h4>
          <p style={{ color: "var(--zd-text-muted)", fontSize: "0.875rem", margin: 0 }}>Manage enrollments and lesson tracking.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="zd-card">
        {/* Search and Filters */}
        <div className="controls-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="zd-select" 
            value={filterClass} 
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="All">All Classes</option>
            <option value="Class 1">Class 1 (Heavy)</option>
            <option value="Class 2">Class 2 (Light)</option>
          </select>
        </div>

        {/* Students Table */}
        <div className="zd-table-wrap">
          <table className="zd-table">
            <thead>
              <tr>
                <th>Student Info</th>
                <th>License</th>
                <th>Lessons Paid</th>
                <th>Remaining</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--zd-text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Phone size={10} /> {s.phone}
                    </div>
                  </td>
                  <td>
                    <span className="zd-badge" style={{ background: `${theme?.primary}15`, color: "var(--zd-primary)" }}>
                      {s.licenseClass}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{s.paid}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ 
                        fontWeight: 700, 
                        color: (s.paid - s.used) <= 2 ? "#ef4444" : "var(--zd-text)" 
                      }}>
                        {s.paid - s.used}
                      </span>
                      {(s.paid - s.used) === 0 && <CheckCircle2 size={14} color="#22c55e" />}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="action-icon-btn" onClick={() => handleOpenModal(s)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="action-icon-btn btn-delete" onClick={() => deleteStudent(s.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--zd-text-muted)" }}>
              No students found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 1.5rem 0", fontWeight: 800 }}>
              {editingStudent ? "Edit Student" : "Register New Student"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  required
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  required
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+263..."
                />
              </div>
              <div className="form-group">
                <label>License Class</label>
                <select 
                  value={formData.licenseClass} 
                  onChange={e => setFormData({...formData, licenseClass: e.target.value})}
                >
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Lessons Paid</label>
                  <input 
                    type="number" min="0"
                    value={formData.paid} 
                    onChange={e => setFormData({...formData, paid: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Lessons Used</label>
                  <input 
                    type="number" min="0"
                    value={formData.used} 
                    onChange={e => setFormData({...formData, used: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="lessons-calc">
                <span style={{ color: "var(--zd-text-muted)" }}>Lessons Remaining:</span>
                <span style={{ color: "var(--zd-primary)" }}>{formData.paid - formData.used}</span>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button 
                  type="button" 
                  className="zd-view-all-btn" 
                  style={{ flex: 1, padding: "0.75rem" }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 2, justifyContent: "center" }}
                >
                  {editingStudent ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}