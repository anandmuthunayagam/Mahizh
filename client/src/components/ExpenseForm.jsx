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

// ✅ Added token prop
function ExpenseForm({ onSuccess, token }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calculate month and year from the date string
    const dateObj = new Date(date);
    const extractedMonth = MONTH_NAMES[dateObj.getMonth()];
    const extractedYear = dateObj.getFullYear().toString();

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("month", extractedMonth); 
    formData.append("year", extractedYear);   

    // ✅ Changed key from "attachment" to "receipt"
    if (file) formData.append("attachment", file); // binary file

    try {
      await axios.post("/expenses", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      showSnackbar("Expense and Receipt saved!", "success");
    } catch (err) {
      showSnackbar("Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "#0F172A", borderRadius: 3, maxWidth: 500, border: "1px solid #1e293b" }}>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 1 }}>Add Expense</Typography>
      <Divider sx={{ mb: 3, bgcolor: "#1e293b" }} />

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField 
          label="Expense Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          fullWidth required sx={inputStyle} 
        />
        <TextField 
          label="Amount (₹)" 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          fullWidth required sx={inputStyle} 
        />
        <TextField 
          label="Date" 
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
          sx={{ mt: 1, color: 'white', borderColor: '#334155' }}
        >
          {file ? file.name : "Upload Receipt"}
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
        </Button>

        <Button 
          type="submit" 
          fullWidth 
          disabled={loading} 
          sx={{ 
            mt: 2, 
            height: 48, 
            background: "linear-gradient(135deg, #6366f1, #22d3ee)", 
            color: "white",
            fontWeight: 700 
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Expense"}
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