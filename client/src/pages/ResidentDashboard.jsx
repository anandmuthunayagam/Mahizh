import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Fade
} from "@mui/material";
import axios from "../utils/api/axios";
import HomeCard from "../components/HomeCard"; 

function ResidentDashboard() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      // ✅ Retrieve token from sessionStorage
      const token = sessionStorage.getItem("token");
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      try {
        setLoading(true);
        
        // 1. Get Resident Profile using token
        const profileRes = await axios.get("/resident/profile", authHeader);
        const residentProfile = profileRes.data;
        setProfile(residentProfile);

        const monthsList = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        const currentMonthIndex = new Date().getMonth(); 
        const currentYear = new Date().getFullYear();
        const relevantMonths = monthsList.slice(0, currentMonthIndex + 1);

        // 3. Fetch status for each month using token
        const historyData = await Promise.all(
          relevantMonths.map(async (month) => {
            try {
              const res = await axios.get(
                `/collections/status?homeNo=${residentProfile.homeNo}&month=${month}&year=${currentYear}`,
                authHeader
              );
              return {
                ...res.data,
                displayMonth: month,
                displayYear: currentYear
              };
            } catch (err) {
              return {
                status: "Unknown",
                displayMonth: month,
                displayYear: currentYear
              };
            }
          })
        );

        setHistory(historyData);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#38bdf8" }} />
      </Box>
    );
  }

  return (
    <Fade in={!loading}>
      <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#020617", minHeight: "100vh" }}>
        <Typography variant="h5" sx={{ color: "white", mb: 4, fontWeight: 700 }}>
          My Home Card - {new Date().getFullYear()}
        </Typography>

        <Grid container spacing={3}>
          {history.map((homeData, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${homeData.displayMonth}-${index}`}>
              <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 1, ml: 1, fontWeight: 600 }}>
                {homeData.displayMonth} {homeData.displayYear}
              </Typography>
              <HomeCard 
                home={homeData}
                selectedMonth={homeData.displayMonth}
                selectedYear={homeData.displayYear}
                sx={{ 
                  width: '100%',
                  boxShadow: homeData.status?.toUpperCase() === "PAID" 
                    ? "0 4px 12px rgba(0,0,0,0.4)" 
                    : "0 0 16px rgba(255, 193, 7, 0.4)"
                }} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
}

export default ResidentDashboard;