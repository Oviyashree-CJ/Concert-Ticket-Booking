import React, { useState } from "react";
import axios from "axios";
import "../styles/AddConcertForm.css";

const AddConcertForm = () => {
  const [concertData, setConcertData] = useState({
    title: "",
    artist: "",
    date: "",
    location: "",
    price: "",
    image: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Handle input changes
  const handleChange = (e) => {
    setConcertData({
      ...concertData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !concertData.title ||
      !concertData.artist ||
      !concertData.date ||
      !concertData.price
    ) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    try {
      // ✅ Corrected API endpoint for AdminController
      const response = await axios.post(
        "http://localhost:8080/api/admin/concerts",
        concertData
      );

      console.log("✅ Concert added:", response.data);
      setMessage(`🎵 Concert "${concertData.title}" added successfully!`);

      // Reset form
      setConcertData({
        title: "",
        artist: "",
        date: "",
        location: "",
        price: "",
        image: "",
      });
    } catch (error) {
      console.error("❌ Error adding concert:", error);
      setMessage("❌ Failed to add concert. Please try again.");
    }
  };

  return (
    <div className="add-concert-form fade-in">
      <h3>➕ Add New Concert</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Concert Title *</label>
            <input
              type="text"
              name="title"
              value={concertData.title}
              onChange={handleChange}
              placeholder="e.g., Coldplay World Tour"
              required
            />
          </div>

          <div className="form-group">
            <label>Artist *</label>
            <input
              type="text"
              name="artist"
              value={concertData.artist}
              onChange={handleChange}
              placeholder="e.g., Chris Martin"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={concertData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={concertData.location}
              onChange={handleChange}
              placeholder="e.g., Wembley Stadium"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ticket Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={concertData.price}
              onChange={handleChange}
              placeholder="e.g., 2500"
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image"
              value={concertData.image}
              onChange={handleChange}
              placeholder="Paste image URL here"
            />
          </div>
        </div>

        <button type="submit" className="admin-btn">
          Add Concert
        </button>
      </form>

      {message && (
        <p
          className={`message ${
            message.includes("❌") ? "error" : "success"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddConcertForm;
