import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

const homes = ["G1", "F1", "F2", "S1", "S2"];
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const categories = ["Maintenance", "Water", "Corpus Fund", "Others"];

// ✅ Logic to generate years (e.g., 2024 to 2026)
const startYear = 2024;
const currentYearValue = new Date().getFullYear();
const YEARS = Array.from(
  { length: currentYearValue - startYear + 2 }, 
  (_, i) => (startYear + i).toString()
).reverse();

function CollectionForm({ onSuccess, token }) {
  const [homeNo, sethomeNo] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Included Authorization Header
      await axios.post("/collections", {
        homeNo,
        amount: Number(amount),
        month,
        year: Number(year),
        category,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      sethomeNo(""); setAmount(""); setMonth(""); setYear(""); setCategory("");
      onSuccess?.();
      showSnackbar("Collection added successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to add collection", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "#0F172A", borderRadius: 3, maxWidth: 500, border: "1px solid #1e293b" }}>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
        Add Collection
      </Typography>
      <Divider sx={{ mb: 3, bgcolor: "#1e293b" }} />

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          select label="Home No" value={homeNo}
          onChange={(e) => sethomeNo(e.target.value)}
          fullWidth required sx={inputStyle}
        >
          {homes.map((h) => (<MenuItem key={h} value={h}>{h}</MenuItem>))}
        </TextField>

        <TextField
          label="Amount (₹)" type="number" value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth required sx={inputStyle}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select label="Month" value={month}
            onChange={(e) => setMonth(e.target.value)}
            fullWidth required sx={inputStyle}
          >
            {months.map((m) => (<MenuItem key={m} value={m}>{m}</MenuItem>))}
          </TextField>

          {/* ✅ FIXED: Added MenuItem mapping for Year */}
          <TextField
            select
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            fullWidth
            required
            sx={inputStyle}
          >
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </TextField>
        </Box>

        <TextField
          select label="Category" value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth required sx={inputStyle}
        >
          {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
        </TextField>

        <Button
          type="submit" fullWidth disabled={loading}
          sx={{
            mt: 2, height: 48, borderRadius: 2, fontWeight: 600,
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            color: "white", "&:hover": { opacity: 0.9 },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Collection"}
        </Button>
      </Box>
    </Paper>
  );
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& .MuiSvgIcon-root": { color: "white" },
    "& fieldset": { borderColor: "#555" },
    "&:hover fieldset": { borderColor: "#38bdf8" },
  },
  "& .MuiInputLabel-root": { color: "#bbb" },
};

export default CollectionForm;