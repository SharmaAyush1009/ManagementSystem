import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Outlet /> {/* This will switch between AdminDashboard and ScoreCardPage */}
    </div>
  );
};

export default AdminLayout;
