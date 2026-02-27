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
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("amount", amount);
    formData.append("date", date);
    // Extract month and year from the 'date' string if the state is empty
  const dateObj = new Date(date);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  const extractedMonth = months[dateObj.getMonth()];
  const extractedYear = dateObj.getFullYear();

  formData.append("month", month || extractedMonth); // use state if exists, else extracted
  formData.append("year", year || extractedYear);   // use state if exists, else extracted

    if (file) formData.append("attachment", file); // binary file

    try {
      await axios.post("/expenses", formData, {
        headers: { "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
         }
      });
      showSnackbar("Expense and Receipt saved!", "success");
    } catch (err) {
      showSnackbar("Upload failed", "error");
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
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: 2, mb: 2, color: 'white', borderColor: '#555' }}
      >
        {file ? file.name : "Upload Receipt"}
        <input 
          type="file" 
          hidden 
          onChange={(e) => setFile(e.target.files[0])} 
        />
      </Button>

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