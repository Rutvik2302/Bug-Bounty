const Bug = require("../models/bugmodels");
const Submission = require("../models/submitionmodel");

// ... existing methods ...

module.exports.createBug = async (req, res) => {
  try {
    const { title, description, bountyAmount } = req.body;

    const newBug = await Bug.create({
      title,
      description,
      bountyAmount,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Bug created successfully", bug: newBug });
  } catch (err) {
    res.status(500).json({ message: "Error creating bug", error: err.message });
  }
};

module.exports.getAllBugs = async (req, res) => {
  try {
    const bugs = await Bug.find().populate("createdBy", "name");
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bugs" });
  }
};

// NEW: Get bugs created by the logged-in user
module.exports.getMyReportedBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({ createdBy: req.user._id }).populate({
      path: "submissions",
      populate: { path: "submittedBy", select: "name email" },
    });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your bugs" });
  }
};

// NEW: Get submissions made by the logged-in user
module.exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      submittedBy: req.user._id,
    }).populate("bug", "title bountyAmount status");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your submissions" });
  }
};

module.exports.getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate({
        path: "submissions",
        populate: { path: "submittedBy", select: "name" },
      });

    if (!bug) return res.status(404).json({ message: "Bug not found" });
    res.json(bug);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bug details" });
  }
};
