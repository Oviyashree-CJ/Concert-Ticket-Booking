// src/components/Confirmation.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

import confetti from "canvas-confetti";

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🎉 Confetti burst when ticket is confirmed
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const ticketDetails = {
    eventName: "LIVE CONCERT 2025",
    date: "Dec 15, 2025",
    time: "7:30 PM",
    venue: "SkyDome Arena, Mumbai",
    seat: "Gold - A23, A24",
    price: "₹3000",
    bookingId: "CN" + Math.floor(Math.random() * 1000000),
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "radial-gradient(circle at top, #1a0033, #000)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ✅ Success Animation */}
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00e5ff, #ff00cc)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 30px rgba(255,0,255,0.5)",
          animation: "pop 0.6s ease-out",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 30 L28 38 L44 18" />
        </svg>
      </div>

      <h1
        style={{
          marginTop: "20px",
          background: "linear-gradient(90deg, #00e5ff, #ff00cc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.5rem",
          fontWeight: "bold",
        }}
      >
        Booking Confirmed!
      </h1>

      {/* 🎫 Ticket Card */}
      <div
        style={{
          marginTop: "30px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "25px 40px",
          boxShadow: "0 0 30px rgba(0,0,0,0.5)",
          width: "360px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 style={{ color: "#00e5ff", fontSize: "1.5rem", marginBottom: "10px" }}>
          {ticketDetails.eventName}
        </h2>
        <p style={{ color: "#bbb", marginBottom: "5px" }}>
          {ticketDetails.date} • {ticketDetails.time}
        </p>
        <p style={{ color: "#bbb", marginBottom: "10px" }}>{ticketDetails.venue}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px dashed rgba(255,255,255,0.2)",
            borderBottom: "1px dashed rgba(255,255,255,0.2)",
            padding: "10px 0",
            margin: "15px 0",
          }}
        >
          <div>
            <p style={{ color: "#ffeb3b", margin: 0 }}>Seat</p>
            <h4 style={{ margin: 0 }}>{ticketDetails.seat}</h4>
          </div>
          <div>
            <p style={{ color: "#ffeb3b", margin: 0 }}>Price</p>
            <h4 style={{ margin: 0 }}>{ticketDetails.price}</h4>
          </div>
        </div>

        {/* 🎟️ QR Code */}
        <div style={{ marginTop: "15px" }}>
          <QRCodeCanvas
            value={ticketDetails.bookingId}
            size={100}
            bgColor="#000"
            fgColor="#fff"
            includeMargin={true}
          />
          <p style={{ color: "#aaa", fontSize: "0.9rem", marginTop: "10px" }}>
            Booking ID: {ticketDetails.bookingId}
          </p>
        </div>
      </div>

      {/* 🔘 Action Buttons */}
      <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
        <button
          onClick={() => window.print()}
          style={{
            background: "linear-gradient(90deg, #00e5ff, #ff00cc)",
            border: "none",
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 0 15px rgba(255,0,255,0.3)",
          }}
        >
          Download Ticket 🎟️
        </button>

        <button
          onClick={() => navigate("/main")}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          Back to Home 🏠
        </button>
      </div>

      {/* Keyframe animation */}
      <style>
        {`
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        `}
      </style>
    </div>
  );
};

export default Confirmation;
