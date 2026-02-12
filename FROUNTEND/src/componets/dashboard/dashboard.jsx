import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./heder";
import "./dashboard.css";

const Dashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // solution modal
  const [solutionModal, setSolutionModal] = useState(false);
  const [solutionUrl, setSolutionUrl] = useState("");
  const [solutionDec, setSolutionDec] = useState("");
  const [selectedBugId, setSelectedBugId] = useState(null);

  // New Bug State
  const [newBug, setNewBug] = useState({
    title: "",
    description: "",
    bountyAmount: "",
  });

  // ---------------- LOGIN CHECK ----------------
  const token = localStorage.getItem("token");

  const checkLogin = () => {
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return false;
    }
    return true;
  };

  // ---------------- API CALLS ----------------

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/bug/all");
      setBugs(response.data);
    } catch (error) {
      console.error("Error fetching bugs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);


  const handleCreateBug = async (e) => {
    e.preventDefault();
    if (!checkLogin()) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/bug/create",
        newBug,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBugs([response.data, ...bugs]);
      setIsModalOpen(false);
      setNewBug({ title: "", description: "", bountyAmount: "" });
    } catch (error) {
      console.error("Error creating bug:", error);
    }
  };

  const openSolutionModal = (bugId) => {
    if (!checkLogin()) return;
    setSelectedBugId(bugId);
    setSolutionModal(true);
  };

  // ---------------- SUBMIT SOLUTION ----------------
  const submitSolution = async () => {
    if (!solutionUrl) return;

    try {
      await axios.post(
        "http://localhost:3000/bug/submit",
        {
          bugId: selectedBugId,
          description: solutionDec,
          proofFiles: solutionUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSolutionModal(false);
      setSolutionUrl("");
      fetchBugs();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch = bug.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || bug.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Bug bountyAmount Dashboard</h2>
          <button className="create-btn" onClick={() => setIsModalOpen(true)}>
            + Report Bug
          </button>
        </div>

        <div className="controls-section">
          <input
            type="text"
            placeholder="Search bugs by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {loading ? (
          <p>Loading bugs...</p>
        ) : (
          <div className="bug-list">
            {filteredBugs.map((bug) => (
              <div key={bug._id} className="bug-card">
                <div className="bug-info">
                  <h4>{bug.title}</h4>
                  <p>{bug.description}</p>
                  <div className="bug-meta">
                    <span>💰 ₹{bug.bountyAmount}</span>
                    <span>👤 {bug.createdBy?.name || "Anonymous"}</span>
                    <span>📩 {bug.submissions?.length || 0} Submissions</span>
                  </div>
                </div>

                <div className="bug-actions">
                  <span className={`status ${bug.status?.toLowerCase()}`}>
                    {bug.status}
                  </span>

                  <button
                    className="view-btn"
                    onClick={() => openSolutionModal(bug._id)}
                  >
                    Submit Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE BUG MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Post a New Bug</h3>
            <form onSubmit={handleCreateBug}>
              <input
                type="text"
                placeholder="Bug Title"
                required
                value={newBug.title}
                onChange={(e) =>
                  setNewBug({ ...newBug, title: e.target.value })
                }
              />
              <textarea
                placeholder="Detailed Description"
                required
                value={newBug.description}
                onChange={(e) =>
                  setNewBug({ ...newBug, description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="bountyAmount Amount"
                required
                value={newBug.bountyAmount}
                onChange={(e) =>
                  setNewBug({ ...newBug, bountyAmount: e.target.value })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Post Bug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOLUTION MODAL */}
      {solutionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit Solution</h3>

            <textarea
              type="text"
              placeholder="Add the description of your solution"
              value={solutionDec}
              onChange={(e) => setSolutionDec(e.target.value)}
            />

            <input
              type="text"
              placeholder="Paste solution link"
              value={solutionUrl}
              onChange={(e) => setSolutionUrl(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSolutionModal(false)}
              >
                Cancel
              </button>
              <button className="submit-btn" onClick={submitSolution}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
