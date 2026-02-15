import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

// Constants for extraction
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ExpenseForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return alert("Please select a date"); // Validation check
    
    setLoading(true);

    try {
      // 1. Create a Date object from the yyyy-mm-dd string
      // Note: yyyy-mm-dd strings are treated as UTC by default in JavaScript
      const dateObj = new Date(date);
      
      // 2. Extract Month Name and Year using UTC to avoid timezone shifts
      const extractedMonth = MONTH_NAMES[dateObj.getUTCMonth()];
      const extractedYear = dateObj.getUTCFullYear();

      // 3. Send updated payload to match your new Expense.js model
      const res = await axios.post("/expenses", {
        title,
        amount: Number(amount),
        date,               // Original date string for the Date field
        month: extractedMonth, // "February"
        year: extractedYear    // 2025
      });

      

      if (res?.data?.success === true) {
        setTitle("");
        setAmount("");
        setDate("");
        onSuccess?.(showSnackbar("Expense added successfully!", "success"));
        return;
      }

      throw new Error(res?.data?.message || "Unexpected API response");

    } catch (err) {
      console.error("Add expense failed:", err);
      showSnackbar(err?.response?.data?.message || "Failed to add Expense", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#1e293b",
        borderRadius: 3,
        p: 1,
        maxWidth: 500,
        border: "1px solid #334155",
        mb: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          backgroundColor: "#020617",
          borderRadius: 3,
          p: 1,
          maxWidth: 420,
          border: "1px solid #1e293b",
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ 
                 
                  "& .MuiOutlinedInput-root": { 
                    color: "white",
                    // This line specifically makes the arrow icon white
                    "& .MuiSvgIcon-root": { color: "white" } 
                  },
                  // Ensure the label is also visible
                  "& .MuiInputLabel-root": { color: "#bbb" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" }
                }}
            margin="normal"
            required
            InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
          />

          <TextField
            fullWidth
            type="number"
            label="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ 
                 
                  "& .MuiOutlinedInput-root": { 
                    color: "white",
                    // This line specifically makes the arrow icon white
                    "& .MuiSvgIcon-root": { color: "white" } 
                  },
                  // Ensure the label is also visible
                  "& .MuiInputLabel-root": { color: "#bbb" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" }
                }}
            margin="normal"
            required
            InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
          />

          <TextField
  fullWidth
  type="date"
  label="Date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  margin="normal"
  required
  InputLabelProps={{
    shrink: true,
    style: { color: "#cbd5f5" },
  }}
  sx={{
    // Main input text color
    "& .MuiInputBase-input": {
      color: "white",
    },
    // Styling the calendar icon for Chrome/Safari/Edge
    "& input::-webkit-calendar-picker-indicator": {
      filter: "invert(100%)", // This flips the black icon to white
      cursor: "pointer",
    },
    // Background and border styling to match your theme
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#020617",
      "& fieldset": {
        borderColor: "#334155",
      },
      "&:hover fieldset": {
        borderColor: "#6366f1",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#22d3ee",
      },
    },
  }}
/>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              height: 48,
              borderRadius: 2,
              fontWeight: 600,
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              color: "white",
              "&:hover": { opacity: 0.9 },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              "Add Expense"
            )}
          </Button>

          <Divider sx={{ borderColor: "#1E293B", mt: 3 }} />
        </Box>
      </Paper>
    </Paper>
  );
}

export default ExpenseForm;