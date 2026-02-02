import React, { useEffect, useState } from "react";
import { Grid, Box, TextField, MenuItem, Typography } from "@mui/material";
import axios from "../utils/api/axios";
import HomeCard from "./HomeCard";


const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function Home() {
  const [homes, setHomes] = useState([]);
  const [month, setMonth] = useState("January");
  const year = 2026;

  useEffect(() => {
    axios
      .get("/dashboard/home-status", {
        params: { month, year },
      })
      .then((res) => setHomes(res.data))
      .catch(console.error);
      
  }, [month, year]);
  

  return (
    <>
    <Typography variant="h5" sx={{ color: "white", mb: 3, fontWeight: 600 }}>Payment Insights</Typography>
    
      {/* Month Selector */}
      <Box sx={{ mb: 3, maxWidth: 220,display:"flex",gap:"10px" }}>
        <TextField
            select
            fullWidth
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{
              bgcolor: "#1e1e1e",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "#bbb" },
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#777" },
              },
            }}
            >
              {months.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
            </TextField>
            <TextField
            
            fullWidth
            label="Year"
            value="2026"
            sx={{
              bgcolor: "#1e1e1e",
              borderRadius: 1,
              "& .MuiInputLabel-root": { color: "#bbb" },
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#777" },
              },
            }}
            >
            </TextField>
          
      </Box>
      
      {/* Cards */}
      <Grid container spacing={3} style={{justifyContent: "space-between"}}>
        {homes.map((home) => (
          <Grid item xs={12} sm={6} md={4} key={home.homeNumber}>
            <HomeCard home={home} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Home;
