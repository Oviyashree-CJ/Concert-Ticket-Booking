import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // Default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Send login request using formData
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        const { message, role, email } = response.data;

        if (message === "Login successful") {
          // ✅ Save user email for future bookings
          localStorage.setItem("userEmail", email);

          // ✅ Navigate based on role
          if (formData.role === "admin" && role === "admin") {
            alert("🎉 Welcome, Admin!");
            navigate("/admin");
          } else if (formData.role === "user" && role === "user") {
            alert("✅ Welcome back! Redirecting to Main Page...");
            navigate("/main");
          } else {
            setError("Role mismatch — please select the correct login type.");
          }
        } else {
          setError("Invalid email or password.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box fade-in">
        <h2 className="auth-title">🎵 Welcome to Concert Portal</h2>
        <p className="auth-subtitle">Login to continue your musical journey</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Login As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="role-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-auth">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
