// Login.jsx - Updated with Backdrop and Snackbar Support

import React, { useState, useEffect } from "react";
import {
  Box, Card, TextField, Typography, Button, Alert, 
  IconButton, InputAdornment, CircularProgress,
  Backdrop, Snackbar // ✅ Added imports
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ New state for Snackbar management
  const [status, setStatus] = useState({
    open: false,
    msg: "",
    severity: "info"
  });

  const navigate = useNavigate();

  useEffect(() => {
    const apiwarmUp = async () => {
      try {
        await axios.get(`https://mahizhconnect.onrender.com/`); 
      } catch (err) {
        console.log("Server is warming up...");
      }
    };
    apiwarmUp();
  }, []);

  useEffect(() => {
    const warmUp = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/health`);
      } catch (err) {
        console.log("Server is warming up...");
      }
    };
    warmUp();
  }, []);

  // ✅ Helper to close Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setStatus({ ...status, open: false });
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    // ✅ Show "Logging in..." Snackbar immediately
    setStatus({ open: true, msg: "Logging in...", severity: "info" });

    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/login`; 
      const res = await axios.post(url, { username, password });

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      sessionStorage.setItem("username", res.data.username);

      // ✅ Update Snackbar to Success
      setStatus({ open: true, msg: "Login Successful!", severity: "success" });

      // Small delay so user sees the success message before navigating
      setTimeout(() => {
        setLoading(false);
        navigate("/mahizhconnect");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid username or password";
      setError(errorMsg);
      // ✅ Update Snackbar to Error
      setStatus({ open: true, msg: errorMsg, severity: "error" });
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center" }}>
      
      {/* ✅ 1. BACKDROP OVERLAY */}
      <Backdrop
        sx={{ 
          color: '#38bdf8', 
          zIndex: (theme) => theme.zIndex.drawer + 2, // Ensure it's above the Card
          backdropFilter: 'blur(4px)',
          bgcolor: 'rgba(2, 6, 23, 0.7)'
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
        Verifying Credentials...
      </Typography>
      </Backdrop>

      {/* ✅ 2. SNACKBAR NOTIFICATION */}
      <Snackbar
        open={status.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={status.severity} 
          variant="filled" 
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 'bold' }}
        >
          {status.msg}
        </Alert>
      </Snackbar>

      <Card sx={{ width: 380, p: 4, bgcolor: "#020617", color: "#fff", borderRadius: 3, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Box component="img" src={mahizh} alt="Logo" sx={{ height: 90, width: 90, mb: 1.5, borderRadius: "50%", boxShadow: "0 4px 12px rgba(56,189,248,0.4)" }} />
          <Box style={{ display: "flex", gap: "5px" }}>
            <Typography variant="h5" fontWeight={600}>Mahizh</Typography>
            <Typography variant="h5" fontWeight={600} color="#38bdf8">Connect</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>Please login to your account</Typography>
        </Box>

        {/* Keeping old Error Alert as a fallback, though Snackbar now handles this too */}
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

        <Button
          fullWidth
          sx={{ mt: 3, py: 1.3, bgcolor: "#38bdf8", color: "#020617", fontWeight: 600, "&:hover": { bgcolor: "#0ea5e9", transform: "translateY(-1px)", boxShadow: "0 8px 20px rgba(56,189,248,0.4)" } }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Processing..." : "Log In"}
        </Button>
      </Card>
    </Box>
  );
}

export default Login;