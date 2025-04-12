import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; 

const Signup = () => {
  const [step, setStep] = useState(1); // Step 1: Register, Step 2: OTP Verification
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // **Handle Input Change**
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ** Handle Signup & Send OTP**
  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/send-otp`, formData);

      console.log("Server Response:", response.data); //  Debugging Step
      if (response.data.message.includes("OTP sent to email")) {
        alert("OTP sent to your email!");
        setStep(2);
        console.log("Step changed to:", step); // Debugging Step
      } else {
        setError(response.data.message || "Signup failed!");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Server error!");
    }
  };

  // ** Handle OTP Verification**
  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
      });

      if(response.data.msg === "Email verified successfully!") {
        alert("User verified successfully! Redirecting to login...");
        navigate("/login");
      } else {
        setError(response.data.msg || "Invalid OTP!");
      }
    } catch (error) {
      setError(error.response?.data?.msg || "Server error!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">
          {step === 1 ? "Sign Up" : "Verify OTP"}
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {step === 1 ? (
          // **Step 1: Signup Form**
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleSignup}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 w-full rounded-md transition-all duration-300 shadow-md"
            >
              Send OTP
            </button>
          </>
        ) : (
          // **Step 2: OTP Verification**
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-full rounded-md transition-all duration-300 shadow-md"
            >
              Verify OTP
            </button>
          </>
        )}

        <p className="mt-4 text-gray-600 text-center">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
