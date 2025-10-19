// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import LoadingScreen from "./components/LoadingScreen"; // ✅ import your loading component
import "./styles/LoadingScreen.css"; // ✅ import loading screen styles
import MainPage from "./components/MainPage";

function App() {
  return (
    <LoadingScreen> {/* ✅ Wrap entire app with LoadingScreen */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<MainPage />} />
          
        </Routes>
      </Router>
    </LoadingScreen>
  );
}

export default App;



