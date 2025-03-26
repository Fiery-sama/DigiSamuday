// src/pages/Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhone] = useState("");
  const [apartment_no, setApartment] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, phone_number, apartment_no, role }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={phone_number}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>          
          <div className="mb-4">
            <label className="block text-gray-700">Apartment Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={apartment_no}
              onChange={(e) => setApartment(e.target.value)}
              required
            />
          </div>          
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select value={role} name="role" onChange={(e) => setRole(e.target.value)}  class="w-full p-2 border rounded" required>
              <option disabled value="">Select...</option>
              <option value="resident">Resident</option>
              <option value="admin">Admin</option>
              <option value="security">Security</option>
            </select>
          </div>          
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <a href="/" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
