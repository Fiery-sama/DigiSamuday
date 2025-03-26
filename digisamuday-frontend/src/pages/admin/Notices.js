// src/pages/admin/Notices.js
import { useState, useEffect } from "react";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/notices/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotices(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notices.");
        setLoading(false);
      });
  }, []);

  const handleNoticeSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    fetch("http://localhost:8000/api/notices/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      })      
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setNotices([...notices, data]);
          setTitle("");
          setContent("");
          setSuccessMessage("Notice posted successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          setError("Failed to post notice.");
        }
      })
      .catch(() => setError("Error posting notice."));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Notices</h1>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {loading && <p>Loading notices...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleNoticeSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Post a New Notice</h2>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter notice title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter notice content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post Notice
        </button>
      </form>
      
      {notices.length > 0 ? (
        <ul className="bg-white p-4 border rounded">
          {notices.map((notice) => (
            <li key={notice.id} className="border-b p-2">
              <strong>{notice.title}</strong>
              <p>{notice.content}</p>
              <span className="text-sm text-gray-500">Posted on: {new Date(notice.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notices found.</p>
      )}
    </div>
  );
}

export default Notices;