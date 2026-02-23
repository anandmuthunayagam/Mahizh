const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");
const multer = require('multer');
const Attachment = require("../models/Attachments");
const path = require('path');



// 1. Configure Multer for Memory Storage (Required for Separate Model/Buffer approach)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


// Get all expenses
router.get("/", auth(),async (req, res) => {
  try {

    const { month, year, startDate, endDate } = req.query;
    let query = {};

    if (month && month !== "All") query.month = month;
    if (year && year !== "All") query.year = Number(year);

    // Backward compatibility for date range
    if (startDate && endDate && !month) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to fetch the file when needed
router.get("/attachment/:expenseId", auth(), async (req, res) => {
  try {
    const attachment = await Attachment.findOne({ expenseId: req.params.expenseId });
    if (!attachment) return res.status(404).send("No attachment found");

    res.set({
      "Content-Type": attachment.contentType, //
      "Content-Disposition": `attachment; filename="${attachment.fileName}"`, //
      // CRITICAL: This allows Axios to read the filename
      "Access-Control-Expose-Headers": "Content-Disposition" 
    });
    res.send(attachment.fileData);
  } catch (err) {
    res.status(500).send("Error fetching file");
  }
});

router.post("/", auth(["admin"]), upload.single("attachment"), async (req, res) => {

  try {
    let { title, amount, date, month, year } = req.body;

    // 1. Logic to derive month/year if they arrive empty
    if (!month || !year) {
       const d = new Date(date);
       const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
       month = month || months[d.getMonth()];
       year = year || d.getFullYear();
    }

    // 2. Create and Save the Expense
    const newExpense = new Expense({
      title,
      amount: Number(amount),
      date,
      month,
      year: Number(year),
      // We store a boolean or string just to tell the frontend an attachment exists
      hasAttachment: req.file ? true : false 
    });
    const savedExpense = await newExpense.save();

    // 3. If a file was uploaded, save it to the Separate Model
    if (req.file) {
      const newAttachment = new Attachment({
        expenseId: savedExpense._id,
        fileData: req.file.buffer, // Works with multer.memoryStorage()
        fileName: req.file.originalname,
        contentType: req.file.mimetype
      });
      await newAttachment.save();
    }

    res.status(201).json({ success: true, data: savedExpense });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ success: false, message: "Add failed", error: err.message });
  }
});
// expenseRoutes.js

router.put("/:id", auth(["admin"]), upload.single("attachment"), async (req, res) => {
  try {
    const { title, amount, date, month, year } = req.body;
    const expenseId = req.params.id;

    // 1. Update the Expense document metadata
    const updateData = {
      title,
      amount: Number(amount),
      date,
      month,
      year: Number(year)
    };

    // If a new file is uploaded, set hasAttachment to true
    if (req.file) {
      updateData.hasAttachment = true;
    }

    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updateData, { new: true });

    // 2. Handle the Attachment update
    if (req.file) {
      // Upsert: Update existing attachment or create new one if it didn't exist
      await Attachment.findOneAndUpdate(
        { expenseId: expenseId },
        {
          fileData: req.file.buffer, // memoryStorage buffer
          fileName: req.file.originalname,
          contentType: req.file.mimetype
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ success: true, data: updatedExpense });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    const expenseId = req.params.id;

    // 1. Delete the linked attachment from the Attachments collection
    await Attachment.findOneAndDelete({ expenseId: expenseId });

    // 2. Delete the actual expense record
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Expense and its receipt deleted successfully." 
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});




module.exports = router;