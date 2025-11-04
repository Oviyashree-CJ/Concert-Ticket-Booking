import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/SeatBooking.css";

const SeatBooking = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [concertDetails, setConcertDetails] = useState(null);

  const navigate = useNavigate();
  const { id: concertId } = useParams();

  useEffect(() => {
    const fetchConcertDetails = async () => {
      if (!concertId) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/concerts/${concertId}`);
        console.log("🎵 Concert details fetched:", res.data);
        setConcertDetails(res.data);
      } catch (err) {
        console.error("❌ Error fetching concert details:", err);
      }
    };
    fetchConcertDetails();
  }, [concertId]);


  // 🎨 Seat Zones (colors + pricing)
  const seatZones = useMemo(
    () => [
      { category: "Platinum", color: "#00E5FF", price: 2500, rings: 3, seatsPerRing: 40 },
      { category: "Gold", color: "#FFD700", price: 1500, rings: 4, seatsPerRing: 50 },
      { category: "Silver", color: "#C0C0C0", price: 800, rings: 5, seatsPerRing: 60 },
    ],
    []
  );

  // 🎯 Generate seats dynamically
  const seats = useMemo(() => {
    const generatedSeats = [];
    let radiusOffset = 90;

    seatZones.forEach((zone) => {
      for (let r = 0; r < zone.rings; r++) {
        const radius = radiusOffset + r * 25;
        for (let i = 0; i < zone.seatsPerRing; i++) {
          const angle = (i / zone.seatsPerRing) * 2 * Math.PI;
          generatedSeats.push({
            id: `${zone.category}-${r}-${i}`,
            category: zone.category,
            price: zone.price,
            x: 400 + radius * Math.cos(angle),
            y: 400 + radius * Math.sin(angle),
            color: zone.color,
          });
        }
      }
      radiusOffset += zone.rings * 25 + 15;
    });
    return generatedSeats;
  }, [seatZones]);

  // 🧾 Fetch booked seats
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!concertId) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/bookings/${concertId}`);
        console.log("🎟️ Booked seats fetched:", res.data);
        setBookedSeats(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Error fetching booked seats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookedSeats();
  }, [concertId]);

  // 🎫 Seat toggle handler
  const toggleSeat = (id) => {
    if (bookedSeats.includes(id)) return;
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // ✅ Confirm booking with fixed userEmail logic
  const handleConfirmBooking = async () => {
    if (!concertId) {
      alert("❌ Concert ID is missing. Please return to the concert list.");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("⚠️ Please select at least one seat before confirming.");
      return;
    }

    try {
      // ✅ FIX: Ensure consistent userEmail retrieval
      const userEmail =
        localStorage.getItem("userEmail") ||
        "guest@example.com";
      localStorage.setItem("userEmail", userEmail); // store for later

      const payload = {
        concertId: Number(concertId),
        seats: selectedSeats,
        userEmail: localStorage.getItem("userEmail") ||
  "guest@example.com", // ✅ always defined now
      };

      console.log("📤 Sending booking payload:", payload);
      const response = await axios.post("http://localhost:8080/api/bookings", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("📥 Booking response:", response.data);

      if (!response.data || response.data.message?.includes("failed")) {
        alert(`❌ Booking failed: ${response.data.message || "Unknown error"}`);
        return;
      }

      // ✅ Save booking ID in localStorage
      if (response.data.id) {
        localStorage.setItem("bookingId", response.data.id);
        console.log("💾 Booking ID saved:", response.data.id);
      }

      // 💰 Compute total price
      const totalPrice = selectedSeats.reduce((sum, id) => {
        const seat = seats.find((s) => s.id === id);
        return sum + (seat ? seat.price : 0);
      }, 0);

      alert("🎉 Booking Confirmed Successfully!");

      navigate("/payment", {
        state: {
          bookingId: response.data.id,
          concertId: Number(concertId),
          concertTitle: concertDetails?.title || concertDetails?.name || "Concert Night Live 2025",
          concertLocation: concertDetails?.location || "Unknown Venue",
          concertDate: concertDetails?.date || Date.now(),
          seats: selectedSeats,
          totalPrice,
          userEmail,
        },
      });
    } catch (err) {
      console.error("❌ Booking request failed:", err);
      alert("Booking failed. Please check backend logs or try again later.");
    }
  };

  const totalPrice = selectedSeats.reduce((sum, id) => {
    const seat = seats.find((s) => s.id === id);
    return sum + (seat ? seat.price : 0);
  }, 0);

  if (loading) return <div className="loading">Loading seat layout...</div>;

  return (
    <div className="arena-container">
      <h1 className="booking-title">Book Your Seats for {concertDetails?.title.toUpperCase() || "Concert Night"}</h1>

      <div className="arena-svg-container">
        <svg width="800" height="800" viewBox="0 0 800 800">
          {/* Stage */}
          <circle cx="400" cy="400" r="60" fill="url(#stageGradient)" stroke="#fff" strokeWidth="2" />
          <text x="400" y="405" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">
            MAIN STAGE 🎤
          </text>
          <defs>
            <radialGradient id="stageGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff00cc" />
              <stop offset="100%" stopColor="#3333ff" />
            </radialGradient>
          </defs>

          {/* Seats */}
          {seats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.id);
            const isBooked = bookedSeats.includes(seat.id);
            const fill = isBooked ? "#ff4c4c" : isSelected ? "#ffeb3b" : seat.color;

            return (
              <rect
                key={seat.id}
                x={seat.x - 5}
                y={seat.y - 5}
                width="10"
                height="10"
                rx="2"
                ry="2"
                fill={fill}
                stroke="#111"
                strokeWidth="0.8"
                onClick={() => toggleSeat(seat.id)}
                style={{
                  cursor: isBooked ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.3)" : "scale(1)",
                }}
              />
            );
          })}
        </svg>
      </div>

      <div className="booking-summary">
        <h2>🪑 Booking Summary</h2>
        <p>
          Selected Seats: <strong style={{ color: "#ffeb3b" }}>{selectedSeats.length}</strong>
        </p>
        <p>
          Total Price: <strong style={{ color: "#00E5FF" }}>₹{totalPrice}</strong>
        </p>
        <button
          className="confirm-btn"
          disabled={selectedSeats.length === 0}
          onClick={handleConfirmBooking}
        >
          Confirm Booking 🎟️
        </button>
      </div>

      <div className="legend">
        <span className="legend-item" style={{ background: "#00E5FF" }}>Platinum</span>
        <span className="legend-item" style={{ background: "#FFD700" }}>Gold</span>
        <span className="legend-item" style={{ background: "#C0C0C0" }}>Silver</span>
        <span className="legend-item" style={{ background: "#ff4c4c" }}>Booked</span>
        <span className="legend-item" style={{ background: "#ffeb3b" }}>Selected</span>
      </div>
    </div>
  );
};

export default SeatBooking;
