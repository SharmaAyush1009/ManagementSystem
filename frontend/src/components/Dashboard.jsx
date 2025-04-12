import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import LoadingSpinner from "./LoadingSpinner";

const Dashboard = () => {
  const { isAuthenticated, role, user, isLoading } = useAuth();
  const location = useLocation(); //  Track where user came from

  if (isLoading) {
    return <LoadingSpinner fullScreen />; // Show spinner while checking auth
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />; // Smarter redirect
  }

  switch (role) {
    case "admin":
      return <AdminDashboard username={user?.username || "Administrator"} />;
    case "student":
      return <StudentDashboard username={user?.username || "Guest Student"} />;
    default:
      console.warn(`Unexpected role: ${role}`); // Debugging help
      return <Navigate to="/login" state={{ error: "invalid_role" }} replace />;
  }
};

export default Dashboard;