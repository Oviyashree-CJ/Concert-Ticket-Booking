import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddConcertForm from "./AddConcertForm";
import EventList from "./EventList";
import BookingList from "./BookingList";
import UserList from "./UserList";
import { motion } from "framer-motion";
import "../styles/Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [concerts, setConcerts] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConcerts: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.clear(); // remove stored user data
    navigate("/login"); // redirect to login page
  };


  // ✅ 1. Fetch Dashboard Stats (total users, bookings, etc.)
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        alert("⚠️ Failed to load dashboard data. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // ✅ 2. Fetch Concerts List from Backend
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/admin/concerts");
        setConcerts(res.data);
      } catch (err) {
        console.error("Error fetching concerts:", err);
      }
    };
    fetchConcerts();
  }, []);

  // ✅ 3. Add Concert Handler (called when admin adds a new concert)
  const handleAddConcert = async (newConcert) => {
    try {
      const res = await axios.post("http://localhost:8080/api/admin/concerts", newConcert);
      setConcerts((prev) => [...prev, res.data]);
      alert("🎤 Concert added successfully!");
    } catch (error) {
      console.error("Error adding concert:", error);
      alert("Failed to add concert. Please check backend connection.");
    }
  };

  // ✅ 4. Render Different Tabs
  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return <AddConcertForm onAddConcert={handleAddConcert} />;
      case "events":
        return <EventList concerts={concerts} />;
      case "bookings":
        return <BookingList />;
      case "users":
        return <UserList />;
      default:
        return (
          <motion.div
            className="admin-overview"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>🎶 Welcome Admin!</h2>
            <p>Manage concerts, users, and view booking reports here.</p>

            {loading ? (
              <div className="loading">Loading dashboard...</div>
            ) : (
              <div className="stats-grid">
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <h3>Total Events</h3>
                  <p>{stats.totalConcerts}</p>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <h3>Total Bookings</h3>
                  <p>{stats.totalBookings}</p>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <h3>Total Revenue</h3>
                  <p>₹{stats.totalRevenue}</p>
                </motion.div>
              </div>
            )}

            {concerts.length > 0 && (
              <div className="recent-concerts">
                <h3>🎤 Recently Added Concerts</h3>
                <div className="concert-grid">
                  {concerts.map((concert, index) => (
                    <motion.div
                      key={index}
                      className="concert-card"
                      whileHover={{ scale: 1.03 }}
                    >
                      {concert.image && (
                        <img
                          src={concert.image}
                          alt={concert.title}
                          className="concert-image"
                        />
                      )}
                      <h4>{concert.title}</h4>
                      <p><strong>Artist:</strong> {concert.artist}</p>
                      <p><strong>Date:</strong> {concert.date}</p>
                      <p><strong>Location:</strong> {concert.location}</p>
                      <p><strong>Price:</strong> ₹{concert.price}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="admin-container">
      {/* ✅ Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">🎤 Admin Panel</h2>
        <ul>
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            Add Concert
          </li>
          <li
            className={activeTab === "events" ? "active" : ""}
            onClick={() => setActiveTab("events")}
          >
            Manage Events
          </li>
          <li
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            View Bookings
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Manage Users
          </li>
          <li>
            <motion.button
                      className="logout-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLogout}
                    >
                      Logout
                    </motion.button>
          </li>
        </ul>
      </aside>

      {/* ✅ Main Section */}
      <main className="admin-main">
        <div className="content-container">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
