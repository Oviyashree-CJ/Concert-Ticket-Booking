// src/components/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import concertBg from "../assets/Background.jpg";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false); // ✅ to toggle login/signup buttons

  return (
    <div
      className="splash-page"
      style={{
        backgroundImage: `url(${concertBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div className="splash-content slide-in">
        <h1>🎶 Welcome to Concert Night</h1>
        <p>
          Discover electrifying events, book your tickets, and experience the rhythm of the night.
        </p>

        {/* ✅ Step 1: Show only "Get Started" initially */}
        {!showOptions ? (
          <button
            className="get-started-btn"
            onClick={() => setShowOptions(true)} // reveal login/signup
          >
            Get Started
          </button>
        ) : (
          // ✅ Step 2: After pressing Get Started, show login/signup
          <div className="button-group fade-in">
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;



