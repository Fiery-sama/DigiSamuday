import { useState, useEffect } from "react";

function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    fetch("http://localhost:8000/api/payments/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch(() => setError("Failed to load payments."));
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/api/payments/${id}/approve_payment/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ payment_status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPayments(
          payments.map((payment) =>
            payment.id === id ? { ...payment, payment_status: data.status } : payment
          )
        );
      })
      .catch(() => alert("Error updating payment status."));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Payments</h1>

      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Resident</th>
            <th className="p-3 border">Amount</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Method</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b">
              <td className="p-3 border">{payment.id}</td>
              <td className="p-3 border">{payment.resident || "Unknown"}</td>
              <td className="p-3 border">${payment.amount}</td>
              <td className="p-3 border">{new Date(payment.payment_date).toLocaleDateString()}</td>
              <td className="p-3 border">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    payment.payment_status === "completed"
                      ? "bg-green-500"
                      : payment.payment_status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {payment.payment_status}
                </span>
              </td>
              <td className="p-3 border">{payment.payment_method}</td>
              <td className="p-3 border">
                {payment.payment_status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(payment.id, "completed")}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(payment.id, "rejected")}
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

export default ManagePayments;
