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

const homes = ["G1", "F1", "F2", "S1", "S2"];
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function CollectionForm({ onSuccess }) {
  const [homeNumber, setHomeNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/collections", {
        homeNumber,
        amount: Number(amount),   // ✅ ensure number
        month,
        year: Number(year),       // ✅ ensure number
      });

      console.log("Collection API response:", res);

      // ✅ ONLY success path
      if (res?.data?.success === true) {
        setHomeNumber("");
        setAmount("");
        setMonth("");
        setYear("");
        onSuccess?.();
        return;
      }

      // ❌ Backend responded but not success
      throw new Error(res?.data?.message || "Unexpected API response");

    } catch (err) {
      console.error("Add collection failed:", err);
      alert(err?.response?.data?.message || "Failed to add collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        backgroundColor: "#020617",
        borderRadius: 3,
        p: 3,
        maxWidth: 420,
        border: "1px solid #1e293b",
      }}
    >
      <Typography sx={{ color: "#e5e7eb", mb: 2, fontWeight: 600 }}>
        Add Monthly Collection
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="Home Number"
          value={homeNumber}
          onChange={(e) => setHomeNumber(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        >
          {homes.map((home) => (
            <MenuItem key={home} value={home}>
              {home}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="number"
          label="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <TextField
          select
          fullWidth
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        >
          {months.map((m) => (
            <MenuItem key={m} value={m}>{m}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        >
          {[2025, 2026, 2027].map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </TextField>

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
            "Add Collection"
          )}
        </Button>

        <Divider sx={{ borderColor: "#1E293B", mt: 3 }} />
      </Box>
    </Paper>
  );
}

export default CollectionForm;
