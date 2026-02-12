import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import axios from "../utils/api/axios";

function ResidentDashboard() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios.get("/resident/profile").then(res => setProfile(res.data));
    axios.get("/resident/current-status").then(res => setStatus(res.data));
  }, []);

  return (
    <Paper sx={styles.container}>
      <Typography sx={styles.title}>My Home Dashboard</Typography>

      {profile && (
        <>
          <Typography sx={styles.text}>Home No: {profile.homeNo}</Typography>
          <Typography sx={styles.text}>
            Owner: {profile.owner?.name}
          </Typography>
          <Typography sx={styles.text}>
            Resident: {profile.resident?.name}
          </Typography>
        </>
      )}

      <Divider sx={styles.divider} />

      {status && (
        <Grid container spacing={2}>
          <Grid item>
            <Chip
              label={`${status.month} ${status.year}`}
              color="info"
            />
          </Grid>
          <Grid item>
            <Chip
              label={status.status}
              color={status.status === "Paid" ? "success" : "error"}
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

const styles = {
  container: {
    backgroundColor: "#020617",
    border: "1px solid #1e293b",
    p: 3,
    borderRadius: 3,
  },
  title: {
    color: "#e5e7eb",
    fontWeight: 700,
    mb: 2,
  },
  text: {
    color: "#cbd5f5",
    mb: 1,
  },
  divider: {
    borderColor: "#1e293b",
    my: 2,
  },
};

export default ResidentDashboard;
