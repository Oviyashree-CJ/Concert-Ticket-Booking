import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/TicketPage.css";

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef();

  // 🧾 Retrieve booking info from Payment page
  const { booking } = location.state || {};

  // 💾 Store booking details in localStorage for reload safety
  useEffect(() => {
    if (booking) {
      localStorage.setItem("lastBooking", JSON.stringify(booking));
    }
  }, [booking]);

  // 🔁 Fallback if page reloaded or state lost
  const storedBooking = localStorage.getItem("lastBooking");
  const data =
    booking ||
    (storedBooking ? JSON.parse(storedBooking) : {
      id: Math.floor(Math.random() * 10000),
      concertTitle: "Concert Night 2025",
      seats: ["A1", "A2"],
      totalPrice: 2500,
      userEmail: "guest@example.com",
      status: "Confirmed",
      paymentMethod: "card",
    });

  // 📄 Download ticket as PDF
  const downloadTicket = async () => {
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a5");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`ConcertTicket_${data.id}.pdf`);
  };

  return (
    <div className="ticket-container">
      <div className="ticket" ref={ticketRef}>
        <h2>🎟️ Concert Ticket</h2>

        <div className="ticket-info">
          <p><strong>Booking ID:</strong> {data.id}</p>
          <p><strong>Concert:</strong> {data.concertTitle.toUpperCase()}</p>
          <p><strong>Seats:</strong> {Array.isArray(data.seats) ? data.seats.join(", ") : data.seats}</p>
          <p><strong>Total Paid:</strong> ₹{data.totalPrice}</p>
          {data.paymentMethod && (
            <p><strong>Payment Method:</strong> {data.paymentMethod.toUpperCase()}</p>
          )}
          <p><strong>Status:</strong> ✅ {data.status}</p>
        </div>

        <div className="ticket-footer">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Booking-${data.id}`}
            alt="QR Code"
          />
          <p>Scan for verification</p>
        </div>
      </div>

      <div className="ticket-actions">
        <button className="download-btn" onClick={downloadTicket}>
          ⬇️ Download Ticket (PDF)
        </button>
        <button className="home-btn" onClick={() => navigate("/main")}>
          🏠 Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default TicketPage;
