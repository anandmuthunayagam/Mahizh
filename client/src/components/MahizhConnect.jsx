import React from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { 
  ReceiptLong, 
  Campaign, 
  AccountBalanceWallet, 
  PersonSearch 
} from "@mui/icons-material";
import mahizhconnect from '../assets/MahizhConnect1.png'

const features = [
  {
    title: "Bill Management",
    icon: <ReceiptLong sx={{ color: "white", fontSize: 28 }} />,
    desc: "Track payments, dues, and billing history for all residents."
  },
  {
    title: "Digital Notice Board",
    icon: <Campaign sx={{ color: "white", fontSize: 28 }} />,
    desc: "Post announcements and updates for residents in real-time."
  },
  {
    title: "Expense Tracker",
    icon: <AccountBalanceWallet sx={{ color: "white", fontSize: 28 }} />,
    desc: "Monitor expenses and updates for transparent society accounting."
  }
];

const AnimatedNetworkSVG = () => (
  <svg width="500" height="400" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <circle cx="250" cy="200" r="150" fill="url(#centerGlow)" />

  <g stroke="#38bdf8" stroke-width="0.5" stroke-opacity="0.4">
    <path d="M150 150 L350 250 M350 150 L150 250 M250 100 L250 300" />
    <path d="M180 120 L320 280 M320 120 L180 280" stroke-dasharray="4 2" />
    <path d="M100 200 L400 200 M250 80 L420 320" />
  </g>

  <g filter="url(#neonGlow)">
    <path d="M220 220 L280 190 L320 210 L260 240 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <path d="M220 220 L220 250 L260 270 L260 240 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <path d="M260 240 L260 270 L320 240 L320 210 Z" fill="#334155" stroke="#38bdf8" stroke-width="1.5" />
    
    <path d="M240 190 L280 170 L310 185 L270 205 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
  </g>

  <g fill="#38bdf8">
    <circle cx="280" cy="170" r="3" />
    <circle cx="220" cy="220" r="3" />
    <circle cx="350" cy="150" r="4" fill="#818cf8" />
    <circle cx="150" cy="250" r="2" />
    <circle cx="420" cy="320" r="4" fill="#38bdf8" />
    <circle cx="100" cy="200" r="3" />
    <circle cx="310" cy="185" r="2" />
  </g>

  <rect x="380" y="160" width="8" height="8" rx="2" stroke="#818cf8" stroke-width="1" transform="rotate(45 384 164)" />
  <rect x="180" y="280" width="6" height="6" rx="1" stroke="#38bdf8" stroke-width="1" transform="rotate(15 183 283)" />
</svg>
);

export default function MahizhConnect() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#020617", color: "white", py: 8,padding:"1px" }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "12px", mb: 1 }}>
          <Typography variant="h3" fontWeight={700}>Mahizh</Typography>
          <Typography variant="h3" fontWeight={700} sx={{ color: "#38bdf8" }}>Connect</Typography>
        </Box>
        <Typography variant="h6" sx={{ color: "#94a3b8" }}>Smarter Community Living, Simplified.</Typography>
      </Box>

      {/* Main Layout */}
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 6 }}>
          
          {/* Left: Content Cards */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
            {features.map((f, i) => (
              <Paper 
                key={i}
                elevation={0}
                sx={{ 
                  p: 3, 
                  bgcolor: "rgba(30, 41, 59, 0.4)", 
                  borderRadius: 4, 
                  border: "1px solid rgba(51, 65, 85, 0.5)",
                  display: "flex",
                  gap: 2,
                  backdropFilter: "blur(8px)"
                }}
              >
                <Box sx={{ mt: 0.5 }}>{f.icon}</Box>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="white">{f.title}</Typography>
                  <Typography variant="body2" sx={{ color: "#38bdf8" }}>{f.desc}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Right: Animated Graphic */}
          <Box sx={{ flex: 1.2, width: "100%", display: "flex", justifyContent: "center",height:"400px" }}>
            <img src={mahizhconnect}></img>
          </Box>
        </Box>
        {/*
        {/* Action Button 
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <Button
            variant="contained"
            sx={{
              px: 6, py: 1.5, borderRadius: "50px", fontWeight: 700,
              background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
              boxShadow: "0px 4px 20px rgba(56, 189, 248, 0.4)",
              '&:hover': { opacity: 0.9 }
            }}
          >
            GET STARTED TODAY
          </Button>
        </Box>
        */}
      </Container>
    </Box>
  );
}