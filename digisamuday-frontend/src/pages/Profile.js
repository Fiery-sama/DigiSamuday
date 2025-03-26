// src/pages/Profile.js
import { useState, useEffect } from "react";

function Profile() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    fetch("http://localhost:8000/api/user-profile/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setEmail(data.email);
          setPhoneNumber(data.phone_number);
          setApartmentNumber(data.apartment_no);
        } else {
          throw new Error("Invalid user data");
        }
      })
      .catch(() => setError("Failed to fetch user details"));
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    fetch("http://localhost:8000/api/update-profile/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("Profile updated successfully!");
          setTimeout(() => setMessage(null), 3000);
        } else {
          setError(data.error || "Failed to update profile");
        }
      })
      .catch((err) => setError("Error updating profile. Please try again."));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleUpdateProfile} className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-200"
            value={username}
            disabled          
            />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">First Name*</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email*</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number*</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Apartment Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-200"
            value={apartmentNumber}
            disabled
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;
