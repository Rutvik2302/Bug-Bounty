import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Signup form submitted!");
    console.log("Name:", name);
    console.log("Email:", email);
    

    setError("");
    setSuccess("");
    
    // Validations 

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = existingUsers.find(user => user.email === email);
    
    if (userExists) {
      setError("User with this email already exists");
      return;
    }
    
    const newUser = {
      name: name,
      email: email,
      password: password, 
      createdAt: new Date().toISOString()
    };
    

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    
    setSuccess("Account created successfully! Redirecting to login...");
    

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="main">
      <div className="signup-container">
        <h1 className="signup-title">Create Account</h1>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}
          
          <div>
            <label className="label">Name :</label>
            <input
              type="text"
              className="input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="label">Confirm Password :</label>
            <input
              type="password"
              className="input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <div className="login-section">
          <p className="login-text">
            Already have an account?{" "}
            <span 
              onClick={() => navigate("/")} 
              className="login-link"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;