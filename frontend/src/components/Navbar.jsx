import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import logo from "../logo.jpg";
import { useState } from "react";
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, role, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full transition-transform duration-300 group-hover:scale-110" 
              />
              <span className="text-xl sm:text-2xl font-bold ml-2 transition-all duration-300 group-hover:text-blue-300">
                Management System
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {isAuthenticated && (
                <>
                  {role === "admin" && (
                    <Link 
                      to="/admin" 
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
                    >
                      Home
                    </Link>
                  )}
                  
                  {role === "student" && (
                    <Link 
                      to="/dashboard" 
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout} 
                    className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6 text-red-400" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated ? (
            <>
              {role === "admin" && (
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              {role === "student" && (
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Student Dashboard
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="block px-3 py-2 rounded-md text-base font-medium text-green-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

