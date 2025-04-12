import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">
        Welcome to Dashboard <span className="text-blue-500">{user?.username}</span>!
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* ScoreCard */}
        <div
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer"
          onClick={() => navigate("/scorecard")}
        >
          <h3 className="text-xl font-semibold text-center">ScoreCard</h3>
        </div>

        {/* Placed Students */}
        <div
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer"
          onClick={() => navigate("/placed-students")}
        >
          <h3 className="text-xl font-semibold text-center">Placed Students</h3>
        </div>
      </div>
      <div className="mt-6">
  <button
    onClick={() => navigate("/profile-form")}
    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
  >
    Complete Your Profile
  </button>
</div>
    </div>
  );
};

export default StudentDashboard;
