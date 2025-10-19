import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // we'll create this next

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("All fields are required!");
      return;
    }

    // Basic email check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email!");
      return;
    }

    setError("");

    console.log("✅ Sign Up Data:", formData);

    // Redirect to login after sign up
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box slide-in">
        <h2>Create Your Account 🎶</h2>
        <p>Join Concert Night and experience live music like never before!</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="auth-btn">
            Sign Up
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
