const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    Rewards: {
      type: Number,
      default: 0,
    },

    wonBugs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bug",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
