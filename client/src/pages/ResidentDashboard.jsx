import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import axios from "../utils/api/axios";
import HomeCard from "../components/HomeCard"; // Import the existing card component

function ResidentDashboard() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch profile and payment status based on logged-in user mapping
    axios.get("/resident/profile").then(res => setProfile(res.data));
    axios.get("/resident/current-status").then(res => setStatus(res.data));
  }, []);

  // Construct the home object for HomeCard prop
  // This maps the resident's data to the standard 'home' format
  const homeData = profile && status ? {
    homeNo: profile.homeNo,
    owner: profile.owner,
    resident: profile.resident,
    status: status.status, // e.g., "Paid" or "Pending"
    month: status.month,
    year: status.year
  } : null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: "white", mb: 3, fontWeight: 700 }}>
        My Home Dashboard
      </Typography>

      <Grid container spacing={3}>
        {homeData ? (
          <Grid item xs={12} sm={8} md={4}>
            {/* Display the standard HomeCard for the mapped user */}
            <HomeCard home={homeData} />
          </Grid>
        ) : (
          <Typography sx={{ color: "#94a3b8", p: 2 }}>
            Loading your home details...
          </Typography>
        )}
      </Grid>

      {/* Optional: You can keep the detailed text view below if needed */}
      {!homeData && profile && (
        <Paper sx={styles.container}>
          <Typography sx={styles.text}>Home No: {profile.homeNo}</Typography>
          <Typography sx={styles.text}>Owner: {profile.owner?.name}</Typography>
          <Typography sx={styles.text}>Resident: {profile.resident?.name}</Typography>
        </Paper>
      )}
    </Box>
  );
}

const styles = {
  container: {
    backgroundColor: "#020617",
    border: "1px solid #1e293b",
    p: 3,
    borderRadius: 3,
    mt: 3
  },
  text: {
    color: "#cbd5f5",
    mb: 1,
  },
};

export default ResidentDashboard;