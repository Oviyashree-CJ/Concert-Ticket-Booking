import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/EventList.css";

const EventList = () => {
  const [concerts, setConcerts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Fetch all concerts from backend (AdminController)
  const fetchConcerts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/concerts");
      console.log("🎵 API Response:", response.data);
      setConcerts(response.data);
    } catch (error) {
      console.error("Error fetching concerts:", error);
      setMessage("❌ Failed to fetch concerts. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete a concert
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this concert?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/concerts/${id}`);
      setConcerts(concerts.filter((concert) => concert.id !== id));
      setMessage("🗑️ Concert deleted successfully!");
    } catch (error) {
      console.error("Error deleting concert:", error);
      setMessage("❌ Failed to delete concert. Try again.");
    }
  };

  // ✅ Fetch concerts when component loads
  useEffect(() => {
    fetchConcerts();
  }, []);

  // ✅ Search filter (by title, artist, or location)
  const filteredConcerts = concerts.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.artist?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading concerts...</div>;
  }

  return (
    <motion.div
      className="event-list-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="event-header">
        <h2>🎤 Manage Concert Events</h2>
        <input
          type="text"
          placeholder="Search by title, artist, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="event-search"
        />
      </div>

      {message && (
        <motion.p
          className={`message ${message.includes("❌") ? "error" : "success"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message}
        </motion.p>
      )}

      {filteredConcerts.length === 0 ? (
        <p className="no-events">No concerts found.</p>
      ) : (
        <table className="event-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Date</th>
              <th>Location</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredConcerts.map((concert, index) => (
              <motion.tr
                key={concert.id}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
                transition={{ duration: 0.2 }}
              >
                <td>{index + 1}</td>
                <td>{concert.title}</td>
                <td>{concert.artist}</td>
                <td>{concert.date}</td>
                <td>{concert.location}</td>
                <td>{concert.price}</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(concert.id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default EventList;

