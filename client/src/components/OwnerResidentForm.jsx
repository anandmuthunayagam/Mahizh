import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
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
        owner: {
          name: ownerName,
          phone: ownerPhone,
        },
        resident: {
          name: residentName,
          phone: residentPhone,
        },
      });

      setHomeNo("");
      setOwnerName("");
      setOwnerPhone("");
      setResidentName("");
      setResidentPhone("");
      setLoading(false);
      onSuccess?.();
      alert("Owner & Resident saved");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        backgroundColor: "#020617",
        p: 3,
        borderRadius: 3,
        border: "1px solid #1e293b",
        maxWidth: 500,
      }}
    >
      <Typography sx={{ color: "#e5e7eb", mb: 2, fontWeight: 600 }}>
        Owner / Resident Setup (Admin)
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="Home No"
          value={homeNo}
          onChange={(e) => setHomeNo(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        >
          {homes.map((h) => (
            <MenuItem key={h} value={h}>{h}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Owner Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <TextField
          fullWidth
          label="Owner Phone"
          value={ownerPhone}
          onChange={(e) => setOwnerPhone(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <TextField
          fullWidth
          label="Resident Name"
          value={residentName}
          onChange={(e) => setResidentName(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <TextField
          fullWidth
          label="Resident Phone"
          value={residentPhone}
          onChange={(e) => setResidentPhone(e.target.value)}
          margin="normal"
          InputLabelProps={{ style: { color: "#cbd5f5" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <Button
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            mt: 3,
            height: 48,
            borderRadius: 2,
            fontWeight: 600,
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            color: "white",
          }}
        >
          {loading ? <CircularProgress size={22} /> : "Save Details"}
        </Button>
      </Box>
    </Paper>
  );
}

export default OwnerResidentForm;
