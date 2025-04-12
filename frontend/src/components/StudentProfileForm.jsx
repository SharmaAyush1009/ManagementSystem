import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const StudentProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.username || "",
    rollNo: "",
    department: "",
    cpi: "",
    gender: "",
    status: "Pending Approval" // Default status
  });

  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  // Fetch current profile status on load
  useEffect(() => {
    const fetchProfileStatus = async () => {
      setStatusLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        const data = await res.json();
        
        if (res.ok) {
          // Check if there's a pending request
          setHasPendingRequest(data.status === "Pending Approval");
          
          // Update form with existing data
          if (data.profile) {
            setFormData(prev => ({
              ...prev,
              ...data.profile,
              status: data.status || "Pending Approval"
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching profile status:", err);
        setError("Failed to load profile status. Please try again.");
      } finally {
        setStatusLoading(false);
      }
    };

    fetchProfileStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ updates: formData })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setHasPendingRequest(true);
        setFormData(prev => ({
          ...prev,
          status: "Pending Approval"
        }));
        alert("Profile update request submitted. Awaiting admin approval.");
      } else {
        setError(data.message || "Failed to submit profile update.");
      }
    } catch (err) {
      console.error("Error submitting profile:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  // Determine button state and message
  const getButtonState = () => {
    if (loading) return { text: "Submitting...", disabled: true };
    if (formData.status === "Approved") return { text: "Profile Approved", disabled: true };
    if (hasPendingRequest) return { text: "Awaiting Approval", disabled: true };
    if (formData.status === "Rejected") return { text: "Resubmit Profile", disabled: false };
    return { text: "Submit Profile", disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Update Profile</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
        
        {statusLoading ? (
          <p className="text-center">Loading profile status...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Name" 
              className="border p-2 rounded" 
              disabled={hasPendingRequest || formData.status === "Approved"}
            />
            <input 
              type="text" 
              name="rollNo" 
              value={formData.rollNo} 
              onChange={handleChange} 
              placeholder="Roll No" 
              className="border p-2 rounded" 
              disabled={hasPendingRequest || formData.status === "Approved"}
            />
            <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              className="border p-2 rounded"
              disabled={hasPendingRequest || formData.status === "Approved"}
            >
              <option value="">Select Department</option>
              <option value="Mathematics and Computing">Mathematics and Computing</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
            </select>
            <input 
              type="number" 
              name="cpi" 
              value={formData.cpi} 
              onChange={handleChange} 
              placeholder="CPI" 
              className="border p-2 rounded" 
              disabled={hasPendingRequest || formData.status === "Approved"}
            />
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="border p-2 rounded"
              disabled={hasPendingRequest || formData.status === "Approved"}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            
            <div className={`text-sm p-2 rounded ${
              formData.status === "Approved" ? "bg-green-100 text-green-700" : 
              formData.status === "Rejected" ? "bg-red-100 text-red-700" : 
              "bg-yellow-100 text-yellow-700"
            }`}>
              Status: {hasPendingRequest ? "Pending Approval" : formData.status}
              {hasPendingRequest && <p className="text-xs mt-1">Your profile update request is awaiting admin approval.</p>}
              {formData.status === "Rejected" && <p className="text-xs mt-1">Your profile update was rejected. You can make changes and resubmit.</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={buttonState.disabled}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {buttonState.text}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentProfileForm;