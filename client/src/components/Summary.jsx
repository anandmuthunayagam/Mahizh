import React, { useEffect, useState } from "react";
import { Box, Divider, Paper, Stack, Typography, CircularProgress } from "@mui/material";
import axios from "../utils/api/axios";

// ✅ UPDATED: Accepting token as a prop from AdminDashboard
function Summary({ refreshKey, token }) {
  const [collections, setCollections] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        // ✅ AUTHENTICATION: Pass the session token in headers
        const [collRes, expRes] = await Promise.all([
          axios.get("/collections", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/expenses", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCollections(collRes.data);
        setExpenses(expRes.data);
      } catch (err) {
        console.error("Summary fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, token]);

  const totalCollected = collections.reduce((s, c) => s + c.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalCollected - totalSpent;

  const Card = ({ title, value, gradient }) => (
    <Paper
      elevation={12}
      sx={{
        p: 2,
        borderRadius: 2,
        background: gradient,
        flex: "1 1 200px",
        minWidth: 220,
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      }}
    >
      <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "bold", textTransform: "uppercase" }}>
        {title}
      </Typography>
      <Typography sx={{ color: "white", fontSize: 32, fontWeight: 800, mt: 1 }}>
        ₹{value.toLocaleString()}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, width: '100%' }}>
        <CircularProgress sx={{ color: "#38bdf8" }} />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 4, bgcolor: "#1e293b", borderRadius: 3, border: "1px solid #334155", width: "100%" }}>
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Box>
          <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
            Corpus Snapshot
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Overall financial health across all units
          </Typography>
        </Box>
        
        <Divider sx={{ width: '60%', bgcolor: "#334155", opacity: 0.5 }} />

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", width: "100%", justifyContent: "center" }}>
          <Card
            title="Total Collection"
            value={totalCollected}
            gradient="linear-gradient(135deg, #059669, #10b981)"
          />
          <Card
            title="Total Expenses"
            value={totalSpent}
            gradient="linear-gradient(135deg, #b91c1c, #ef4444)"
          />
          <Card
            title="Net Balance"
            value={balance}
            gradient="linear-gradient(135deg, #4f46e5, #6366f1)"
          />
        </Box>
      </Stack>
    </Paper>
  );
}

export default Summary;