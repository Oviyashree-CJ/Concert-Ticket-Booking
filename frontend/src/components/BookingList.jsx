import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/BookingList.css";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin/bookings");
        console.log("📦 Bookings API Response:", response.data);


        // Fallback data for UI preview if backend returns empty
        const sampleData = [
          {
            id: 1,
            username: "Arun Kumar",
            concertTitle: "Arijit Singh Live 2025",
            date: "2025-12-10",
            seats: 2,
            totalPrice: 4999,
            status: "Confirmed",
            paymentId: "PAY123456",
          },
          {
            id: 2,
            username: "Priya Sharma",
            concertTitle: "Coldplay India Tour",
            date: "2025-12-22",
            seats: 3,
            totalPrice: 8999,
            status: "Pending",
            paymentId: "PAY654321",
          },
        ];

        const data = response.data.length ? response.data : sampleData;
        setBookings(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setMessage("❌ Failed to load bookings. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Search filtering
  useEffect(() => {
    const filteredList = bookings.filter((b) => {
      const user =
        b.username ||
        b.user?.username ||
        b.user?.email ||
        "";
      const concert =
        b.concertTitle ||
        b.concert?.title ||
        b.concert?.name ||
        "";
      const status = b.status || b.paymentStatus || "";
      return (
        user.toLowerCase().includes(search.toLowerCase()) ||
        concert.toLowerCase().includes(search.toLowerCase()) ||
        status.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFiltered(filteredList);
  }, [search, bookings]);

  // ✅ Cancel booking (delete from backend)
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/bookings/${id}`);
      setBookings(bookings.filter((b) => b.id !== id));
      setMessage("🗑️ Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel error:", error);
      setMessage("❌ Failed to cancel booking. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <motion.div
      className="booking-list-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="booking-header">
        <h2>🎟️ All Concert Bookings</h2>
        <input
          type="text"
          placeholder="Search by user, concert, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
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

      {filtered.length === 0 ? (
        <p className="no-bookings">No bookings found.</p>
      ) : (
        <div className="booking-grid">
          {filtered.map((b) => (
  <motion.div
    key={b.id}
    className="booking-card"
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <div className="booking-info">
      <h3>{b.concertTitle || "Unknown Concert"}</h3>
      <p>
        <strong>Tickets:</strong> {b.tickets || "N/A"}
      </p>
      <p>
        <strong>Total Price:</strong> ₹{b.totalPrice || "-"}
      </p>
      {b.paymentId && (
        <p>
          <strong>Payment ID:</strong> {b.paymentId}
        </p>
      )}
      {b.status && (
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status ${b.status.toLowerCase()}`}>{b.status}</span>
        </p>
      )}
    </div>

    <div className="booking-actions">
      {b.status === "Confirmed" && (
        <button className="cancel-btn" onClick={() => handleCancel(b.id)}>
          Cancel Booking
        </button>
      )}
    </div>
  </motion.div>
))}

        </div>
      )}
    </motion.div>
  );
};

export default BookingList;

