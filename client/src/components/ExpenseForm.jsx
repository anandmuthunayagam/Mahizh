import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  MenuItem
} from "@mui/material";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYearValue = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => (currentYearValue - 2 + i).toString()).reverse();

// ✅ UPDATED: Accepting token as a prop
function ExpenseForm({ onSuccess, token }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("month", month);
    formData.append("year", year);
    if (file) formData.append("receipt", file);

    try {
      // ✅ AUTHENTICATION: Token added to headers for multipart/form-data
      await axios.post("/expenses", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });

      setTitle(""); setAmount(""); setDate(""); setMonth(""); setYear(""); setFile(null);
      onSuccess?.();
      showSnackbar("Expense added successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to add expense", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "#0F172A", borderRadius: 3, maxWidth: 500, border: "1px solid #1e293b" }}>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 1 }}>Add Expense</Typography>
      <Divider sx={{ mb: 3, bgcolor: "#1e293b" }} />

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField label="Expense Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required sx={inputStyle} />
        <TextField label="Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth required sx={inputStyle} />
        <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth required sx={inputStyle} InputLabelProps={{ shrink: true }} />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField select label="Month" value={month} onChange={(e) => setMonth(e.target.value)} fullWidth required sx={inputStyle}>
            {MONTH_NAMES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
          <TextField select label="Year" value={year} onChange={(e) => setYear(e.target.value)} fullWidth required sx={inputStyle}>
            {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
        </Box>

        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 2, color: 'white', borderColor: '#334155' }}>
          {file ? file.name : "Upload Receipt"}
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
        </Button>

        <Button type="submit" fullWidth disabled={loading} sx={{ mt: 2, height: 48, borderRadius: 2, background: "linear-gradient(135deg, #6366f1, #22d3ee)", color: "white" }}>
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
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
};

export default ExpenseForm;