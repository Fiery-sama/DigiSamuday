import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, Button } from "flowbite-react";

export default function Header() {
  const [role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
    setIsAuthenticated(!!localStorage.getItem("token")); // Check if token exists
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole("");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="w-full h-20">
    <Navbar fluid className="w-full fixed z-50 h-18 bg-zinc-800 text-white shadow-xl">
      <NavbarBrand href="/">
        <img src="/img/logo-digi-samuday-2.png" className="h-12 hover:brightness-150" alt="DigiSamuday" /> 
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
      {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="px-2 py-4 hover:text-red-600">Dashboard</Link>

              {/* Resident Links */}
              {role === "resident" && (
                <>
                  <Link to="/facility-booking" className="px-2 py-4 hover:text-red-600">Facility Booking</Link>
                  <Link to="/complaints" className="px-2 py-4 hover:text-red-600">Complaints</Link>
                  <Link to="/payments" className="px-2 py-4 hover:text-red-600">Payments</Link>
                </>
              )}

              {/* Admin Links */}
              {role === "admin" && (
                <>
                  <Link to="/admin/manage-residents" className="px-2 py-4 hover:text-red-600">Manage Residents</Link>
                  <Link to="/admin/view-complaints" className="px-2 py-4 hover:text-red-600">View Complaints</Link>
                  <Link to="/admin/approve-bookings" className="px-2 py-4 hover:text-red-600">Approve Bookings</Link>
                  <Link to="/admin/manage-payments" className="px-2 py-4 hover:text-red-600">Manage Payments</Link>
                  <Link to="/admin/notices" className="px-2 py-4 hover:text-red-600">Notices</Link>
                </>
              )}

              {/* Security Links */}
              {role === "security" && (
                <>
                  <Link to="/security/visitor-logs" className="px-2 py-4 hover:text-red-600">Visitor Logs</Link>
                </>
              )}
                <Link to="/profile" className="px-2 py-4 hover:text-red-600">Profile</Link>
              {/* Logout Button */}

              <Button
                onClick={handleLogout}
                color="failure"
                className="px-4 py-2 bg-red-600 text-red-50 rounded-sm shadow-md hover:bg-red-700 hover:shadow-lg hover:border hover:border-red-400 focus:outline-2 focus:outline-offset-2 focus:outline-red-500">
                  Logout
              </Button>
            </>
          ) : (
            <>
              <Button href="/login" className="px-4 py-2 bg-indigo-600 text-indigo-50 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg hover:border hover:border-indigo-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">Login</Button>
              <Button href="/register" color="failure" className="px-4 py-2 bg-red-600 text-red-50 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg hover:border hover:border-red-400 focus:outline-2 focus:outline-offset-2 focus:outline-red-500">Get started</Button>
            </>
          )}
      </NavbarCollapse>
    </Navbar>
    </div>
  );
}