import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "../utils/api/axios";

function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [homeNo, setHomeNo] = useState("G1");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/auth/admin/create-user", {
        username,
        password, // plain password (hashed in backend)
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
      elevation={8}
      sx={{
        backgroundColor: "#020617",
        borderRadius: 3,
        p: 3,
        maxWidth: 420,
        border: "1px solid #1e293b",
        mb: 4,
      }}
    >
      <Typography
        sx={{
          color: "#e5e7eb",
          fontWeight: 600,
          mb: 2,
          fontSize: 18,
        }}
      >
        Create User (Admin Only)
      </Typography>

      <Box>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
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
        >
          {["G1", "F1", "F2", "S1", "S2"].map((h) => (
            <MenuItem key={h} value={h}>
              {h}
            </MenuItem>
          ))}
        </TextField>

        <Button
          fullWidth
          onClick={handleCreateUser}
          disabled={loading}
          sx={{
            mt: 3,
            height: 48,
            borderRadius: 2,
            fontWeight: 600,
            color: "white",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          {loading ? (
            <CircularProgress size={22} sx={{ color: "white" }} />
          ) : (
            "Create User"
          )}
        </Button>

        {message && (
          <Typography
            sx={{
              mt: 2,
              color: message.includes("success") ? "#22c55e" : "#ef4444",
              fontSize: 14,
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default CreateUser;
