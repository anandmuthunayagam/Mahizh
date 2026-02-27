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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ExpenseForm({ onSuccess, token }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(""); // Format: YYYY-MM-DD from input
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ AUTO-CALCULATE Month and Year from the Date input
    const selectedDate = new Date(date);
    const calculatedMonth = MONTH_NAMES[selectedDate.getMonth()];
    const calculatedYear = selectedDate.getFullYear().toString();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("month", calculatedMonth); // Sent to backend automatically
    formData.append("year", calculatedYear);   // Sent to backend automatically
    if (file) formData.append("receipt", file);

    try {
      await axios.post("/expenses", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });

      setTitle(""); setAmount(""); setDate(""); setFile(null);
      onSuccess?.();
      showSnackbar("Expense added successfully!", "success");
    } catch (err) {
      // If server returns 500, log the exact response for debugging
      console.error("Server Error Detail:", err.response?.data);
      showSnackbar(err.response?.data?.message || "Server Error (500): Check backend logs", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "#0F172A", borderRadius: 3, maxWidth: 500, border: "1px solid #1e293b" }}>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 1 }}>Add Expense</Typography>
      <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>The month and year will be recorded based on the date selected.</Typography>
      <Divider sx={{ mb: 3, bgcolor: "#1e293b" }} />

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField 
          label="Expense Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          fullWidth required sx={inputStyle} 
          placeholder="e.g., Monthly Water Bill"
        />
        
        <TextField 
          label="Amount (₹)" 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          fullWidth required sx={inputStyle} 
        />
        
        <TextField 
          label="Date of Expense" 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          fullWidth required sx={inputStyle} 
          InputLabelProps={{ shrink: true }} 
        />
        
        <Button 
          component="label" 
          variant="outlined" 
          startIcon={<CloudUploadIcon />} 
          sx={{ mt: 1, color: 'white', borderColor: '#334155', height: '56px' }}
        >
          {file ? file.name : "Upload Receipt (Optional)"}
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
        </Button>

        <Button 
          type="submit" 
          fullWidth 
          disabled={loading} 
          sx={{ 
            mt: 2, 
            height: 48, 
            borderRadius: 2, 
            fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1, #22d3ee)", 
            color: "white" 
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save Expense"}
        </Button>
      </Box>
    </Paper>
  );
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": { borderColor: "#334155" },
    "&:hover fieldset": { borderColor: "#38bdf8" },
    "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
};

export default ExpenseForm;