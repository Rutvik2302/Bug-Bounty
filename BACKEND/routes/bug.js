const express = require("express");
const router = express.Router();
const bugController = require("../controllers/BugController");
const submissionController = require("../controllers/SubmissionController");
const isLoggedIn = require("../middlewares/isLoggedIn");

// Public routes
router.get("/all", bugController.getAllBugs);
router.get("/:id", bugController.getBugById);

// Protected routes
router.post("/create", isLoggedIn, bugController.createBug);
router.post("/submit", isLoggedIn, submissionController.submitSolution);
router.post("/approve/:id", isLoggedIn, submissionController.approveSubmission);

// Profile-specific bug tracking
router.get("/user/reported", isLoggedIn, bugController.getMyReportedBugs);
router.get("/user/submissions", isLoggedIn, bugController.getMySubmissions);

module.exports = router;