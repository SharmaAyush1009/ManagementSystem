import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("isAuthenticated") || "false");
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");

    if (storedAuth && storedRole && storedToken) {
      setIsAuthenticated(true);
      setRole(storedRole);
      setUser({ username: storedUsername });
    } else {
      setIsAuthenticated(false);
      setRole(null);
      setUser(null);
    }
  }, []);

  const login = (username, userRole, token) => {
    console.log(" Logging in:", { username, userRole, token });

    localStorage.setItem("isAuthenticated", JSON.stringify(true));
    localStorage.setItem("role", userRole);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);

    setIsAuthenticated(true);
    setRole(userRole);
    setUser({ username });

    navigate(userRole === "admin" ? "/admin" : "/dashboard");
  };

  //  Added Logout Function
  const logout = () => {
    console.log(" Logging out...");

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    setIsAuthenticated(false);
    setRole(null);
    setUser(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
