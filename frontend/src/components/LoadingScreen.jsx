import React, { useEffect, useState } from "react";
import "../styles/LoadingScreen.css";

const LoadingScreen = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (2.5 seconds)
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="logo-section">
          
          <h1 className="loading-title">
            <span>C</span>ONCERT <span>N</span>IGHT
          </h1>
        </div>

        <div className="equalizer">
          <div className="bar bar1"></div>
          <div className="bar bar2"></div>
          <div className="bar bar3"></div>
          <div className="bar bar4"></div>
          <div className="bar bar5"></div>
        </div>

        <p className="loading-text">Loading your experience...</p>
      </div>
    );
  }

  // After loading, show your main app content
  return <>{children}</>;
};

export default LoadingScreen;
