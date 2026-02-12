import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";

// Icons for the Pillars
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SavingsIcon from '@mui/icons-material/Savings'; // New icon for Corpus

// Import all your components
import CreateUser from "./createUser";
import UserManager from "./UserManager";
import OwnerResidentForm from "./OwnerResidentForm";
import PropertyManager from "./PropertyManager";
import CollectionForm from "./CollectionForm";
import CollectionsManager from "./CollectionsManager";
import ExpenseForm from "./ExpenseForm";
import ExpenseManager from "./ExpenseManager";
import Summary from "./Summary";

function AdminDashboard() {
  const [pillar, setPillar] = useState(0); // Level 1: User, Prop, Coll, Exp, Corpus
  const [action, setAction] = useState(0); // Level 2: Add (0) or Manage (1)

  const handlePillarChange = (event, newValue) => {
    setPillar(newValue);
    setAction(0); // Reset to "Add/Setup" view whenever switching pillars
  };

  const handleActionChange = (event, newValue) => {
    setAction(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", bgcolor: "#020617", overflow: "hidden" }}>
      
      {/* LEVEL 1: MAIN PILLARS */}
      <Box sx={{ borderBottom: 1, borderColor: "#1e293b", bgcolor: "#0f172a", px: 2 }}>
        <Tabs 
          value={pillar} 
          onChange={handlePillarChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': { color: "#94a3b8", textTransform: 'none', fontWeight: 600, minHeight: 64 },
            '& .Mui-selected': { color: "#38bdf8 !important" },
            '& .MuiTabs-indicator': { backgroundColor: "#38bdf8", height: 3 }
          }}
        >
          <Tab icon={<SavingsIcon />} iconPosition="start" label="Corpus" /> {/* Pillar 0 */}
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Users" />
          <Tab icon={<HomeWorkIcon />} iconPosition="start" label="Properties" />
          <Tab icon={<AccountBalanceWalletIcon />} iconPosition="start" label="Collections" />
          <Tab icon={<ReceiptLongIcon />} iconPosition="start" label="Expenses" />
          
        </Tabs>
      </Box>

      {/* LEVEL 2: ACTION NAVIGATION (Hidden for Pillar 4) */}
      {pillar !== 0 && (
        <Box sx={{ px: 4, py: 1.5, bgcolor: "#0f172a", borderBottom: "1px solid #1e293b" }}>
          <Tabs
            value={action}
            onChange={handleActionChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{ minHeight: "36px" }}
          >
            <Tab label={pillar === 2 ? "Property Setup" : pillar === 1 ? "Create New" : "Add Entry"} sx={actionStyle} />
            <Tab label="Manage / View All" sx={actionStyle} />
          </Tabs>
        </Box>
      )}

      {/* MAIN CONTENT AREA */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          
          {/* Logical Switcher */}
          {/* Pillar 4 renders Summary directly */}
          {pillar === 0 && <Summary />}
          {pillar === 1 && (action === 0 ? <CreateUser /> : <UserManager />)}
          {pillar === 2 && (action === 0 ? <OwnerResidentForm onSuccess={() => setAction(1)} /> : <PropertyManager />)}
          {pillar === 3 && (action === 0 ? <CollectionForm onSuccess={() => setAction(1)} /> : <CollectionsManager />)}
          {pillar === 4 && (action === 0 ? <ExpenseForm onSuccess={() => setAction(1)} /> : <ExpenseManager />)}
          
          

        </Box>
      </Box>
    </Box>
  );
}

// Styling for the Level 2 "Chip" Tabs
const actionStyle = {
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.85rem",
  minHeight: "32px",
  borderRadius: "20px",
  color: "#94a3b8",
  mr: 2,
  px: 3,
  backgroundColor: "rgba(30, 41, 59, 0.5)",
  "&.Mui-selected": {
    color: "white",
    backgroundColor: "#334155",
    border: "1px solid #475569"
  }
};

export default AdminDashboard;