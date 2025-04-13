import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Card animation variants
  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-blue-600">{user?.username}</span>!
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Access your academic resources and placement information
          </p>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* ScoreCard */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer border border-gray-100"
            whileHover="hover"
            variants={cardVariants}
            onClick={() => navigate("/scorecard")}
          >
            <div className="p-6 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">ScoreCard</h3>
              <p className="text-gray-500 text-sm text-center">View academic performance and grades</p>
            </div>
          </motion.div>

          {/* Placed Students */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer border border-gray-100"
            whileHover="hover"
            variants={cardVariants}
            onClick={() => navigate("/placed-students")}
          >
            <div className="p-6 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Placed Students</h3>
              <p className="text-gray-500 text-sm text-center">See where your peers have been placed</p>
            </div>
          </motion.div>
        </div>

        {/* Profile Completion CTA */}
        <div className="text-center">
          <motion.button
            onClick={() => navigate("/profile-form")}
            className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Complete Your Profile
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
          <p className="mt-3 text-sm text-gray-500">
            Complete your profile to access all features
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
