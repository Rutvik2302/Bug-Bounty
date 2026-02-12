import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

const Header = ({ setView, onReportClick }) => {
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <header className="bb-header">
      <div
        className="bb-logo-area"
        onClick={() => {
          setView("explore");
          navigate("/dashboard");
        }}
      >
        <span>🐞</span>
        <span>Bug Bounty</span>
      </div>

      <nav className="bb-nav">
        <button className="bb-nav-link" onClick={() => setView("explore")}>
          Explore
        </button>
        <button className="bb-nav-link" onClick={() => setView("my-bugs")}>
          My Reported
        </button>
        <button className="bb-nav-link" onClick={() => setView("my-won")}>
          My Won
        </button>
        <button className="bb-nav-link" onClick={() => setView("profile")}>
          Profile
        </button>
      </nav>

      <div className="bb-user-area">
        <button
          className="create-btn"
          style={{ marginRight: "10px" }}
          onClick={onReportClick}
        >
          + Post Bug
        </button>
        {user && (
          <div className="bb-user-text">
            <span className="bb-user-name">{user.name}</span>
            <span className="bb-user-role">Researcher</span>
          </div>
        )}
        <button className="bb-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
