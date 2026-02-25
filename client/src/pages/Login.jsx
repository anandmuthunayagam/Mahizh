import React, { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  Alert,
  MenuItem, 
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
//import axios from "axios";
import axios from "../utils/api/axios";
import { useNavigate } from "react-router-dom";
import mahizh from '../assets/MahizhLogo.png'
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";


import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const url =
        role === "admin"
          ? `${import.meta.env.VITE_API_URL}/auth/admin/login`
          : `${import.meta.env.VITE_API_URL}/auth/user/login`;

      const res = await axios.post(url, { username, password });

      // ✅ DO NOT CHANGE (fixes Test Case 1)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: 380,
          p: 4,
          bgcolor: "#020617",
          color: "#fff",
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
        <Box
            component="img"
            src={mahizh}
            alt="Apartment Logo"
                
            sx={{
              height: 90,
              width: 90,
              mb: 1.5,
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(56,189,248,0.4)",
             }}
            
          />
          <Box style={{ display: "flex", gap: "5px" }}>
            <Typography variant="h5" fontWeight={600}>
              Mahizh
            </Typography>

            <Typography variant="h5" fontWeight={600} color="rgb(56, 189, 248)">
              Connect
            </Typography>
          </Box>
                   

          <Typography
            variant="body2"
            sx={{ color: "#94a3b8", mt: 0.5 }}
          >
            Please login to your account
          </Typography>
        </Box>


        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
              sx: { color: "#cbd5f5" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#38bdf8" },
              "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
            },
          }}
        />


        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
            sx: { color: "#cbd5f5" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: "#94a3b8" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: "#94a3b8" }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#38bdf8" },
              "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
            },
          }}
        />


        <TextField
            select
            fullWidth
            label="Role"
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            InputLabelProps={{
              shrink: true,
              sx: { color: "#cbd5f5" },
            }}
            SelectProps={{
              renderValue: (selected) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {selected === "admin" ? (
                    <AdminPanelSettingsIcon fontSize="small" />
                  ) : (
                    <PersonIcon fontSize="small" />
                  )}
                  <Typography sx={{ color: "#fff" }}>
                    {selected === "admin" ? "Admin" : "User"}
                  </Typography>
                </Box>
              ),
              sx: { color: "#fff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#38bdf8" },
                "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
              },
            }}
          >
            <MenuItem value="admin">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1,"&:hover": { bgcolor: "#1e293b" } }}>
                <AdminPanelSettingsIcon fontSize="small" />
                Admin
              </Box>
            </MenuItem>

            <MenuItem value="user">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1,"&:hover": { bgcolor: "#1e293b" } }}>
                <PersonIcon fontSize="small" />
                User
              </Box>
            </MenuItem>
        </TextField>



        <Button
            fullWidth
            sx={{
              mt: 3,
              py: 1.3,
              bgcolor: "#38bdf8",
              color: "#020617",
              fontWeight: 600,
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: "#0ea5e9",
                transform: "translateY(-1px)",
                boxShadow: "0 8px 20px rgba(56,189,248,0.4)",
              },
            }}
            onClick={handleLogin}
            disabled={loading}
          >
        {loading ? <CircularProgress size={24} /> : "Log In"}
      </Button>

      </Card>
    </Box>
  );
}

export default Login;
