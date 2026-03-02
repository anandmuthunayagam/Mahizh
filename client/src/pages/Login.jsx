// Login.jsx - Updated for Unified Login

import React, { useState, useEffect } from "react";
import {
  Box, Card, TextField, Typography, Button, Alert, 
  IconButton, InputAdornment, CircularProgress
} from "@mui/material";
import axios from "../utils/api/axios";
import { useNavigate } from "react-router-dom";
import mahizh from '../assets/MahizhLogo.png'
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // role state is REMOVED
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Keep your existing useEffect wake-up calls here...

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Hits the unified endpoint instead of role-specific ones
      const url = `${import.meta.env.VITE_API_URL}/auth/login`; 
      const res = await axios.post(url, { username, password });

      // The role is now determined by the server response
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      sessionStorage.setItem("username", res.data.username);

      // Redirect remains the same, but 'role' comes from the API response
      navigate("/mahizhconnect");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card sx={{ width: 380, p: 4, bgcolor: "#020617", color: "#fff", borderRadius: 3, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Box component="img" src={mahizh} alt="Logo" sx={{ height: 90, width: 90, mb: 1.5, borderRadius: "50%", boxShadow: "0 4px 12px rgba(56,189,248,0.4)" }} />
          <Box style={{ display: "flex", gap: "5px" }}>
            <Typography variant="h5" fontWeight={600}>Mahizh</Typography>
            <Typography variant="h5" fontWeight={600} color="#38bdf8">Connect</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>Please login to your account</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true, sx: { color: "#cbd5f5" } }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ color: "#94a3b8" }} /></InputAdornment>),
          }}
          sx={{ "& .MuiOutlinedInput-root": { color: "#fff", "& fieldset": { borderColor: "#334155" }, "&:hover fieldset": { borderColor: "#38bdf8" }, "&.Mui-focused fieldset": { borderColor: "#38bdf8" } } }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true, sx: { color: "#cbd5f5" } }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: "#94a3b8" }} /></InputAdornment>),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#94a3b8" }}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ "& .MuiOutlinedInput-root": { color: "#fff", "& fieldset": { borderColor: "#334155" }, "&:hover fieldset": { borderColor: "#38bdf8" }, "&.Mui-focused fieldset": { borderColor: "#38bdf8" } } }}
        />

        {/* ROLE DROPDOWN TEXTFIELD REMOVED */}

        <Button
          fullWidth
          sx={{ mt: 3, py: 1.3, bgcolor: "#38bdf8", color: "#020617", fontWeight: 600, "&:hover": { bgcolor: "#0ea5e9", transform: "translateY(-1px)", boxShadow: "0 8px 20px rgba(56,189,248,0.4)" } }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
        </Button>
      </Card>
    </Box>
  );
}

export default Login;