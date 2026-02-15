import React, { useEffect, useState, useRef } from "react";
import { Grid, Box, TextField, MenuItem, Typography, Button, Paper, Fade, Tooltip } from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { toPng } from 'html-to-image';
import axios from "../utils/api/axios";
import HomeCard from "./HomeCard";
import mahizh from '../assets/MahizhLogo.png';

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function Home() {
  // 1. DYNAMIC INITIALIZATION: Detect current month and year
  const currentMonthName = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleString('default', { month: 'long' });
  const currentYearValue = new Date().getFullYear();

  const [homes, setHomes] = useState([]);
  const [month, setMonth] = useState(currentMonthName); // Default to current month
  const [year, setYear] = useState(currentYearValue);   // Default to current year
  const contentRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const startYear = 2026;
  const YEARS = Array.from({ length: currentYearValue - startYear + 2 }, (_, i) => startYear + i).reverse();

  const isAdmin = () => localStorage.getItem("role") === "admin";

  useEffect(() => {
    axios.get("/owner-residents/home-status", { params: { month, year } })
      .then((res) => setHomes(res.data))
      .catch(console.error);
  }, [month, year]);

  const exportImage = async () => {
    if (contentRef.current === null) return;
    setIsExporting(true);
    try {
      setTimeout(async () => {
        const dataUrl = await toPng(contentRef.current, { 
          cacheBust: true,
          backgroundColor: "#020617",
          filter: (node) => !(node.classList && node.classList.contains('no-export')),
          style: { padding: '20px' }
        });
        const link = document.createElement('a');
        link.download = `Mahizh_Collections_${month}_${year}.png`;
        link.href = dataUrl;
        link.click();
        setIsExporting(false);
      }, 150);
    } catch (err) {
      console.error('Export failed', err);
      setIsExporting(false);
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box ref={contentRef} sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#020617", minHeight: "100vh" }}>
        
        {/* --- EXPORT HEADER --- */}
        <Box 
          className="print-header" 
          sx={{ 
            display: isExporting ? 'flex' : 'none', 
            mb: 4, 
            pb: 2, 
            borderBottom: '2px solid #1E293B' 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
              <Box sx={{ height: 120, width: 120, borderRadius: "50%", overflow: 'hidden', border: '2px solid #38bdf8' }}>
                <img src={mahizh} alt="Logo" style={{ width: '100%', height: '100%' }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, marginLeft: 'auto' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>Mahizh</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'rgb(56, 189, 248)' }}>Connect</Typography>
              </Box>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ color: "white", mb: 3, fontWeight: 600 }}>
          Maintenance Collections Insights - {month} {year}
        </Typography>

        {/* --- ADMIN CONTROLS --- */}
        {isAdmin() && (
          <Box className="no-export" sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Paper sx={{ p: 1, bgcolor: "#1e1e1e", display: 'flex', gap: 1.5, borderRadius: 2, border: "1px solid #444" }}>
              <TextField
                select size="small" label="Month" value={month}
                onChange={(e) => setMonth(e.target.value)}
                sx=
                {{ 
                  width: 130, 
                  "& .MuiOutlinedInput-root": { 
                    color: "white",
                    // This line specifically makes the arrow icon white
                    "& .MuiSvgIcon-root": { color: "white" } 
                  },
                  // Ensure the label is also visible
                  "& .MuiInputLabel-root": { color: "#bbb" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" }
                }}
                InputLabelProps={{ style: { color: "#bbb" } }}
              >
                {months.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <TextField
                select size="small" label="Year" value={year}
                onChange={(e) => setYear(e.target.value)}
                sx={{ 
                 width: 130, 
                  "& .MuiOutlinedInput-root": { 
                    color: "white",
                    // This line specifically makes the arrow icon white
                    "& .MuiSvgIcon-root": { color: "white" } 
                  },
                  // Ensure the label is also visible
                  "& .MuiInputLabel-root": { color: "#bbb" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" }
                }}
                InputLabelProps={{ style: { color: "#bbb" } }}
              >
                {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
            </Paper>
            <Tooltip title="Capture Screenshot">
             <Button
              variant="contained"
              startIcon={<PhotoCameraIcon />}
              onClick={exportImage}
              sx={{ bgcolor: "#3b82f6", fontWeight: 700, height: 30, minWidth: 40, '& .MuiButton-startIcon': { margin: 0 } }}
            />
            </Tooltip>
          </Box>
        )}

        <Grid container spacing={3}>
          {homes.map((home) => (
            <Grid item key={home.homeNo} xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* 2. SYNCED LABELS: Month & Year label added above card */}
              <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 1, ml: 1, fontWeight: 600 }}>
                {month} {year}
              </Typography>
              <HomeCard 
                home={home} 
                selectedMonth={month} // Pass the state variable
                selectedYear={year}   // Pass the state variable
                sx={{ width: '100%', flexGrow: 1 }} 
              />
            </Grid>
          ))}
        </Grid>
        {/*
        <Box sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="caption" sx={{ color: isExporting ? '#94a3b8' : '#38bdf8' }}>
            © {new Date().getFullYear()} Mahizh Connect
          </Typography>
        </Box>
        */}
      </Box>
    </Fade>
  );
}

export default Home;