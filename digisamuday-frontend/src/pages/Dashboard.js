import { useState, useEffect } from "react";

function Dashboard() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }
  
    // Fetch user profile
    fetch("http://localhost:8000/api/user-profile/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username);
          setRole(data.role);  // ✅ Fix: Ensure role is properly set
        } else {
          throw new Error("Invalid user data");
        }
      })
      .catch(() => setError("Failed to fetch user details"));
  
    // Fetch notices
    fetch("http://localhost:8000/api/notices/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }
        setNotices(data.slice(0, 5));
      })
      .catch((err) => setError(`Error fetching notices: ${err.message}`));
  
    // Fetch complaints
    fetch("http://localhost:8000/api/complaints/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }
        setComplaints(data.slice(0, 5));
      })
      .catch((err) => setError(`Error fetching complaints: ${err.message}`));
  }, []);  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      <p className="text-lg text-gray-700 mb-4">👋 Welcome, <span className="font-semibold">{username}</span>!</p>
      
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">📢 Notice Board</h2>
        {notices.length > 0 ? (
          <ul className="list-disc ml-5">
            {notices.map((notice, index) => (
              <li key={index} className="mb-1">
                <strong>{notice.title}:</strong> {notice.content}
                <span className="text-gray-500 text-sm"> ({notice.date})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notices available.</p>
        )}
      </div>
      
      <div className="bg-red-100 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">📌 Submitted Complaints</h2>
        {complaints.length > 0 ? (
          <ul className="list-disc ml-5">
            {complaints.map((complaint, index) => (
              <li key={index} className="mb-1">
                <strong>{complaint.title}:</strong> {complaint.description}
                <span className="text-gray-500 text-sm"> (Status: {complaint.status})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No complaints submitted.</p>
        )}
      </div>
      
      {role === "resident" && (
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Resident Panel</h2>
          <p>Welcome, {username}! Manage your bookings, payments, and complaints.</p>
          <ul className="list-disc ml-5 mt-2">
            <li>📅 <a href="/facility-booking" className="text-blue-500">Book a Facility</a></li>
            <li>💳 <a href="/payments" className="text-blue-500">Make a Payment</a></li>
            <li>📢 <a href="/complaints" className="text-blue-500">Lodge a Complaint</a></li>
          </ul>
        </div>
      )}

      {role === "admin" && (
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
          <p>Welcome, {username}! Manage residents, complaints, bookings, and notices.</p>
          <ul className="list-disc ml-5 mt-2">
            <li>👥 <a href="/admin/manage-residents" className="text-green-500">Manage Residents</a></li>
            <li>📝 <a href="/admin/view-complaints" className="text-green-500">View Complaints</a></li>
            <li>✅ <a href="/admin/approve-bookings" className="text-green-500">Approve Facility Bookings</a></li>
            <li>📜 <a href="/admin/notices" className="text-green-500">Manage Notices</a></li>
          </ul>
        </div>
      )}
      
      {role === "security" && (
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Security Panel</h2>
          <p>Welcome, {username}! Monitor visitor logs and maintain security records.</p>
          <ul className="list-disc ml-5 mt-2">
            <li>📋 <a href="/security/visitor-logs" className="text-yellow-500">View Visitor Logs</a></li>
          </ul>
        </div>
      )}
      
      {!role && (
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Unauthorized</h2>
          <p>You are not logged in. Please <a href="/login" className="text-red-500">Login</a>.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;