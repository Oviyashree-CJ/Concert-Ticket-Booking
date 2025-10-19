// src/components/MainPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session here if any
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">🎟️ Concert Night </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      <main className="main-content">
        <h2>Welcome to the Concert Night-Ticket Booking System!</h2>
        {/* Add more content here */}
      </main>
    </div>
  );
};

export default MainPage;
