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
      try {
        setLoading(true);
        
        // 1. Get Resident Profile to identify the home number
        const profileRes = await axios.get("/resident/profile");
        const residentProfile = profileRes.data;
        setProfile(residentProfile);

        // 2. Generate list of months from January to Current Month
        const monthsList = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        const currentMonthIndex = new Date().getMonth(); 
        const currentYear = new Date().getFullYear();
        
        // Create an array of month names from January (index 0) to current
        const relevantMonths = monthsList.slice(0, currentMonthIndex + 1);

        // 3. Fetch status for each month in parallel using the Home.jsx endpoint
        const statusPromises = relevantMonths.map(monthName => 
          axios.get("/owner-residents/home-status", { 
            params: { month: monthName, year: currentYear } 
          }).then(res => {
            // Find this specific resident's home in the returned list
            const myHomeData = res.data.find(h => h.homeNo === residentProfile.homeNo);
            return {
              ...myHomeData,
              displayMonth: monthName,
              displayYear: currentYear
            };
          })
        );

        const results = await Promise.all(statusPromises);
        
        // REMOVED .reverse() so January is first and Current Month is last
        setHistory(results); 
        
      } catch (err) {
        console.error("Error fetching payment history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: "#38bdf8" }} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
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
              {homeData && (
                <HomeCard 
                  home={homeData}
                  selectedMonth={homeData.displayMonth}
                  selectedYear={homeData.displayYear}
                  sx={{ 
                    width: '100%',
                    // Glow effect for unpaid (DUE) cards
                    boxShadow: homeData.status?.toUpperCase() === "PAID" 
                      ? "0 4px 12px rgba(0,0,0,0.4)" 
                      : "0 0 16px rgba(255, 193, 7, 0.4)"
                  }} 
                />
              )}
            </Grid>
          ))}
        </Grid>

        {history.length === 0 && (
          <Typography sx={{ color: "#94a3b8", textAlign: 'center', mt: 4 }}>
            No payment records found for this year.
          </Typography>
        )}
      </Box>
    </Fade>
  );
}

export default ResidentDashboard;