// src/pages/admin/ApproveBookings.js
import { useState, useEffect } from "react";

function ManageFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [facilityName, setFacilityName] = useState("");
  const [description, setDescription] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    fetch("http://localhost:8000/api/facilities/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch(() => setError("Failed to load facilities."));

    fetch("http://localhost:8000/api/facility-bookings/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch(() => setError("Failed to load bookings."));
  }, []);

  const handleFacilitySubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    fetch("http://localhost:8000/api/facilities/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        name: facilityName,
        description: description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setFacilities([...facilities, data]);
          setFacilityName("");
          setDescription("");
          setSuccessMessage("Facility created successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          setError("Failed to create facility.");
        }
      })
      .catch(() => setError("Error creating facility."));
  };

  const handleBookingApproval = (id, newStatus) => {
    const token = localStorage.getItem("token");
    const endpoint =
      newStatus === "approved"
        ? `http://localhost:8000/api/facility-bookings/${id}/approve/`
        : `http://localhost:8000/api/facility-bookings/${id}/reject/`;
  
    fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBookings(
          bookings.map((booking) =>
            booking.id === id ? { ...booking, status: newStatus } : booking
          )
        );
      })
      .catch(() => alert("Error updating booking status."));
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Facilities</h1>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleFacilitySubmit} className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Create New Facility</h2>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter facility name"
          value={facilityName}
          onChange={(e) => setFacilityName(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter facility description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Facility
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Pending Facility Bookings</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 border">Facility</th>
            <th className="p-3 border">Start Time</th>
            <th className="p-3 border">End Time</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="p-3 border">{booking.facility_name}</td>
              <td className="p-3 border">{new Date(booking.start_time).toLocaleString()}</td>
              <td className="p-3 border">{new Date(booking.end_time).toLocaleString()}</td>
              <td className="p-3 border">
                <span className={`px-2 py-1 rounded text-white ${
                  booking.status === "approved" ? "bg-green-500" : "bg-orange-500"
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="p-3 border">
                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleBookingApproval(booking.id, "approved")}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleBookingApproval(booking.id, "rejected")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageFacilities;