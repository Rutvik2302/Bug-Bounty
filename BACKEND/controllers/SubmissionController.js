const Submission = require("../models/submitionmodel");
const Bug = require("../models/bugmodels");
const User = require("../models/usermodel");

module.exports.submitSolution = async (req, res) => {
  try {
    const { bugId, description, proofFiles } = req.body;

    const bug = await Bug.findById(bugId);
    if (!bug) return res.status(404).json({ message: "Bug not found" });
    if (bug.status === "Closed")
      return res.status(400).json({ message: "Bug is already closed" });

    const submission = await Submission.create({
      bug: bugId,
      submittedBy: req.user._id,
      description,
      proofFiles,
    });

    // Link submission to the bug
    bug.submissions.push(submission._id);
    if (bug.status === "Open") bug.status = "In Review";
    await bug.save();

    res
      .status(201)
      .json({ message: "Solution submitted successfully", submission });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting solution", error: err.message });
  }
};

module.exports.approveSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("bug")
      .populate("submittedBy");

    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    const bug = submission.bug;

    // Authorization: Only the bug creator can approve
    if (bug.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to approve for this bug" });
    }

    // Update submission status
    submission.status = "Approved";
    await submission.save();

    // Update bug status
    bug.status = "Closed";
    bug.winner = submission.submittedBy._id;
    bug.rewarded = true;
    await bug.save();

    // Update winner rewards
    const winner = await User.findById(submission.submittedBy._id);
    // Note: Checking model field name (Rewards in usermodel.js)
    winner.Rewards = (winner.Rewards || 0) + bug.bountyAmount;
    winner.wonBugs.push(bug._id);
    await winner.save();

    res.json({
      message: "Winner approved and reward distributed successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
};
