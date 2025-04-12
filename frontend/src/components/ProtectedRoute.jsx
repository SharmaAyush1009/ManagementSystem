import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import the auth hook

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Ensure only students access student routes
  if (role === "student" && window.location.pathname.startsWith("/admin")) {
    return <Navigate to="/dashboard" />;
  }
  
  // Ensure only admins access admin routes
  if (role === "admin" && !window.location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" />;
  }
  
  return children;
}

export default ProtectedRoute;