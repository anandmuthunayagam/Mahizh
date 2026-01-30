import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import axios from "../utils/api/axios";

function Summary({refreshKey}) {
  const [collections, setCollections] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get("/collections").then(res => setCollections(res.data));
    axios.get("/expenses").then(res => setExpenses(res.data));
  }, [refreshKey]);

  const totalCollected = collections.reduce((s, c) => s + c.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalCollected - totalSpent;

  const Card = ({ title, value, gradient }) => (
    <Paper
      elevation={8}
      sx={{
        p: 3,
        borderRadius: 3,
        background: gradient,
        minWidth: 220,
      }}
    >
      <Typography sx={{ color: "#cbd5f5", fontSize: 14 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "white", fontSize: 28, fontWeight: 700 }}>
        ₹{value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
      <Card
        title="Total Collection"
        value={totalCollected}
        gradient="linear-gradient(135deg, #22c55e, #16a34a)"
      />
      <Card
        title="Total Expense"
        value={totalSpent}
        gradient="linear-gradient(135deg, #ef4444, #dc2626)"
      />
      <Card
        title="Balance"
        value={balance}
        gradient="linear-gradient(135deg, #6366f1, #22d3ee)"
      />
    </Box>
  );
}

export default Summary;
