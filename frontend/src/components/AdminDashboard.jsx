import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = ({ username = "Admin" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [placementCount, setPlacementCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const [pendingRes, approvedRes, placementRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/pending-requests`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/approved`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/placements`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setPendingCount(pendingRes.data?.length || 0);
        setApprovedCount(approvedRes.data?.length || 0);
        setPlacementCount(placementRes.data?.length || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#update-database-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 sm:py-12 sm:px-6 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Welcome, {username}!
        </h2>
        <p className="text-gray-500 text-center">Here's what's happening with your platform</p>
      </div>

      {/* Status Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-4xl mb-8 border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100 text-gray-700">
          System Overview
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Pending Requests Card */}
          <div 
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
            onClick={() => navigate("/admin/requests")}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-gray-500 text-sm font-medium">Profile Update Requests</h4>
                {loading ? (
                  <div className="h-7 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-[pulse_1.5s_infinite] mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold mt-1 text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {pendingCount}
                    <span className="text-sm font-normal text-gray-500 ml-1">pending</span>
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                pendingCount > 0 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Approved Students Card */}
          <div 
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
            onClick={() => navigate("/admin/scorecard")}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-gray-500 text-sm font-medium">Approved Student Profiles</h4>
                {loading ? (
                  <div className="h-7 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-[pulse_1.5s_infinite] mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold mt-1 text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {approvedCount}
                    <span className="text-sm font-normal text-gray-500 ml-1">total</span>
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center transition-colors group-hover:bg-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Placement Records Card */}
          <div 
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
            onClick={() => navigate("/admin/placement")}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-gray-500 text-sm font-medium">Placement Records</h4>
                {loading ? (
                  <div className="h-7 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-[pulse_1.5s_infinite] mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold mt-1 text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {placementCount}
                    <span className="text-sm font-normal text-gray-500 ml-1">total</span>
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center transition-colors group-hover:bg-purple-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
        {/* Check Requests Button */}
        <button
          onClick={() => navigate("/admin/requests")}
          className="relative px-6 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex-1 flex items-center justify-center group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-700 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
          <div className="relative z-10 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            Review Requests
          </div>
          {pendingCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-rose-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-rose-600 shadow-sm">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Update Database Section */}
        <div id="update-database-container" className="relative flex-1">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
            <div className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Manage Database
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {/* Dropdown Options */}
          <div className={`absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden transition-all duration-300 ${isDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}`}>
            <button
              onClick={() => {
                navigate("/admin/scorecard");
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Student Scorecards
            </button>
            <button
              onClick={() => {
                navigate("/admin/placement");
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors border-t border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Placement Records
            </button>
            <button
              onClick={() => {
                navigate("/admin/add-placement");
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors border-t border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Placement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;