import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "../utils/api/axios";

function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [homeNo, setHomeNo] = useState("G1");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/auth/admin/create-user", {
        username,
        password,
        homeNo,
      });

      setMessage(res.data.message);
      setUsername("");
      setPassword("");
      setHomeNo("G1");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#1e293b", // Outer card color
        borderRadius: 3,
        p: 1,
        maxWidth: 420,
        border: "1px solid #334155",
        mb: 4,
      }}
    >
      
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#020617", // Inner card color matching image
          borderRadius: 3,
          p: 1,
          border: "1px solid #1e293b",
        }}
      >
        

        <Box component="form" onSubmit={handleCreateUser}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            label="Home Number"
            value={homeNo}
            onChange={(e) => setHomeNo(e.target.value)}
            margin="normal"
            InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ mb: 4 }}
          >
            {["G1", "F1", "F2", "S1", "S2"].map((h) => (
              <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              height: 48,
              borderRadius: 2,
              fontWeight: 600,
              color: "white",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              "&:hover": { opacity: 0.9 },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create User"}
          </Button>

          {message && (
            <Typography sx={{ mt: 2, color: message.includes("success") ? "#22c55e" : "#ef4444", textAlign: "center" }}>
              {message}
            </Typography>
          )}
          <Divider sx={{ borderColor: "#1E293B", mt: 4 }} />
        </Box>
      </Paper>
    </Paper>
  );
}

export default CreateUser;