const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ ADMIN REGISTER (ONE TIME)
router.post("/admin/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username,
      password: hashedPassword
    });

    await admin.save();

    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  res.json({ token, role: "admin" });
});

// USER LOGIN
router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: "user", homeNo: user.homeNo },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  res.json({ token, role: "user" });
});

// CREATE USERS BY ADMIN

// ADMIN → CREATE USER
router.post("/admin/create-user", auth(["admin"]), async (req, res) => {
  try {
    const { username, password, homeNo } = req.body;

    // Basic validation
    if (!username || !password || !homeNo) {
      return res.status(400).json({
        message: "Username, password and homeNo are required",
      });
    }

    // Check duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Create new USER (role fixed as user)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password:hashedPassword,
      homeNo,
      role: "user",
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating user",
    });
  }
});

module.exports = router;
