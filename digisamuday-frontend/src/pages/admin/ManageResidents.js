import { useState, useEffect } from "react";

function ManageResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingResident, setEditingResident] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:8000/api/residents/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch residents. Check authentication.");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setResidents(data);
        } else {
          setError("Unexpected response format.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load residents.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      fetch(`http://localhost:8000/api/residents/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
        .then((response) => {
          if (response.ok) {
            setResidents(residents.filter((resident) => resident.id !== id));
          } else {
            alert("Failed to delete resident.");
          }
        })
        .catch(() => alert("Error deleting resident."));
    }
  };

  const handleEdit = (resident) => {
    setEditingResident(resident);
    setUpdatedData({
      username: resident.username || "",
      email: resident.email || "",
      phone_number: resident.phone_number || "",
      apartment_no: resident.apartment_no || "",
    });
  };

  const handleUpdate = (id) => {
    fetch(`http://localhost:8000/api/residents/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        setResidents(residents.map((res) => (res.id === id ? data : res)));
        setEditingResident(null);
      })
      .catch(() => alert("Error updating resident."));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Residents</h1>
      {loading && <p>Loading residents...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Username</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Phone</th>
            <th className="p-3 border">Apartment No.</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((resident) => (
            <tr key={resident.id} className="border-b">
              <td className="p-3 border">{resident.id}</td>
              <td className="p-3 border">
                {editingResident?.id === resident.id ? (
                  <input
                    type="text"
                    value={updatedData.username || ""}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, username: e.target.value })
                    }
                  />
                ) : (
                  resident.username
                )}
              </td>
              <td className="p-3 border">
                {editingResident?.id === resident.id ? (
                  <input
                    type="email"
                    value={updatedData.email || ""}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, email: e.target.value })
                    }
                  />
                ) : (
                  resident.email
                )}
              </td>
              <td className="p-3 border">
                {editingResident?.id === resident.id ? (
                  <input
                    type="text"
                    value={updatedData.phone_number || ""}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, phone_number: e.target.value })
                    }
                  />
                ) : (
                  resident.phone_number
                )}
              </td>
              <td className="p-3 border">
                {resident.apartment_no}
              </td>
              <td className="p-3 border">
                {editingResident?.id === resident.id ? (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleUpdate(resident.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleEdit(resident)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(resident.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageResidents;