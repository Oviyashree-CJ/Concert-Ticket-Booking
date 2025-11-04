// ✅ src/pages/Payment.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract booking info passed from SeatBooking
  const {
      bookingId,
      concertId,
      concertTitle,
      concertLocation,
      concertDate,
      tickets,
      seats,
      totalPrice,
    } = location.state || {};

  const storedBookingId =
    bookingId || localStorage.getItem("bookingId") || Math.floor(Math.random() * 10000);

  // ✅ Logged-in user email
  const userEmail = localStorage.getItem("userEmail") || "guest@example.com";

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("latestPayment", JSON.stringify({
      bookingId: storedBookingId,
      concertId,
      concertTitle,
      concertLocation,
      concertDate,
      seats,
      totalPrice,
      userEmail,
    }));
  }, [storedBookingId, concertId, concertLocation,
      concertDate, concertTitle, seats, totalPrice, userEmail]);

  // ✅ Handle payment (Simulated)
  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    console.log("💳 Simulating payment process...");
     console.log({
      bookingId: storedBookingId,
      concertId,
      concertTitle,
      tickets: tickets || seats?.join(", ") || "Seat 1",
      concertLocation,
      concertDate,
      totalPrice,
      userEmail,
      method: paymentMethod,
    });

    // Simulate a delay for "processing"
    setTimeout(async() => {
      console.log("✅ Payment successful (simulated)");

      try {
        // ✅ Update backend booking status to Confirmed
        await axios.put(`http://localhost:8080/api/bookings/${storedBookingId}`, {
          status: "Confirmed",
          paymentId: "PAY" + Math.floor(Math.random() * 1000000),
          totalPrice,
          tickets: tickets || seats?.join(", ") || "Seat 1",
          concertTitle,
          userEmail,
        });
        console.log("✅ Booking updated on backend!");
      } catch (error) {
        console.error("❌ Failed to update booking:", error);
      }

      console.log("✅ Booking status updated to Confirmed in backend");
      setIsProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  // ✅ After success → go to ticket page
  const handleSuccessRedirect = () => {
    const bookingData = {
      id: storedBookingId,
      concertId,
      concertTitle: concertTitle || "Concert Night 2025",
      seats: Array.isArray(seats)
        ? seats
        : (tickets ? tickets.split(",") : ["Seat 1"]),
      concertLocation,
      concertDate,
      totalPrice,
      userEmail,
      status: "Confirmed",
      paymentMethod,
    };

    navigate("/ticket", {
      state: { booking: bookingData },
    });
  };


  return (
    <motion.div
      className="payment-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="payment-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="payment-title">💳 Secure Payment</h1>

        {/* ✅ Booking Summary */}
        <div className="summary-box">
          <h3>🎟️ Booking Summary</h3>
          <p>
            Booking ID: <strong>{storedBookingId}</strong>
          </p>
          <p>
            Seats Selected:{" "}
            <strong>{tickets || seats?.join(", ") || "Not Available"}</strong>
          </p>
          <p>
            Total Price: <strong>₹{totalPrice || "N/A"}</strong>
          </p>
          <hr />
          <p>
            Event: <strong>{concertTitle.toUpperCase() || "Concert Night 2025"}</strong>
          </p>
          <p>
            Location: <strong>{concertLocation || "Unknown Venue"}</strong>
          </p>
          <p>
            Date: <strong>{concertDate || Date.now()}</strong>
          </p>
        </div>

        {/* ✅ Payment Methods */}
        <div className="payment-methods">
          <h3>Choose Payment Method</h3>
          <div className="method-buttons">
            <button
              className={paymentMethod === "card" ? "active" : ""}
              onClick={() => setPaymentMethod("card")}
            >
              💳 Card
            </button>
            <button
              className={paymentMethod === "upi" ? "active" : ""}
              onClick={() => setPaymentMethod("upi")}
            >
              📱 UPI
            </button>
            <button
              className={paymentMethod === "wallet" ? "active" : ""}
              onClick={() => setPaymentMethod("wallet")}
            >
              💰 Wallet
            </button>
          </div>
        </div>

        {/* ✅ Card Payment Form */}
        {paymentMethod === "card" && (
          <motion.form
            className="card-form"
            onSubmit={handlePayment}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Card Number"
              maxLength="16"
              value={cardDetails.number}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, number: e.target.value })
              }
              required
            />
            <div className="card-row">
              <input
                type="text"
                placeholder="MM/YY"
                maxLength="5"
                value={cardDetails.expiry}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, expiry: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="CVV"
                maxLength="3"
                value={cardDetails.cvv}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cvv: e.target.value })
                }
                required
              />
            </div>

            <motion.button
              type="submit"
              className="pay-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay ₹" + totalPrice}
            </motion.button>
          </motion.form>
        )}

        {/* ✅ UPI Payment Form */}
        {paymentMethod === "upi" && (
          <motion.form
            className="upi-form"
            onSubmit={handlePayment}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. name@upi)"
              required
            />
            <motion.button
              type="submit"
              className="pay-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay ₹" + totalPrice}
            </motion.button>
          </motion.form>
        )}

        {/* ✅ Wallet Payment Form */}
        {paymentMethod === "wallet" && (
          <motion.form
            className="wallet-form"
            onSubmit={handlePayment}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <select required>
              <option value="">Select Wallet</option>
              <option value="Paytm">Paytm</option>
              <option value="PhonePe">PhonePe</option>
              <option value="GooglePay">Google Pay</option>
            </select>
            <motion.button
              type="submit"
              className="pay-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay ₹" + totalPrice}
            </motion.button>
          </motion.form>
        )}
      </motion.div>

      {success && (
        <motion.div
          className="success-popup"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <h2>🎉 Payment Successful!</h2>
          <p>Your booking has been confirmed. See you at the concert! 🎶</p>
          <button onClick={handleSuccessRedirect}>View Your Ticket 🎟️</button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Payment;
