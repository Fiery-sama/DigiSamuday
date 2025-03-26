// src/pages/admin/ViewComplaints.js
import { useState, useEffect } from "react";

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Admin is not logged in.");
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    console.log("Stored Token:", token);
    fetch("http://localhost:8000/api/complaints/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError("Failed to fetch complaints.");
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/api/complaints/${id}/update_status/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update complaint status.");
        }
        return response.json();
      })
      .then((data) => {
        setComplaints(
          complaints.map((complaint) =>
            complaint.id === id ? { ...complaint, status: newStatus } : complaint
          )
        );
        setUpdateMessage(`Complaint #${id} updated to ${newStatus}`);
        setTimeout(() => setUpdateMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error updating complaint:", error);
        alert("Error updating complaint.");
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin - Manage Complaints</h1>

      {updateMessage && <p className="text-green-500">{updateMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading complaints...</p>}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Resident</th>
            <th className="p-3 border">Complaint</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <tr key={complaint.id} className="border-b">
                <td className="p-3 border">{complaint.id}</td>
                <td className="p-3 border">{complaint.resident_name || "Unknown"}</td>
                <td className="p-3 border">{complaint.description}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      complaint.status === "resolved"
                        ? "bg-green-500"
                        : complaint.status === "in_progress"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="p-3 border">
                  {complaint.status !== "resolved" && (
                    <select
                      className="border p-2 rounded"
                      onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                    >
                      <option value="">Update Status</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No complaints found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewComplaints;