const express = require("express");
const router = express.Router();
const bugController = require("../controllers/BugController");
const submissionController = require("../controllers/SubmissionController");
const isLoggedIn = require("../middleware/isLoggedIn");


router.get("/all", bugController.getAllBugs);
router.get("/:id", bugController.getBugById);
router.post("/create", isLoggedIn, bugController.createBug);
router.post("/submit", isLoggedIn, submissionController.submitSolution);
router.post("/approve/:id", isLoggedIn, submissionController.approveSubmission);

module.exports = router;