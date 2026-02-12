const express = require("express");
const router = express.Router();
const { registeruser, loginUser , logoutUser } = require("../controllers/authcantroller");

router.post("/signup", registeruser);
router.post("/login", loginUser);
router.get("/logout", logoutUser); 

module.exports = router;
