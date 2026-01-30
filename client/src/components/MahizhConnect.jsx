import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

import { 
  ReceiptLong, 
  Campaign, 
  AccountBalanceWallet, 
  PersonSearch 
} from "@mui/icons-material";



/* --- Feature UI Component --- */
const features = [
  {
    title: "Bill Management",
    icon: <ReceiptLong sx={{ color: "#38bdf8" }} />,
    desc: "Track payments, dues, and billing history for all residents."
  },
  {
    title: "Digital Notice Board",
    icon: <Campaign sx={{ color: "#fb7185" }} />,
    desc: "Post announcements and updates for residents and keep informed all in real-time."
  },
  {
    title: "Expense Tracker",
    icon: <AccountBalanceWallet sx={{ color: "#4ade80" }} />,
    desc: "Monitor expenses and outstanding dues. Transparent and accountable society accounting."
  },
  {
    title: "Smart Search",
    icon: <PersonSearch sx={{ color: "#facc15" }} />,
    desc: "Easily find flat members, contact details, and vehicle info."
  }
];

function FeaturesGrid() {
  return (
    <Box sx={{ mt: 4, }}>
      <Typography variant="h5" sx={{ color: "white", mb: 3, fontWeight: 600 }}>
        Core Features
      </Typography>
      <Grid container spacing={3} style={{display: "grid"}}>
        {features.map((f, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                bgcolor: "#1e293b", 
                borderRadius: 2, 
                border: "1px solid #334155",
                height: "100%" 
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                {f.icon}
                <Typography variant="h6" sx={{ ml: 1.5, color: "white", fontWeight: 600 }}>
                  {f.title}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.6 }}>
                {f.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}



/* --- Main Content Component --- */
function MahizhConnect() {
  return (
    <Box
      sx={{
        display: "grid",
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: "#020617",
        padding: 3,
      }}
    >
      <FeaturesGrid></FeaturesGrid>
    </Box>
  );
}

export default MahizhConnect;