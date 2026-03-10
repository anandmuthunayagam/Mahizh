import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Tabs, Tab, Paper } from "@mui/material";

// Icons for the Pillars
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SavingsIcon from '@mui/icons-material/Savings'; 

// Import Management Components
import Summary from "./Summary";
import UserManagement from "./UserManagement";
import PropertyManagement from "./PropertyManagement";
import CollectionManagement from "./CollectionManagement";
import ExpenseManagement from "./ExpenseManagement";

export default function AdminPanel() {
  const { token } = useOutletContext();
  const [pillar, setPillar] = useState(0);

  const handlePillarChange = (event, newValue) => {
    setPillar(newValue);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      bgcolor: "#020617", 
      color: "white" 
    }}>
      
      {/* HEADER: Pillar Tabs with Colorized Icons */}
      <Paper elevation={0} sx={{ 
        borderBottom: "1px solid rgba(255,255,255,0.1)", 
        px: 2, 
        bgcolor: "#0F172A",
        borderRadius: 0
      }}>
        <Tabs 
          value={pillar} 
          onChange={handlePillarChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': { bgcolor: '#38bdf8', height: 3 },
            '& .MuiTab-root': { 
              color: '#94a3b8', 
              py: 2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&.Mui-selected': { color: '#38bdf8' } 
            }
          }}
        >
          {/* ✅ Applied colors to individual icons using sx prop */}
          <Tab 
            icon={<SavingsIcon sx={{ color: '#2dd4bf' }} />} // Teal
            label="Overview" 
            iconPosition="start" 
          />
          <Tab 
            icon={<PeopleIcon sx={{ color: '#fbbf24' }} />} // Amber
            label="Users" 
            iconPosition="start" 
          />
          <Tab 
            icon={<HomeWorkIcon sx={{ color: '#818cf8' }} />} // Indigo
            label="Property" 
            iconPosition="start" 
          />
          <Tab 
            icon={<AccountBalanceWalletIcon sx={{ color: '#4ade80' }} />} // Green
            label="Collections" 
            iconPosition="start" 
          />
          <Tab 
            icon={<ReceiptLongIcon sx={{ color: '#f87171' }} />} // Red/Coral
            label="Expenses" 
            iconPosition="start" 
          />
        </Tabs>
      </Paper>

      {/* MAIN CONTENT AREA */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 1, md: 1.5 } }}>
        <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto" }}>
          {pillar === 0 && <Summary token={token} />}
          {pillar === 1 && <UserManagement token={token} />}
          {pillar === 2 && <PropertyManagement token={token} />}
          {pillar === 3 && <CollectionManagement token={token} />}
          {pillar === 4 && <ExpenseManagement token={token} />}
        </Box>
      </Box>
    </Box>
  );
}