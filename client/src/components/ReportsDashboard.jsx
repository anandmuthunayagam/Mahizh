import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "../utils/api/axios";

function ReportsDashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
          setError("");
          const res = await axios.get(
            `/dashboard?month=${month}&year=${year}`
          );
          setData(res.data);
          } catch (err) {
              console.error("ReportsDashboard error:", err);
              setError("Reports under construction");
              setData(null);
              }
    };

    fetchReport();
  }, [month, year]);

  const StatCard = ({ title, value, gradient }) => (
    <Paper
      elevation={8}
      sx={{
        p: 3,
        borderRadius: 3,
        minWidth: 200,
        background: gradient,
      }}
    >
      <Typography sx={{ color: "#cbd5f5", fontSize: 14 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "white", fontSize: 26, fontWeight: 700 }}>
        ₹{value}
      </Typography>
    </Paper>
  );

  return (
    <Paper
      elevation={8}
      sx={{
        backgroundColor: "#020617",
        borderRadius: 3,
        p: 3,
        mt: 4,
        border: "1px solid #1e293b",
      }}
    >
      <Typography
        sx={{
          color: "#e5e7eb",
          fontWeight: 600,
          mb: 3,
          fontSize: 18,
        }}
      >
        Reports Dashboard
      </Typography>

      {/* Month & Year Selectors */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          select
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
          sx={{ minWidth: 140 }}
        >
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
          sx={{ minWidth: 140 }}
        >
          {[2024, 2025, 2026].map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Error */}
      {error && (
        <Typography sx={{ color: "#fca5a5", mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Report Cards */}
      {data && (
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <StatCard
            title="Total Collection"
            value={data.totalCollection}
            gradient="linear-gradient(135deg, #22c55e, #16a34a)"
          />
          <StatCard
            title="Total Expense"
            value={data.totalExpense}
            gradient="linear-gradient(135deg, #ef4444, #dc2626)"
          />
          <StatCard
            title="Balance"
            value={data.balance}
            gradient="linear-gradient(135deg, #6366f1, #22d3ee)"
          />
        </Box>
      )}
    </Paper>
  );
}

export default ReportsDashboard;
