// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "./AuthContext"; 
// import axios from "axios";

// const Login = () => {
//   const [email, setEmail] = useState("");  //  Replace username with email
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login, isAuthenticated } = useAuth();

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/dashboard");
//     }
//   }, [isAuthenticated, navigate]);

//   // const handleLogin = async () => {
//   //   if (!username || !password) {
//   //     setError("Enter valid credentials");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.post("http://localhost:5000/api/auth/login", {
//   //       username,
//   //       password,
//   //     });

//   //     if (response.data.success) {
//   //       const userRole = response.data.role; // Get role from backend
//   //       login(username, userRole);
//   //       navigate("/dashboard");
//   //     } else {
//   //       setError(response.data.message || "Login failed!");
//   //     }
//   //   } catch (error) {
//   //     setError(error.response?.data?.message || "Server error!");
//   //   }
//   // };
//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError("Enter valid credentials");
//       return;
//     }
//   try{
//     const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       console.log("✅ Login Successful: ", data);  // 🐞 Debugging step
//       // localStorage.setItem("isAuthenticated", JSON.stringify(true)); // ✅ Store properly
//       //   localStorage.setItem("token", data.token);
//       //   localStorage.setItem("role", data.role);
//       //   localStorage.setItem("username", data.username);
//       //   navigate(data.role === "admin" ? "/admin" : "/dashboard");    // ✅ Use `navigate()` instead of `window.location.href`

//       // Replace these localStorage.setItem calls and navigate with your login function
//       // This is the key fix:
//       login(data.username, data.role, data.token);
      
//       // No need for navigate here - the login function handles it
//     } else {
//         setError(data.message);
//     }
//   } catch (error) {
//     setError("Server error!");
//   }
// };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-semibold mb-4">Login</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"  // ✅ Updated label
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-3 border border-gray-300 rounded-md"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-3 border border-gray-300 rounded-md"
//         />
//         <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 w-full rounded-md">
//           Login
//         </button>
//         <p className="mt-4 text-gray-600">
//           Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); //  New loading state
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      }, {
        headers: { "Content-Type": "application/json" },
        validateStatus: (status) => status < 500 // Consider 4xx responses as not errors
      });

      if (res.data.token) {
        login(res.data.username, res.data.role, res.data.token);
      } else {
        setError(res.data.message || "Authentication failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Connection error. Please try later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : "Sign In"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
          {/* <p className="mt-2">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;