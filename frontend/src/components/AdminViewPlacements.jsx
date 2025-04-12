import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminViewPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteStatus, setDeleteStatus] = useState({ success: "", error: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filters, setFilters] = useState({
    branch: "",
    batch: "",
    search: ""
  });
  const [editingPlacement, setEditingPlacement] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    branch: "",
    company: "",
    package: "",
    cpi: "",
    gender: ""
  });

  // Fetch placements data
  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/placements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPlacements(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching placement data:", error);
      setError("Failed to load placement data. Please try again.");
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      branch: "",
      batch: "",
      search: ""
    });
  };

  const handleDelete = async (id) => {
    try {
      setDeleteStatus({ success: "", error: "" });
      const token = localStorage.getItem("token");
      
      if (!token) {
        setDeleteStatus({ success: "", error: "Authentication token not found. Please login again." });
        return;
      }
      
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/placements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the placements list after successful deletion
      setPlacements(placements.filter(placement => placement._id !== id));
      setDeleteStatus({ success: "Placement record deleted successfully.", error: "" });
      setConfirmDelete(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteStatus({ success: "", error: "" });
      }, 3000);
    } catch (error) {
      console.error("Error deleting placement:", error);
      setDeleteStatus({ 
        success: "", 
        error: error.response?.data?.message || "Failed to delete placement record." 
      });
    }
  };

  const handleEdit = (placement) => {
    setEditingPlacement(placement._id);
    setFormData({
      name: placement.name,
      batch: placement.batch,
      branch: placement.branch,
      company: placement.company,
      package: placement.package,
      cpi: placement.cpi,
      gender: placement.gender
    });
  };

  const handleCancelEdit = () => {
    setEditingPlacement(null);
    setFormData({
      name: "",
      batch: "",
      branch: "",
      company: "",
      package: "",
      cpi: "",
      gender: ""
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async (id) => {
    try {
      setDeleteStatus({ success: "", error: "" });
      const token = localStorage.getItem("token");
      
      if (!token) {
        setDeleteStatus({ success: "", error: "Authentication token not found. Please login again." });
        return;
      }

      // Add a new PUT route in your backend to handle updates
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/placements/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the placements list after successful edit
      setPlacements(placements.map(placement => 
        placement._id === id ? { ...placement, ...formData } : placement
      ));
      
      setDeleteStatus({ success: "Placement record updated successfully.", error: "" });
      setEditingPlacement(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteStatus({ success: "", error: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating placement:", error);
      setDeleteStatus({ 
        success: "", 
        error: error.response?.data?.message || "Failed to update placement record." 
      });
    }
  };

  // Get unique batches for filter
  const uniqueBatches = [...new Set(placements.map(p => p.batch))].sort((a, b) => b - a);

  // Get unique branches for filter
  const uniqueBranches = [...new Set(placements.map(p => p.branch))].sort();

  // Apply filters
  const filteredPlacements = placements.filter(p => {
    const matchesBranch = filters.branch === "" || p.branch === filters.branch;
    const matchesBatch = filters.batch === "" || p.batch.toString() === filters.batch;
    const matchesSearch = filters.search === "" || 
      p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.company.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesBranch && matchesBatch && matchesSearch;
  });

  // Sort by newest first (based on _id which contains timestamp)
  const sortedPlacements = [...filteredPlacements].sort((a, b) => {
    return a._id > b._id ? -1 : 1;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Placement Records</h1>
            <p className="text-gray-500">Manage all student placement data</p>
          </div>
          <Link 
            to="/admin/add-placement" 
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-2 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Placement
          </Link>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {deleteStatus.success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{deleteStatus.success}</span>
          </div>
        )}

        {deleteStatus.error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            <span>{deleteStatus.error}</span>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Name or company..."
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              <select
                name="batch"
                value={filters.batch}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
              >
                <option value="">All Batches</option>
                {uniqueBatches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
              >
                <option value="">All Branches</option>
                {uniqueBranches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Placements Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">
              {sortedPlacements.length === 0 ? 
                "No records found" : 
                `Showing ${sortedPlacements.length} of ${placements.length} records`
              }
            </h2>
            {sortedPlacements.length > 0 && (
              <div className="text-sm text-gray-500">
                Sorted by: <span className="font-medium">Newest First</span>
              </div>
            )}
          </div>

          {sortedPlacements.length === 0 ? (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-700">No placement records found</h3>
              <p className="mt-1 text-gray-500">
                {filters.branch !== "" || filters.batch !== "" || filters.search !== "" ? 
                  "Try adjusting your filters" : 
                  "Add a new placement record to get started"
                }
              </p>
              {filters.branch !== "" || filters.batch !== "" || filters.search !== "" ? (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Clear all filters
                </button>
              ) : (
                <Link 
                  to="/admin/add-placement" 
                  className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Placement
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedPlacements.map((placement) => (
                    <tr key={placement._id} className="hover:bg-gray-50 transition">
                      {editingPlacement === placement._id ? (
                        // Edit Form Row
                        <td colSpan="5" className="px-6 py-4">
                          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-gray-700">Edit Placement Record</h3>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleFormChange}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input
                                  type="text"
                                  name="company"
                                  value={formData.company}
                                  onChange={handleFormChange}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                                <input
                                  type="number"
                                  name="batch"
                                  value={formData.batch}
                                  onChange={handleFormChange}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                <select
                                  name="branch"
                                  value={formData.branch}
                                  onChange={handleFormChange}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                >
                                  <option value="">Select Branch</option>
                                  {uniqueBranches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Package (LPA)</label>
                                <input
                                  type="number"
                                  name="package"
                                  value={formData.package}
                                  onChange={handleFormChange}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CPI</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  name="cpi"
                                  value={formData.cpi}
                                  onChange={handleFormChange}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                  name="gender"
                                  value={formData.gender}
                                  onChange={handleFormChange}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end mt-6 space-x-3">
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition flex items-center gap-2"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSubmitEdit(placement._id)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        // Normal Row Display
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                                placement.gender === 'Female' ? 'bg-pink-500' : 
                                placement.gender === 'Male' ? 'bg-blue-500' : 'bg-purple-500'
                              }`}>
                                {placement.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{placement.name}</div>
                                <div className="text-sm text-gray-500">CPI: {placement.cpi}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Batch {placement.batch}</div>
                            <div className="text-sm text-gray-500">{placement.branch}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{placement.company}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                              {placement.package} LPA
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {confirmDelete === placement._id ? (
                              <div className="flex items-center justify-end space-x-4">
                                <span className="text-sm text-gray-500">Are you sure?</span>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDelete(placement._id)}
                                  className="text-red-600 hover:text-red-900 font-medium flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end space-x-4">
                                <button
                                  onClick={() => handleEdit(placement)}
                                  className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(placement._id)}
                                  className="text-red-600 hover:text-red-900 flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default AdminViewPlacements;