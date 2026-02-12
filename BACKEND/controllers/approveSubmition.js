const Submission = require("../models/submitionmodel");
const User = require("../models/usermodel");
const Bug = require("../models/bugmodels");

const approveSubmission = async (req, res) => {

  const submission = await Submission.findById(req.params.id)
    .populate("bug")
    .populate("submittedBy");

  const bug = submission.bug;

  if (bug.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  submission.status = "Approved";
  await submission.save();

  bug.status = "Closed";
  bug.winner = submission.submittedBy._id;
  bug.rewarded = true;
  await bug.save();
  
  const winner = await User.findById(submission.submittedBy._id);
  winner.totalRewards += bug.bountyAmount;
  winner.wonBugs.push(bug._id);
  await winner.save();

  res.json({ message: "Winner approved successfully" });
};
