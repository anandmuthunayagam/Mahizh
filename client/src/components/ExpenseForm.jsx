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

function ExpenseForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/expenses", {
        title,
        amount: Number(amount),   // ✅ ensure number
        date,                     // yyyy-mm-dd
      });

      console.log("Expense API response:", res);

      // ✅ ONLY treat explicit success as success
      if (res?.data?.success === true) {
        setTitle("");
        setAmount("");
        setDate("");
        onSuccess?.();
        return;
      }

      // ❌ backend responded but not success
      throw new Error(res?.data?.message || "Unexpected API response");

    } catch (err) {
      console.error("Add expense failed:", err);
      alert(err?.response?.data?.message || "Failed to add Expense");
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
        Add Expense
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        />

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
          fullWidth
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
            style: { color: "#cbd5f5" },
          }}
          InputProps={{ style: { color: "white" } }}
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
  );
}

export default ExpenseForm;
