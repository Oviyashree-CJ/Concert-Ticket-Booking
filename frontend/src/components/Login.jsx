import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // You can use the same CSS for SignUp & Login

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", formData);

    // TODO: Replace this with actual login API call
    alert("Login Successful! Redirecting to Home...");
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-box fade-in">
        <h2 className="auth-title">Welcome Back 🎶</h2>
        <p className="auth-subtitle">Login to book your favorite concert tickets</p>

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

          <button type="submit" className="auth-btn">
            Login
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
