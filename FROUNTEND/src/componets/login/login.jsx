import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted!");
    console.log("Email:", email);
    console.log("Password:", password);

    setError("");

    // All validation checks
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Mock login check
    if (email === "admin@bugbounty.com" && password === "admin123") {
      // Success
      const userData = {
        email: email,
        name: "Admin User",
        isLoggedIn: true,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      alert("Login successful!");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="main">
      <div className="login-container">
        <h1 className="login-title">Welcome to bug-bounty</h1>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          <div>
            <label className="label">Email :</label>
            <input
              type="email"
              className="input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label">Password :</label>
            <input
              type="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="signup-section">
          <p className="signup-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} className="signup-link">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
