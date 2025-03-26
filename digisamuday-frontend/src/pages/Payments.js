import { useState, useEffect } from "react";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/payments/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payments.");
        }
        return response.json();
      })
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error loading payments.");
        setLoading(false);
      });
  }, []);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    fetch("http://localhost:8000/api/payments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        payment_status: "pending",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setPayments([...payments, data]);
          setAmount("");
          setPaymentMethod("Card");
          setSuccessMessage("Payment submitted successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          setError("Failed to submit payment.");
        }
      })
      .catch(() => setError("Error submitting payment."));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Payment History</h1>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {loading && <p>Loading payments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handlePaymentSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Make a Payment</h2>
        <input
          type="number"
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded mb-2"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Payment
        </button>
      </form>

      {payments.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="p-3 border">{payment.id}</td>
                <td className="p-3 border">${payment.amount}</td>
                <td className="p-3 border">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </td>
                <td className="p-3 border">
                  <span className={`px-2 py-1 rounded text-white ${
                    payment.payment_status === "completed"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}>
                    {payment.payment_status}
                  </span>
                </td>
                <td className="p-3 border">{payment.payment_method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
}

export default Payments;
