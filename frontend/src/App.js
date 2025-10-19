// src/App.js
import React from "react";
import LoadingScreen from "./components/LoadingScreen";
import "./styles/LoadingScreen.css";

function App() {
  return (
    <LoadingScreen>
      <div style={{ textAlign: "center", marginTop: "100px", color: "#fff", fontFamily: "'Orbitron', sans-serif" }}>
        <h2>Welcome to Concert Night 🎶</h2>
        <p>Your ticket booking experience starts here!</p>
      </div>
    </LoadingScreen>
  );
}

export default App;
