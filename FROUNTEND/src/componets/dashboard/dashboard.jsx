import React, { useState } from "react";
import Heder from "./heder";
import "./dashboard.css";

const Dashboard = () => {
  // ---------------- STATE ----------------
  const [bugs, setBugs] = useState([
    { id: 1, title: "SQL Injection in Login Form", description: "User can bypass authentication using SQL payload.", bounty: 4000, status: "Open", createdBy: "Rahul Sharma", submissions: 2 },
    { id: 2, title: "XSS in Comment Section", description: "Script injection possible in comments.", bounty: 2500, status: "In Review", createdBy: "Priya Patel", submissions: 5 },
    { id: 3, title: "Broken Password Reset", description: "Password reset token never expires.", bounty: 6000, status: "Closed", createdBy: "Amit Verma", submissions: 3, winner: "Sanjay Mehta" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBug, setNewBug] = useState({ title: "", description: "", bounty: "" });

  // ---------------- HANDLERS ----------------
  const handleCreateBug = (e) => {
    e.preventDefault();
    const bugEntry = {
      ...newBug,
      id: bugs.length + 1,
      status: "Open",
      createdBy: "Current User", // Mocked
      submissions: 0
    };
    setBugs([bugEntry, ...bugs]);
    setIsModalOpen(false);
    setNewBug({ title: "", description: "", bounty: "" });
  };

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || bug.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-wrapper">
      <Heder />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Bug Bounty Dashboard</h2>
          <button className="create-btn" onClick={() => setIsModalOpen(true)}>+ Report Bug</button>
        </div>

        {/* -------- SEARCH & FILTER -------- */}
        <div className="controls-section card">
          <input 
            type="text" 
            placeholder="Search bugs by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* -------- BUG LIST -------- */}
        <div className="bug-list">
          {filteredBugs.map((bug) => (
            <div key={bug.id} className="card bug-card">
              <div className="bug-content">
                <h4>{bug.title}</h4>
                <p>{bug.description}</p>
                <div className="bug-meta">
                  <span>💰 ₹{bug.bounty}</span>
                  <span>👤 {bug.createdBy}</span>
                  <span>📩 {bug.submissions} Submissions</span>
                </div>
              </div>
              <div className="bug-footer">
                <span className={`status ${bug.status.toLowerCase().replace(" ", "-")}`}>
                  {bug.status}
                </span>
                {bug.winner && <span className="winner">🏆 {bug.winner}</span>}
                <button className="view-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------- CREATE BUG MODAL -------- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h3>Post a New Bug</h3>
            <form onSubmit={handleCreateBug}>
              <input 
                type="text" placeholder="Bug Title" required 
                onChange={e => setNewBug({...newBug, title: e.target.value})}
              />
              <textarea 
                placeholder="Detailed Description" required 
                onChange={e => setNewBug({...newBug, description: e.target.value})}
              />
              <input 
                type="number" placeholder="Bounty Amount (₹)" required 
                onChange={e => setNewBug({...newBug, bounty: e.target.value})}
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Post Bug</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;