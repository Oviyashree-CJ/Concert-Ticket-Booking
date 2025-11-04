// src/App.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import "./styles/LoadingScreen.css";
import TicketPage from "./components/TicketPage"; // ✅ Keep direct import for ticket page

// ✅ Lazy-loaded components for performance optimization
const Home = lazy(() => import("./components/Home"));
const SignUp = lazy(() => import("./components/SignUp"));
const Login = lazy(() => import("./components/Login"));
const MainPage = lazy(() => import("./components/MainPage"));
const SeatBooking = lazy(() => import("./components/SeatBooking"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const Payment = lazy(() => import("./components/Payment"));
const Confirmation = lazy(() => import("./components/Confirmation")); // ✅ Confirmation Page Added

function App() {
  return (
    <LoadingScreen>
      <Router>
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "radial-gradient(circle at center, #111, #000)",
                color: "#fff",
                fontFamily: "Poppins, sans-serif",
                flexDirection: "column",
              }}
            >
              <h2>🎶 Loading Concert Experience...</h2>
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "1rem",
                  color: "#aaa",
                  letterSpacing: "0.5px",
                }}
              >
                Please wait while we tune the lights and sound 🎧
              </p>
            </div>
          }
        >
          <Routes>
            {/* 🎤 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* 🎫 User Routes */}
            <Route path="/main" element={<MainPage />} />
            <Route path="/booking/:id" element={<SeatBooking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/ticket" element={<TicketPage />} /> {/* ✅ Ticket Page */}

            {/* 🛠️ Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* 🚧 404 Catch-All Route */}
            <Route
              path="*"
              element={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column",
                    background:
                      "linear-gradient(135deg, #000000, #1a001a, #330033)",
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                    textAlign: "center",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "3rem",
                      background: "linear-gradient(90deg, #ff00cc, #3333ff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    404 - Page Not Found
                  </h1>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      color: "#bbb",
                      marginTop: "10px",
                    }}
                  >
                    Looks like you’re lost in the crowd 🎶
                  </p>
                  <a
                    href="/"
                    style={{
                      marginTop: "25px",
                      padding: "12px 30px",
                      borderRadius: "30px",
                      background: "linear-gradient(90deg, #ff00cc, #3333ff)",
                      color: "white",
                      textDecoration: "none",
                      boxShadow: "0 0 20px rgba(255,0,255,0.4)",
                      transition: "0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.boxShadow =
                        "0 0 25px rgba(255,0,255,0.7)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.boxShadow =
                        "0 0 20px rgba(255,0,255,0.4)")
                    }
                  >
                    Back to Home
                  </a>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </LoadingScreen>
  );
}

export default App;

