// src/pages/FacilityBooking.js
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function FacilityBooking() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    fetch("http://localhost:8000/api/facility-bookings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        facility_name: selectedFacility,
        start_time: startTime,
        end_time: endTime,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setBookings([...bookings, data]);
          setSuccessMessage("Booking request submitted successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          setError("Failed to book facility.");
        }
      })
      .catch(() => setError("Error submitting booking request."));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Facility Booking</h1>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleBookingSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Request a Facility Booking</h2>
        <select
          className="w-full p-2 border rounded mb-2"
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          required
        >
          <option value="">Select Facility</option>
          {facilities.map((facility) => (
            <option key={facility.id} value={facility.name}>{facility.name}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded mb-2"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="w-full p-2 border rounded mb-2"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Booking
        </button>
      </form>
      
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={bookings.map((booking) => ({
          title: booking.facility_name,
          start: booking.start_time,
          end: booking.end_time,
          color: booking.status === "approved" ? "green" : "orange", // Pending bookings in orange
        }))}
      />
    </div>
  );
}

export default FacilityBooking;