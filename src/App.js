import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute, { getRoleDashboard } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import './App.css';
import './index.css';

// Pages
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminApprovals from "./pages/admin/AdminApprovals";
import FleetManagementPage from "./pages/admin/FleetManagementPage";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorSchedule from "./pages/instructor/InstructorSchedule";
import InstructorLessons from "./pages/instructor/InstructorLessons";
import InstructorNotifications from "./pages/instructor/InstructorNotifications";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentsPage from "./pages/admin/ManageStudents";
import InstructorsPage from "./pages/ManageInstructors";
import InstructorDetails from "./pages/InstructorProfile";
import BookLesson from "./pages/student/BookLesson";
import LessonBalance from "./pages/student/LessonBalance";
import Notifications from "./pages/Notifications";
import ChangeRequests from "./pages/instructor/ChangeRequests";


// Placeholder for unbuilt pages
function Placeholder({ title }) {
  const { theme } = useAuth();
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center py-5"
      style={{ minHeight: 400, color: "var(--zd-text-muted)" }}
    >
      <div
        className="rounded-3 p-4 text-center"
        style={{
          background: "var(--zd-surface)",
          border: "2px dashed var(--zd-border)",
          maxWidth: 360,
        }}
      >
        <div
          className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{ width: 56, height: 56, background: `${theme?.primary}18` }}
        >
          <span style={{ fontSize: "1.4rem" }}>🚧</span>
        </div>
        <h6 style={{ color: "var(--zd-text)", fontWeight: 700 }}>{title}</h6>
        <p style={{ fontSize: "0.82rem" }}>This page is under construction.</p>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <ProtectedRoute>
      <Layout>
        <Placeholder title={title} />
      </Layout>
    </ProtectedRoute>
  );
}

// Root redirect — must be a component so hooks work correctly
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboard(user.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />


          {/* ── Admin routes ─────────────────────────────── */}
          {/* <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/admin/students" element={<StudentsPage title="Students Management" />} />
          <Route path="/admin/instructors" element={<InstructorsPage title="Instructors Management" />} />
          <Route path="/admin/instructor-profile" element={<InstructorDetails title="Instructors Management" />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage title="Bookings Management" />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage title="Payments & Balances" />} />
          <Route path="/admin/approvals" element={<AdminApprovals title="Approvals Queue" />} />
          <Route path="/admin/fleet-management" element={<FleetManagementPage title="Fleet Management" />} />
          <Route path="/admin/settings" element={<PlaceholderPage title="System Settings" />} />



          {/* ── Instructor routes ─────────────────────────── */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute roles={["instructor"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/instructor/schedule" element={<InstructorSchedule title="My Schedule" />} />
          <Route path="/instructor/lessons" element={<InstructorLessons title="Lessons" />} />
          <Route path="/instructor/change-requests" element={<ChangeRequests title="Change Requests" />} />
          <Route path="/instructor/notifications" element={<InstructorNotifications title="Driver Notifications" />} />

          {/* ── Student routes ────────────────────────────── */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/student/book" element={<BookLesson title="Book a Lesson" />} />
          <Route path="/student/schedule" element={<LessonBalance title="My Schedule" />} />
          <Route path="/student/balance" element={<LessonBalance title="Lesson Balance" />} />
          <Route path="/student/notifications" element={<Notifications title="Notifications" />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}