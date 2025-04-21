import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./components/AuthContext";
import StudentDashboard from "./components/StudentDashboard";
import Scorecard from "./components/ScoreCard";
import StudentProfileForm from "./components/StudentProfileForm";
import PlacedStudents from "./components/PlacedStudents";
import AdminDashboard from "./components/AdminDashboard";
// import ScoreCardPage from "./components/ScoreCardPage";
import AdminLayout from "./components/AdminLayout";
import RequestsPage from "./components/RequestsPage";
import RequestDetails from "./components/RequestDetails";
import AddPlacement from "./components/AdminPlacement";
import AdminViewPlacements from "./components/AdminViewPlacements";
import AdminScorecard from "./components/AdminScorecard";

// RoleRoute component for role-based routing
const RoleRoute = ({ role, element}) => {
  const { role: userRole } = useAuth();
  return userRole === role ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Student Dashboard Route */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <RoleRoute role="student" element={<StudentDashboard />} />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <RoleRoute 
                    role="admin" 
                    element={<AdminLayout />} 
                  />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="scorecard" element={<AdminScorecard />} />
{/*               <Route path="placement" element={<AdminViewPlacements />} /> */}
              <Route path="requests" element={<RequestsPage />} />
              <Route path="requests/:id" element={<RequestDetails />} />
              <Route path="add-placement" element={<AddPlacement />} />
              <Route path="view-placements" element={<AdminViewPlacements />} />
            </Route>
            
            {/* Student Routes */}
            <Route 
              path="/scorecard" 
              element={
                <ProtectedRoute>
                  <RoleRoute role="student" element={<Scorecard />} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile-form" 
              element={
                <ProtectedRoute>
                  <RoleRoute role="student" element={<StudentProfileForm />} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/placed-students" 
              element={
                <ProtectedRoute>
                  <RoleRoute role="student" element={<PlacedStudents />} />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect based on role */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

// Component to handle home redirect based on role
const HomeRedirect = () => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return role === "admin" 
    ? <Navigate to="/admin" replace /> 
    : <Navigate to="/dashboard" replace />;
};

export default App;
