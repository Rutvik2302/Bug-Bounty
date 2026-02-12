import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./heder";
import "./dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [view, setView] = useState("explore"); 
  const [bugs, setBugs] = useState([]);
  const [myBugs, setMyBugs] = useState([]);
  const [myWon, setMyWon] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [solutionModal, setSolutionModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);

  // Form States
  const [newBug, setNewBug] = useState({
    title: "",
    description: "",
    bountyAmount: "",
  });
  const [solutionData, setSolutionData] = useState({
    description: "",
    url: "",
  });
  const [editProfileData, setEditProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [selectedBug, setSelectedBug] = useState(null);

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (view === "explore") {
        const res = await axios.get("http://localhost:3000/bug/all");
        setBugs(res.data);
      } else if (view === "my-bugs") {
        const res = await axios.get(
          "http://localhost:3000/bug/user/reported",
          config,
        );
        setMyBugs(res.data);
      } else if (view === "my-won") {
        const res = await axios.get(
          "http://localhost:3000/bug/user/submissions",
          config,
        );
        // Display submissions that were approved for the current researcher
        setMyWon(res.data.filter((sub) => sub.status === "Approved"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/bug/create", newBug, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsReportModalOpen(false);
      setNewBug({ title: "", description: "", bountyAmount: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitSolution = async () => {
    try {
      await axios.post(
        "http://localhost:3000/bug/submit",
        {
          bugId: selectedBug._id,
          description: solutionData.description,
          proofFiles: [solutionData.url],
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSolutionModal(false);
      setSolutionData({ description: "", url: "" });
      fetchData();
      alert("Solution submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  const handleApprove = async (submissionId) => {
    try {
      await axios.post(
        `http://localhost:3000/bug/approve/${submissionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReviewModal(false);
      fetchData();
      alert("Winner approved and reward distributed!");
    } catch (err) {
      alert("Approval failed");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:3000/user/profile/update",
        editProfileData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed");
    }
  };

  const filteredExploreBugs = bugs.filter((bug) => {
    const matchesSearch = bug.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || bug.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-wrapper">
      <Header
        setView={setView}
        onReportClick={() => setIsReportModalOpen(true)}
      />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>
            {view === "explore"
              ? "Active Bounties"
              : view === "my-bugs"
                ? "Your Reported Bugs"
                : view === "my-won"
                  ? "Bounties You Won"
                  : "Profile Settings"}
          </h2>
        </div>

        {view === "explore" && (
          <div className="controls-section">
            <input
              type="text"
              placeholder="Search bugs..."
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
        )}

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : (
          <div className="bug-list">
            {/* EXPLORE VIEW */}
            {view === "explore" &&
              filteredExploreBugs.map((bug) => (
                <div key={bug._id} className="bug-card">
                  <div className="bug-info">
                    <h4>{bug.title}</h4>
                    <p>{bug.description}</p>
                    <div className="bug-meta">
                      <span>💰 ₹{bug.bountyAmount}</span>
                      <span
                        className={`status ${bug.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {bug.status}
                      </span>
                    </div>
                  </div>
                  <div className="bug-actions">
                    {user && bug.createdBy?._id === user.id ? (
                      <span
                        className="owner-badge"
                        style={{ color: "#666", fontSize: "12px" }}
                      >
                        Your Posting
                      </span>
                    ) : (
                      <button
                        className="view-btn"
                        disabled={bug.status === "Closed"}
                        onClick={() => {
                          setSelectedBug(bug);
                          setSolutionModal(true);
                        }}
                      >
                        {bug.status === "Closed" ? "Closed" : "Submit Fix"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {/* MY REPORTED BUGS */}
            {view === "my-bugs" &&
              myBugs.map((bug) => (
                <div key={bug._id} className="bug-card">
                  <div className="bug-info">
                    <h4>{bug.title}</h4>
                    <div className="bug-meta">
                      <span
                        className={`status ${bug.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {bug.status}
                      </span>
                      <span>🛠 {bug.submissions?.length || 0} Submissions</span>
                      <span>💰 ₹{bug.bountyAmount}</span>
                    </div>
                  </div>
                  <div className="bug-actions">
                    <button
                      className="view-btn"
                      onClick={() => {
                        setSelectedBug(bug);
                        setReviewModal(true);
                      }}
                    >
                      Review Fixes
                    </button>
                  </div>
                </div>
              ))}

            {/* MY WON VIEW */}
            {view === "my-won" &&
              myWon.map((sub) => (
                <div key={sub._id} className="bug-card">
                  <div className="bug-info">
                    <h4>{sub.bug?.title}</h4>
                    <p>Your fix was accepted! Bounty awarded.</p>
                    <div className="bug-meta">
                      <span className="status open">REWARDED</span>
                      <span>💰 Received: ₹{sub.bug?.bountyAmount}</span>
                    </div>
                  </div>
                </div>
              ))}

            {/* PROFILE VIEW */}
            {view === "profile" && (
              <div className="bug-card" style={{ display: "block" }}>
                <h3 style={{ marginBottom: "20px" }}>Edit Profile</h3>
                <form
                  onSubmit={handleUpdateProfile}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: "100%" }}
                      value={editProfileData.name}
                      onChange={(e) =>
                        setEditProfileData({
                          ...editProfileData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="search-input"
                      style={{ width: "100%" }}
                      value={editProfileData.email}
                      onChange={(e) =>
                        setEditProfileData({
                          ...editProfileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button type="submit" className="view-btn">
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: REPORT BUG */}
      {isReportModalOpen && (
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
                rows="4"
                value={newBug.description}
                onChange={(e) =>
                  setNewBug({ ...newBug, description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Bounty (₹)"
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
                  onClick={() => setIsReportModalOpen(false)}
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

      {/* MODAL: SUBMIT SOLUTION */}
      {solutionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit Fix: {selectedBug?.title}</h3>
            <textarea
              placeholder="Describe your fix..."
              required
              rows="4"
              value={solutionData.description}
              onChange={(e) =>
                setSolutionData({
                  ...solutionData,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Proof Link (e.g. GitHub)"
              value={solutionData.url}
              onChange={(e) =>
                setSolutionData({ ...solutionData, url: e.target.value })
              }
            />
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSolutionModal(false)}
              >
                Cancel
              </button>
              <button className="submit-btn" onClick={handleSubmitSolution}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW SUBMISSIONS */}
      {reviewModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ maxWidth: "650px", width: "95%" }}
          >
            <h3>Submissions for: {selectedBug?.title}</h3>
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                marginTop: "20px",
              }}
            >
              {selectedBug?.submissions?.length > 0 ? (
                selectedBug.submissions.map((sub) => (
                  <div
                    key={sub._id}
                    style={{
                      border: "1px solid #ddd",
                      padding: "15px",
                      borderRadius: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong>{sub.submittedBy?.name || "Researcher"}</strong>
                      <span className={`status ${sub.status.toLowerCase()}`}>
                        {sub.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", margin: "10px 0" }}>
                      {sub.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {sub.proofFiles?.[0] && (
                        <a
                          href={sub.proofFiles[0]}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: "13px", color: "#3b82f6" }}
                        >
                          View Proof
                        </a>
                      )}
                      {selectedBug.status !== "Closed" &&
                        sub.status === "Pending" && (
                          <button
                            className="create-btn"
                            onClick={() => handleApprove(sub._id)}
                          >
                            Approve & Pay
                          </button>
                        )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#94a3b8" }}>
                  No submissions yet.
                </p>
              )}
            </div>
            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button
                className="cancel-btn"
                onClick={() => setReviewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
