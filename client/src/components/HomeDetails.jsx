import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import G1 from "../assets/homes/G1.png";
import F1 from "../assets/homes/F1.png";
import F2 from "../assets/homes/F2.png";
import S1 from "../assets/homes/S1.png";
import S2 from "../assets/homes/S2.png";

const homeImages = { G1, F1, F2, S1, S2 };

const guidelines = [
  { title: "Financial Rules", body: "Maintenance is due by 5th of every month." },
  { title: "Water Management", body: "Turn off the motors after use. Report leaks immediately." },
  { title: "Waste Management", body: "Dispose garbage in trucks. Keep common areas clean." },
  { title: "Safety & Security", body: "Common areas are under 24/7 CCTV surveillance." },
];

function HomeDetails() {
  const navigate = useNavigate();
  const { homeNo } = useParams();
  const [guideIdx, setGuideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setGuideIdx((prev) => (prev + 1) % guidelines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      bgcolor: "#020617", 
      overflow: "hidden", 
      p: { xs: 1, md: 2 } 
    }}>
      
      {/* HEADER */}
      <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "white", mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" color="#64748b">
          Home Details: {homeNo}
        </Typography>
      </Box>

      {/* MAIN CONTAINER */}
      <motion.div
        layoutId={`card-${homeNo}`}
        style={{ 
          background: "#121212", 
          borderRadius: "24px", 
          display: "flex", 
          flex: 1, 
          overflow: "hidden", 
          border: "1px solid #1e293b" 
        }}
      >
        <Grid container sx={{ height: "100%",width: "100%" }}>
          
          {/* LEFT: IMAGE + TOP OVERLAY GUIDELINES */}
          <Grid item xs={12} md={6} sx={{ height: { xs: "50%", md: "100%" }, position: "relative" }}>
            <motion.img
              layoutId={`image-${homeNo}`}
              src={homeImages[homeNo]}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            
            {/* OVERLAY: GUIDELINE CARD */}
            <Box sx={{ position: "absolute", top: 20, left: "5%", width: "90%" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={guideIdx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: "rgba(15, 23, 42, 0.85)", 
                    backdropFilter: "blur(12px)", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    
                  }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <InfoOutlinedIcon fontSize="small" sx={{ color: "#38bdf8" }} />
                      <Typography variant="caption" color="#38bdf8" fontWeight="bold">RESIDENT GUIDELINES</Typography>
                    </Stack>
                    <Typography variant="subtitle2" color="white" fontWeight="bold">
                      {guidelines[guideIdx].title}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8" sx={{ display: 'block', mt: 0.5 }}>
                      {guidelines[guideIdx].body}
                    </Typography>
                  </Paper>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Grid>

          {/* RIGHT: UNIT SPECIFICATIONS - STRETCHED TO FILL */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              p: { xs: 2, md: 4 }, 
              bgcolor: "#0f172a", 
              height: { xs: "100%", md: "100%" },
              width: { xs: "100%", md: "45%" },
              display: "flex",
              flexDirection: "column",
              overflowY: "auto", // 🚀 ADD THIS: Allows content to be reached if it's too tall
              "&::-webkit-scrollbar": { display: "none" }, // Optional: hide scrollbar for clean look
              msOverflowStyle: "none", 
              scrollbarWidth: "none"
              
            }}
          >
            <Stack spacing={4} sx={{ width: "100%", height: "100%" }}>
              
              {/* 1. UNIT SPECS - FULL WIDTH */}
              <Box sx={{ width: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2} width="100%">
                  <HomeOutlinedIcon fontSize="small" sx={{ color: "#fbbf24" }} />
                  <Typography variant="caption" color="#94a3b8" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                    UNIT SPECIFICATIONS
                  </Typography>
                </Stack>
                
                <Stack spacing={1.5} sx={{ width: "100%" }}>
                  <DetailBox4 l1="EB Service #" v1="1234567890" l2="Common EB Service #" v2="0987654321" l3="Property Tax #" v3="1234" l4="Water Tax #" v4="9876" />
                  <DetailBox4 l1="EB Service #" v1="1234567890" l2="Common EB Service #" v2="0987654321" l3="Property Tax #" v3="1234" l4="Water Tax #" v4="9876" />
                </Stack>
              </Box>

              

            </Stack>
          </Grid>

        </Grid>
      </motion.div>
    </Box>
  );
}

/* UI COMPONENTS - Optimized for stretching */
const DetailBox1 = ({ label, value }) => (
  <Paper elevation={0} sx={{ 
    p: 2.5, 
    width: "100%", // Ensures it fills the horizontal space
    bgcolor: "#1e293b", 
    border: "1px solid #334155", 
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between", // Pushes label and value to opposite ends
    alignItems: "center",
    boxSizing: "border-box"
  }}>
    <Typography variant="body2" color="#94a3b8" fontWeight="bold">{label}</Typography>
    <Typography variant="h6" color="white" fontWeight="bold" sx={{ fontSize: '1rem' }}>{value}</Typography>
  </Paper>
);

const DetailBox2 = ({ label1, value1, label2, value2 }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      width: "100%",
      bgcolor: "#1e293b",
      border: "1px solid #334155",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column", // Stack the two lines vertically
      gap: 1.5, // Space between the two lines
      boxSizing: "border-box",
    }}
  >
    {/* Line 1: EB Service Details */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="body2" color="#94a3b8" fontWeight="bold">
        sx={{fontSize: { xs: "0.5rem", md: "0.875rem" }}}
        {label1}
      </Typography>
      <Typography variant="h6" color="white" fontWeight="bold" >
        sx={{fontSize: { xs: "0.5rem", md: "0.875rem" }}}
        {value1}
      </Typography>
    </Box>

    {/* Subtle Divider */}
    <Box sx={{ height: "1px", bgcolor: "#334155", width: "100%", opacity: 0.5 }} />

    {/* Line 2: Common EB Details */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="body3" color="#94a3b8" fontWeight="bold">
        {label2}
      </Typography>
      <Typography variant="h6" color="#38bdf8" fontWeight="bold" sx={{ fontSize: "1rem" }}>
        {value2}
      </Typography>
    </Box>
  </Paper>
);
const ProtocolRow = ({ title, text }) => (
  <Box sx={{ 
    p: 2, 
    width: "100%", // Fill full width
    bgcolor: "#1e293b", 
    borderRadius: "12px", 
    borderLeft: "4px solid #fbbf24",
    boxSizing: "border-box"
  }}>
    <Typography variant="caption" color="#fbbf24" fontWeight="bold" display="block">{title}</Typography>
    <Typography variant="body2" color="white" sx={{ mt: 0.5 }}>{text}</Typography>
  </Box>
);
const DetailBox4 = ({ l1, v1, l2, v2, l3, v3, l4, v4 }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, md: 3 },
      width: "100%",
      bgcolor: "#1e293b",
      border: "1px solid #334155",
      borderRadius: "16px",
      display: "flex",
      flexDirection: "column",
      gap: { xs: 1, md: 2 },
      boxSizing: "border-box",
    }}
  >
    <DataRow label={l1} value={v1} color="white" />
    <DataRow label={l2} value={v2} color="#38bdf8" />
    <DataRow label={l3} value={v3} color="white" />
    <DataRow label={l4} value={v4} color="#38bdf8" />
  </Paper>
);

// Small helper to keep the code clean
const DataRow = ({ label, value, color }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography sx={{ color: "#94a3b8", fontWeight: "bold", fontSize: { xs: "0.65rem", md: "0.85rem" } }}>
      {label}
    </Typography>
    <Typography sx={{ color: color, fontWeight: "bold", fontSize: { xs: "0.8rem", md: "1rem" } }}>
      {value}
    </Typography>
  </Box>
);

export default HomeDetails;