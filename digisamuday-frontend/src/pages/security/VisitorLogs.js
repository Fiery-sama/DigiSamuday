import { useState, useEffect } from "react";

function VisitorLogs() {
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [error, setError] = useState(null);
  const [visitorName, setVisitorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [residentId, setResidentId] = useState("");

  useEffect(() => {
    fetchVisitorLogs();
  }, []);

  const fetchVisitorLogs = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    fetch("http://localhost:8000/api/security-logs/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }
        setVisitorLogs(data);
      })
      .catch(() => setError("Failed to load visitor logs."));
  };

  const handleEntry = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    fetch("http://localhost:8000/api/visitors/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        name: visitorName,
        phone_number: phoneNumber,
        vehicle_number: vehicleNumber || null, // Ensure null if empty
        resident_id: residentId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          console.error("Backend Error Response:", data);
          throw new Error(data.detail || "Failed to log visitor entry");
        }
        return data;
      })
      .then(() => {
        setVisitorName("");
        setPhoneNumber("");
        setVehicleNumber("");
        setResidentId("");
        fetchVisitorLogs(); // Refresh logs
      })
      .catch((err) => {
        console.error("Visitor Entry Error:", err.message);
        setError(err.message);
      });
  };

  const handleCheckout = (logId) => {
    const token = localStorage.getItem("token");
    
    fetch(`http://localhost:8000/api/security-logs/${logId}/checkout/`, {
      method: "PATCH",
      headers: { Authorization: `Token ${token}` },
    })
      .then(() => fetchVisitorLogs()) // Refresh logs
      .catch(() => setError("Failed to check out visitor."));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Visitor Logs</h1>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleEntry} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Log Visitor Entry</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Visitor Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Vehicle Number (Optional)</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Resident ID</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={residentId}
            onChange={(e) => setResidentId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Log Entry
        </button>
      </form>
      
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Visitor Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Check-In</th>
            <th className="border px-4 py-2">Check-Out</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {visitorLogs.length > 0 ? (
            visitorLogs.map((log) => (
              <tr key={log.id} className="border">
                <td className="border px-4 py-2">{log.visitor.name}</td>
                <td className="border px-4 py-2">{log.visitor.phone_number}</td>
                <td className="border px-4 py-2">{new Date(log.entry_time).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  {log.exit_time ? new Date(log.exit_time).toLocaleString() : "Still Inside"}
                </td>
                <td className="border px-4 py-2">
                  {!log.exit_time && (
                    <button
                      onClick={() => handleCheckout(log.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Check-Out
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No visitor logs available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VisitorLogs;