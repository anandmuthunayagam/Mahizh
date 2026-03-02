const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const auth = require("../middleware/auth");
const mongoose = require('mongoose');

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

// ✅ NEW UNIFIED LOGIN (Replaces separate admin/user login endpoints)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Try finding in Admin collection first
    let account = await Admin.findOne({ username });
    let role = "admin";

    // 2. If not found in Admin, search in User collection
    if (!account) {
      account = await User.findOne({ username });
      role = "user";
    }

    // 3. If still not found, return error
    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Verify Password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5. Generate Token (with role and homeNo for users)
    const tokenPayload = { 
      id: account._id, 
      role: role 
    };
    
    // Include homeNo in payload if it's a resident/user
    if (role === "user") {
        tokenPayload.homeNo = account.homeNo;
    }

    const token = jwt.sign(
      tokenPayload,
      "SECRET_KEY", // Note: Use process.env.JWT_SECRET in production
      { expiresIn: "1d" }
    );

    // 6. Respond with token and detected role
    res.json({ 
        token, 
        role, 
        username: account.username,
        homeNo: account.homeNo || null 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ✅ ADMIN → CREATE USER
router.post("/admin/create-user", auth(["admin"]), async (req, res) => {
  try {
    const { username, password, homeNo } = req.body;

    if (!username || !password || !homeNo) {
      return res.status(400).json({
        message: "Username, password and homeNo are required",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
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

// ✅ ADMIN → GET ALL USERS
router.get("/admin/users", auth(["admin"]), async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADMIN → DELETE USER
router.delete("/admin/users/:id", auth(["admin"]), async (req, res) => {
  try { 
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADMIN → UPDATE USER
router.put("/admin/users/:id", auth(["admin"]), async (req, res) => {
  try {
    const { username, password, homeNo } = req.body;
    const updateData = { username, homeNo };
    
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }
    
    await User.findByIdAndUpdate(req.params.id, updateData);
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); 

// ✅ HEALTH CHECK
router.get('/health', (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(200).json({
      server: 'Online',
      database: dbStatus
    });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: err.message });
  }
});

module.exports = router;