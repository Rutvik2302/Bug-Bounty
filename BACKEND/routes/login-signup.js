const express = require("express");
const router = express.Router();
const { registeruser, loginUser, logoutUser, updateProfile } = require("../controllers/authcantroller");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.post("/signup", registeruser);
router.post("/login", loginUser);
router.get("/logout", logoutUser); 

// Profile Update Route
router.put("/profile/update", isLoggedIn, updateProfile);

module.exports = router;