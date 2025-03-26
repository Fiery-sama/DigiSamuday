// src/pages/Complaints.js
import { useState, useEffect } from "react";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [newComplaintTitle, setNewComplaintTitle] = useState("");
  const [newComplaintDescription, setNewComplaintDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [residentId, setResidentId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    // Fetch user profile to get resident ID
    fetch("http://localhost:8000/api/user-profile/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setResidentId(data.id);
        } else {
          setError("Failed to fetch resident information");
        }
      })
      .catch(() => setError("Error fetching user profile"));

    // Fetch complaints
    fetch("http://localhost:8000/api/complaints/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }
        setComplaints(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load complaints.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComplaintTitle.trim() || !newComplaintDescription.trim() || !residentId) return;

    fetch("http://localhost:8000/api/complaints/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: newComplaintTitle,
        description: newComplaintDescription,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          console.error("Backend Error Response:", data);
          throw new Error(data.detail || "Failed to submit complaint");
        }
        return data;
      })
      .then((data) => {
        setComplaints([...complaints, data]);
        setNewComplaintTitle("");
        setNewComplaintDescription("");
        setSuccessMessage("Complaint submitted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        console.error("Complaint Submission Error:", err.message);
        setError(err.message);
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Resident Complaints</h1>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter complaint title..."
          value={newComplaintTitle}
          onChange={(e) => setNewComplaintTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter your complaint description..."
          value={newComplaintDescription}
          onChange={(e) => setNewComplaintDescription(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          disabled={!residentId}
        >
          Submit Complaint
        </button>
      </form>
      {loading && <p>Loading complaints...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="bg-white p-4 border rounded">
        {complaints.map((complaint) => (
          <li key={complaint.id} className="border-b p-2">
            <strong>{complaint.title}</strong>
            <p>{complaint.description}</p>
            <span className="text-sm text-gray-500">Status: {complaint.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Complaints;