const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const collectionRoutes = require("./routes/collectionRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const ownerResidentRoutes = require("./routes/ownerResidentRoutes");
const reportsRoutes = require("./routes/reportsRoutes")
const residentRoutes = require("./routes/residentRoutes");
const path = require('path');



require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/collections", collectionRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/owner-residents", ownerResidentRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/resident", residentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Apartment Maintenance API running");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
