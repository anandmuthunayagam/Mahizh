import React, { useEffect, useState, useRef } from "react";
import { Grid, Box, TextField, MenuItem, Typography, Button, Paper, Stack, Fade } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { toPng } from 'html-to-image';
import axios from "../utils/api/axios";
import HomeCard from "./HomeCard";
import mahizh from '../assets/MahizhLogo.png'; // Ensure path matches Dashboard.jsx

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function Home() {
  const [homes, setHomes] = useState([]);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(2026);
  const contentRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false); // Controls header visibility for export
  
  const startYear = 2026;
  const currentYearValue = new Date().getFullYear();
  const YEARS = Array.from({ length: currentYearValue - startYear + 2 }, (_, i) => startYear + i).reverse();

  const isAdmin = () => localStorage.getItem("role") === "admin";
  
  useEffect(() => {
    axios.get("/owner-residents/home-status", { params: { month, year } })
      .then((res) => setHomes(res.data))
      .catch(console.error);
  }, [month, year]);

  const exportImage = async () => {
    if (contentRef.current === null) return;
    
    setIsExporting(true); // 1. Show header for capture

    try {
      // 2. Small delay to allow React to render the header
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
        
        
        
        setIsExporting(false); // 4. Hide header again
      }, 150);
    } catch (err) {
      console.error('Export failed', err);
      setIsExporting(false);
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box ref={contentRef} sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#020617", minHeight: "100vh" }}>
        
        {/* --- PDF & IMAGE HEADER (Visible only during export) --- */}
        <Box 
          className="print-header" 
          sx={{ 
            display: isExporting ? 'flex' : 'none', 
            mb: 4, 
            pb: 2, 
            borderBottom: isExporting ? '2px solid #1E293B' : 'none' 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
              {/* Logo on the left */}
              <Box sx={{ height: 120, width: 120, borderRadius: "50%", overflow: 'hidden', border: '2px solid #38bdf8' }}>
                <img src={mahizh} alt="Logo" style={{ width: '100%', height: '100%' }} />
              </Box>

              {/* Mahizh Connect pushed to the right */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                gap: 1, 
                marginLeft: 'auto' 
              }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: isExporting ? 'white' : 'black' }}>
                  Mahizh
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: isExporting ? 'rgb(56, 189, 248)' : 'black' }}>
                  Connect
                </Typography>
              </Box>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ color: "white", mb: 3, fontWeight: 600 }}>
          Maintenance Collections Insights - {month} {year}
        </Typography>

        {/* Control Group (Hidden in image export) */}
        {isAdmin() && (
          <Box 
            className="no-export" 
            sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
          >
           

            <Paper sx={{ p: 1, bgcolor: "#1e1e1e", display: 'flex', gap: 1.5, borderRadius: 2, border: "1px solid #444" }}>
              <TextField
                select size="small" label="Month" value={month}
                onChange={(e) => setMonth(e.target.value)}
                sx={{ width: 130, "& .MuiOutlinedInput-root": { color: "white" } }}
                InputLabelProps={{ style: { color: "#bbb" } }}
              >
                {months.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <TextField
                select size="small" label="Year" value={year}
                onChange={(e) => setYear(e.target.value)}
                sx={{ width: 100, "& .MuiOutlinedInput-root": { color: "white" } }}
                InputLabelProps={{ style: { color: "#bbb" } }}
              >
                {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
            </Paper>
             <Button
              variant="contained"
              startIcon={<PhotoCameraIcon />}
              onClick={exportImage}
              sx={{
                bgcolor: "#3b82f6",
                fontWeight: 700,
                textTransform: 'none',
                height: 30,
                minWidth: 0, // Reduces extra horizontal padding
                '& .MuiButton-startIcon': { 
                  margin: 0 // Removes the right margin intended for text
                }
              }}
            />
          </Box>
        )}

        <Grid container spacing={3}>
  {homes.map((home) => (
    <Grid 
      item 
      key={home.homeNo} 
      xs={12} 
      sm={6} 
      md={4} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        // This is the "magic" fix for content-driven width issues:
        flex: '1 1 0', 
        minWidth: 0 
      }}
    >
      <HomeCard 
        home={home} 
        sx={{ 
          width: '100%', 
          height: '100%', // Makes cards equal height in the same row
          display: 'flex',
          flexDirection: 'column'
        }} 
      />
    </Grid>
  ))}
</Grid>
{/* --- FOOTER --- */}
        <Box ref={contentRef} className="print-footer" sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="caption" sx={{ color: isExporting ? '#94a3b8' : '#000000' }}>
            © {new Date().getFullYear()} Mahizh Connect
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}

export default Home;