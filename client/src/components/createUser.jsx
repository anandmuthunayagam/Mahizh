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
import { useSnackbar } from "../utils/context/SnackbarContext";

// ✅ UPDATED: Now accepting token as a prop from AdminDashboard
function CreateUser({ token }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [homeNo, setHomeNo] = useState("G1");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ AUTHENTICATION: Pass the session token in the headers
      const res = await axios.post(
        "/auth/admin/create-user", 
        { username, password, homeNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsername("");
      setPassword("");
      setHomeNo("G1");
      showSnackbar(res.data.message, "success");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Error creating user";
      setMessage(errMsg);
      showSnackbar(errMsg, "error");
      console.error("Create user failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "#0F172A", borderRadius: 3, maxWidth: 500, border: "1px solid #1e293b" }}>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
        Create Resident Account
      </Typography>
      <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3 }}>
        Register a new user and assign them to a specific apartment.
      </Typography>

      <Divider sx={{ mb: 3, bgcolor: "#1e293b" }} />

      <Box component="form" onSubmit={handleCreateUser} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={inputStyle}
          InputLabelProps={{ style: { color: "#bbb" } }}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={inputStyle}
          InputLabelProps={{ style: { color: "#bbb" } }}
        />

        <TextField
          select
          label="Assign Home"
          value={homeNo}
          onChange={(e) => setHomeNo(e.target.value)}
          fullWidth
          sx={inputStyle}
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
          <Typography sx={{ mt: 2, color: message.includes("success") ? "#22c55e" : "#ef4444", textAlign: "center", fontSize: "0.85rem" }}>
            {message}
          </Typography>
        )}
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

export default CreateUser;