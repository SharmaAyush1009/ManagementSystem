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

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/placements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlacements(response.data);
    } catch (error) {
      setError("Failed to load placement data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ branch: "", batch: "", search: "" });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/placements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlacements(placements.filter(p => p._id !== id));
      setDeleteStatus({ success: "Record deleted successfully", error: "" });
      setConfirmDelete(null);
      setTimeout(() => setDeleteStatus({ success: "", error: "" }), 3000);
    } catch (error) {
      setDeleteStatus({ 
        error: error.response?.data?.message || "Failed to delete record",
        success: "" 
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

  const handleSubmitEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/placements/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlacements(placements.map(p => p._id === id ? { ...p, ...formData } : p));
      setDeleteStatus({ success: "Record updated successfully", error: "" });
      setEditingPlacement(null);
      setTimeout(() => setDeleteStatus({ success: "", error: "" }), 3000);
    } catch (error) {
      setDeleteStatus({ 
        error: error.response?.data?.message || "Failed to update record",
        success: "" 
      });
    }
  };

  // Get unique values for filters
  const uniqueBatches = [...new Set(placements.map(p => p.batch))].sort((a, b) => b - a);
  const uniqueBranches = [...new Set(placements.map(p => p.branch))].sort();

  // Apply filters and sort
  const filteredPlacements = placements.filter(p => {
    return (
      (filters.branch === "" || p.branch === filters.branch) &&
      (filters.batch === "" || p.batch.toString() === filters.batch) &&
      (filters.search === "" || 
       p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
       p.company.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }).sort((a, b) => a._id > b._id ? -1 : 1);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Placement Records</h1>
            <p className="text-gray-600">Manage student placement data</p>
          </div>
          <Link 
            to="/admin/add-placement"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Placement
          </Link>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        {deleteStatus.success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{deleteStatus.success}</p>
          </div>
        )}
        {deleteStatus.error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{deleteStatus.error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="font-medium text-gray-700 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Name or company"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              <select
                name="batch"
                value={filters.batch}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredPlacements.length} of {placements.length} records
          </p>
        </div>

        {/* Placement Records */}
        {filteredPlacements.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">No records found</h3>
            <p className="mt-1 text-gray-500">
              {filters.branch || filters.batch || filters.search 
                ? "Try adjusting your filters" 
                : "Add a new placement to get started"}
            </p>
            <Link 
              to="/admin/add-placement"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Add Placement
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlacements.map(placement => (
              <div key={placement._id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                {editingPlacement === placement._id ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-700">Edit Placement</h3>
                      <button 
                        onClick={() => setEditingPlacement(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                        <input
                          type="number"
                          name="batch"
                          value={formData.batch}
                          onChange={(e) => setFormData({...formData, batch: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                        <select
                          name="branch"
                          value={formData.branch}
                          onChange={(e) => setFormData({...formData, branch: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                        >
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
                          onChange={(e) => setFormData({...formData, package: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPI</label>
                        <input
                          type="number"
                          step="0.01"
                          name="cpi"
                          value={formData.cpi}
                          onChange={(e) => setFormData({...formData, cpi: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingPlacement(null)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitEdit(placement._id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ${
                        placement.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'
                      }`}>
                        {placement.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{placement.name}</h3>
                            <p className="text-sm text-gray-600">{placement.company}</p>
                          </div>
                          <span className="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                            {placement.package} LPA
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Batch:</span>
                            <p>{placement.batch}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Branch:</span>
                            <p>{placement.branch}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">CPI:</span>
                            <p>{placement.cpi}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(placement)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(placement._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                    {confirmDelete === placement._id && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-700 mb-2">Are you sure you want to delete this record?</p>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(placement._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                          >
                            Confirm Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminViewPlacements;
