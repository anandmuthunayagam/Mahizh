import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
  Divider,
  Typography
} from "@mui/material";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

const homes = ["G1", "F1", "F2", "S1", "S2"];

// ✅ UPDATED: Accepting token as a prop from AdminDashboard
function OwnerResidentForm({ onSuccess, token }) {
  const [homeNo, setHomeNo] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [residentName, setResidentName] = useState("");
  const [residentPhone, setResidentPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ AUTHENTICATION: Pass the session token in headers
      await axios.post("/owner-residents", {
        homeNo,
        owner: { name: ownerName, phone: ownerPhone },
        resident: { name: residentName, phone: residentPhone },
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHomeNo(""); setOwnerName(""); setOwnerPhone("");
      setResidentName(""); setResidentPhone("");
      onSuccess?.();
      showSnackbar("Owner & Resident details saved successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to save details. Please try again.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "#0F172A", borderRadius: 3, maxWidth: 600, border: "1px solid #1e293b" }}>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 3 }}>
        Property Setup
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          select fullWidth label="Select Home" value={homeNo}
          onChange={(e) => setHomeNo(e.target.value)}
          margin="normal" required
          sx={inputStyle}
        >
          {homes.map((h) => (
            <MenuItem key={h} value={h}>{h}</MenuItem>
          ))}
        </TextField>

        <Divider sx={{ my: 3, bgcolor: "#1e293b" }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
           <TextField
            fullWidth label="Owner Name" value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            margin="normal" required sx={inputStyle}
          />
          <TextField
            fullWidth label="Owner Phone" value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            margin="normal" required sx={inputStyle}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth label="Resident Name" value={residentName}
            onChange={(e) => setResidentName(e.target.value)}
            margin="normal" required sx={inputStyle}
          />
          <TextField
            fullWidth label="Resident Phone" value={residentPhone}
            onChange={(e) => setResidentPhone(e.target.value)}
            margin="normal" required sx={inputStyle}
          />
        </Box>

        <Button
          type="submit" fullWidth disabled={loading}
          sx={{
            height: 48, borderRadius: 2, fontWeight: 600,
            color: "white", textTransform: "uppercase",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            "&:hover": { opacity: 0.9 },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save Details"}
        </Button>
      </Box>
    </Paper>
  );
}

// ✅ STYLES: Defined here to fix ReferenceError
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& .MuiSvgIcon-root": { color: "white" },
    "& fieldset": { borderColor: "#555" },
    "&:hover fieldset": { borderColor: "#38bdf8" },
  },
  "& .MuiInputLabel-root": { color: "#bbb" },
};

export default OwnerResidentForm;