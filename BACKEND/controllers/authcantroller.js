const userModel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const generateToken = require("../utils/genrateToken");

module.exports.registeruser = async (req, res) => {
  console.log(req.body);
  try {
    let { email, password, name } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "Fill the form correctly" });
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.send(err.message);
        } else {
          if (email && password && name) {
            let user = await userModel.create({
              email,
              password: hash,
              name,
            });
            let token = generateToken(user);
            res.cookie("token", token);
            res.status(201).json({
              message: "User registered successfully",
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
              },
              token,
            });
          } else {
            res.status(400).send("Fill the form correctly");
          }
        }
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Error in registering user" });
    console.log(err);
  }
};

module.exports.loginUser = async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        res.status(200).json({
          message: "Login successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          token,
        });
      } else {
        res.status(500).json({ message: "Error in logging in" });
      }
    });
  } catch (err) {
    res.status(500).send("Error in logging in");
  }
};

module.exports.logoutUser = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) }); // Clear the cookie
  res.status(200).json({ message: "Logged out successfully" });
};