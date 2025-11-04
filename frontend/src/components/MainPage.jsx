// src/components/MainPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();

  const [concerts, setConcerts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch concerts from backend
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const res = await api.get("/concerts");
        setConcerts(res.data);
      } catch (err) {
        console.error("Error fetching concerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  // ✅ Filter + Search
  const filteredConcerts = concerts.filter((concert) => {
    return (
      (filter === "All" || concert.genre === filter) &&
      concert.artist.toLowerCase().includes(search.toLowerCase())
    );
  });

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.clear(); // remove stored user data
    navigate("/login"); // redirect to login page
  };

  if (loading) {
    return (
      <div className="mainpage-container loading">
        <h2>Loading concerts...</h2>
      </div>
    );
  }

  return (
    <div className="mainpage-container">
      <header className="mainpage-header">
        <motion.h1
          className="main-title"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🎤 Concert Nights
        </motion.h1>

        <p className="main-subtitle">
          Find your vibe. Book your night. Feel the rhythm.
        </p>

        {/* ✅ Logout Button */}
        <motion.button
          className="logout-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
        >
          Logout
        </motion.button>
      </header>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Genres</option>
          <option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
          <option value="EDM">EDM</option>
          <option value="Bollywood">Bollywood</option>
        </select>
      </div>

      <motion.div
        className="concert-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {filteredConcerts.length > 0 ? (
          filteredConcerts.map((concert) => (
            <motion.div
              className="concert-card"
              key={concert.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => navigate(`/booking/${concert.id}`)}
            >
              <div className="concert-image-wrapper">
                <img
                  src={concert.image}
                  alt={concert.artist}
                  className="concert-image"
                />
                <div className="glow-overlay"></div>
              </div>
              <div className="concert-details">
                <h3>{concert.artist.toUpperCase()}</h3>
                <p>{concert.genre}</p>
                <p className="concert-location">📍 {concert.location || "Unknown Venue"}</p>
                <p className="concert-date">{concert.date}</p>
                <p className="concert-price">₹ {concert.price}</p>
              </div>
              <motion.button
                className="book-btn"
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/booking/${concert.id}`);
                }}
              >
                Book Now 🎟️
              </motion.button>
            </motion.div>
          ))
        ) : (
          <p>No concerts found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default MainPage;
