import { useState, useEffect } from "react";
import axios from "axios";
import { FiFilter, FiUser, FiBook, FiAward, FiCalendar, FiRefreshCw } from "react-icons/fi";
import { FaChalkboardTeacher, FaVenusMars, FaSchool } from "react-icons/fa6";

const Scorecard = () => {
  const [filters, setFilters] = useState({
    department: "",
    gender: "",
    batch: "",
    search: ""
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    filtered: 0,
    averageCPI: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/get-approved-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.students) {
        setStudents(res.data.students);
        calculateStats(res.data.students);
      } else {
        setError("Failed to load student data");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentList) => {
    const total = studentList.length;
    const filtered = filteredStudents.length;
    const averageCPI = total > 0 
      ? (studentList.reduce((sum, student) => sum + parseFloat(student.profile.cpi || 0), 0) / total).toFixed(2)
      : 0;
    
    setStats({ total, filtered, averageCPI });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const resetFilters = () => {
    setFilters({
      department: "",
      gender: "",
      batch: "",
      search: ""
    });
  };

  const filteredStudents = students.filter(student => {
    return (
      (filters.department === "" || student.profile.department === filters.department) &&
      (filters.gender === "" || student.profile.gender === filters.gender) &&
      (filters.batch === "" || student.profile.rollNo?.startsWith(filters.batch)) &&
      (filters.search === "" || 
        student.profile.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.profile.rollNo?.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  useEffect(() => {
    calculateStats(students);
  }, [filters, students]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Loading student data...</p>
    </div>
  );

  // Get unique departments and batches for filters
  const uniqueDepartments = [...new Set(students.map(s => s.profile.department))].filter(Boolean);
  const uniqueBatches = [...new Set(students.map(s => s.profile.rollNo?.substring(0, 2)))].filter(Boolean).sort().reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Student Scorecards</h1>
          <p className="text-blue-100">View and analyze student academic performance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiUser className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiAward className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Average CPI</p>
              <p className="text-2xl font-bold">{stats.averageCPI}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FiFilter className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Currently Showing</p>
              <p className="text-2xl font-bold">{stats.filtered}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FiFilter className="mr-2" /> Filters
            </h2>
            <button 
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiRefreshCw className="mr-1" /> Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Name or Roll No"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaSchool className="mr-1" /> Department
              </label>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaVenusMars className="mr-1" /> Gender
              </label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiCalendar className="mr-1" /> Batch
              </label>
              <select
                name="batch"
                value={filters.batch}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Batches</option>
                {uniqueBatches.map(batch => (
                  <option key={batch} value={batch}>20{batch}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Student Cards */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No student profiles found</h3>
            <p className="mt-2 text-sm text-gray-500">There are currently no approved student profiles to display.</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No matching students</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    {student.profile.photo ? (
                      <img 
                        src={student.profile.photo} 
                        alt={`${student.profile.name}'s profile`} 
                        className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-blue-100" 
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-4 border-2 border-blue-100">
                        <span className="text-xl font-medium text-blue-800">{student.profile.name?.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.profile.name}</h3>
                      <p className="text-sm text-gray-500">Roll No: {student.profile.rollNo}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaSchool className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{student.profile.department}</span>
                    </div>
                    <div className="flex items-center">
                      <FiAward className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">CPI: <span className="font-medium">{student.profile.cpi}</span></span>
                    </div>
                    <div className="flex items-center">
                      <FaVenusMars className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{student.profile.gender || "Not specified"}</span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Batch: 20{student.profile.rollNo?.substring(0, 2)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t">
                  <div className="flex justify-between items-center">
                    {/* <span className="text-xs text-gray-500">Last updated</span> */}
                    {/* <span className="text-xs font-medium text-blue-600">View Details</span> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scorecard;