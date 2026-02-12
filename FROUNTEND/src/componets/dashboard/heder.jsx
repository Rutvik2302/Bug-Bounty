import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
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
      <div className="bb-logo-area" onClick={() => navigate("/dashboard")}>
        <span>🐞</span>
        <span>Bug Bounty</span>
      </div>

      <nav className="bb-nav">
        <button className="bb-nav-link" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button className="bb-nav-link">My Bugs</button>
        <button className="bb-nav-link">Create Bug</button>
        <button className="bb-nav-link">Profile</button>
      </nav>

      <div className="bb-user-area">
        {user && (
          <div className="bb-user-text">
            <span className="bb-user-name">{user.name}</span>
            <span className="bb-user-role">Hunter</span>
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
