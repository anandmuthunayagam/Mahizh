import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "../utils/api/axios";

const homes = ["G1", "F1", "F2", "S1", "S2"];

function OwnerResidentForm({ onSuccess }) {
  const [homeNo, setHomeNo] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [residentName, setResidentName] = useState("");
  const [residentPhone, setResidentPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/owner-residents", {
        homeNo,
        owner: { name: ownerName, phone: ownerPhone },
        resident: { name: residentName, phone: residentPhone },
      });

      setHomeNo(""); setOwnerName(""); setOwnerPhone("");
      setResidentName(""); setResidentPhone("");
      onSuccess?.();
      alert("Owner & Resident saved successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#1e293b",
        p: 1,
        borderRadius: 3,
        maxWidth: 420,
        border: "1px solid #334155",
        mb: 4,
      }}
    >
      

      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#020617",
          p: 4,
          borderRadius: 3,
          border: "1px solid #1e293b",
        }}
      >
        

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select fullWidth label="Home No"
            value={homeNo} onChange={(e) => setHomeNo(e.target.value)}
            margin="normal" InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ mb: 2 }}
          >
            {homes.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
          </TextField>

          <TextField
            fullWidth label="Owner Name" value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            margin="normal" InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth label="Owner Phone" value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            margin="normal" InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth label="Resident Name" value={residentName}
            onChange={(e) => setResidentName(e.target.value)}
            margin="normal" InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth label="Resident Phone" value={residentPhone}
            onChange={(e) => setResidentPhone(e.target.value)}
            margin="normal" InputLabelProps={{ style: { color: "#cbd5f5" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{ mb: 4 }}
          />

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
          <Divider sx={{ borderColor: "#1E293B", mt: 4 }} />
        </Box>
      </Paper>
    </Paper>
  );
}

export default OwnerResidentForm;