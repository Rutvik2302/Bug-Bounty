const express = require("express");
const router = express.Router();
const Bug = require("../models/bugmodels");

router.post("/create", async (req, res) => {
  console.log("Body found:", req.body);
  let { title, description, bountyAmount, createdBy } = req.body;
  try {
    const newbug = new Bug({
      title,
      description,
      bountyAmount,
      createdBy,
    });
    await newbug.save();
    res.send({ message: "Bug created successfully", bug: newbug });
  } catch (err) {
    res.send({ message: "Error creating Bug", error: err.message });
  }
});

module.exports = router;
