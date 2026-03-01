import React, { useState } from "react";
// ✅ IMPORT: Added useOutletContext
import { useOutletContext } from "react-router-dom";
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";

// Icons for the Pillars
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SavingsIcon from '@mui/icons-material/Savings'; 

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
  // ✅ CONTEXT: Retrieve the session token
  const { token } = useOutletContext();

  const [pillar, setPillar] = useState(0); // Level 1: User, Prop, Coll, Exp, Corpus
  const [action, setAction] = useState(0); // Level 2: Add (0) or Manage (1)

  const handlePillarChange = (event, newValue) => {
    setPillar(newValue);
    setAction(0); 
  };

  const handleActionChange = (event, newValue) => {
    setAction(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#020617", color: "white" }}>
      
      {/* LEVEL 1: Pillar Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.1)", px: 2, bgcolor: "#0F172A" }}>
        <Tabs 
          value={pillar} 
          onChange={handlePillarChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': { bgcolor: '#38bdf8' },
            '& .MuiTab-root': { color: '#94a3b8', '&.Mui-selected': { color: '#38bdf8' } }
          }}
        >
          <Tab icon={<SavingsIcon />} label="Overview" iconPosition="start" />
          <Tab icon={<PeopleIcon />} label="Users" iconPosition="start" />
          <Tab icon={<HomeWorkIcon />} label="Property" iconPosition="start" />
          <Tab icon={<AccountBalanceWalletIcon />} label="Collections" iconPosition="start" />
          <Tab icon={<ReceiptLongIcon />} label="Expenses" iconPosition="start" />
        </Tabs>
      </Box>

      {/* LEVEL 2: Action Tabs (Conditional) */}
      {pillar !== 0 && (
        <Box sx={{ px: 4, py: 1, bgcolor: "#0F172A" }}>
          <Tabs value={action} onChange={handleActionChange} sx={{ minHeight: 40 }}>
            <Tab label={pillar === 2 ? "Property Setup" : pillar === 1 ? "Create New" : "Add Entry"} sx={actionStyle} />
            <Tab label="Manage / View All" sx={actionStyle} />
          </Tabs>
        </Box>
      )}

      {/* MAIN CONTENT AREA */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          
          {/* ✅ PASSING TOKEN: Every child component now receives the session token */}
          {pillar === 0 && <Summary token={token} />}
          
          {pillar === 1 && (
            action === 0 
              ? <CreateUser token={token} /> 
              : <UserManager token={token} />
          )}
          
          {pillar === 2 && (
            action === 0 
              ? <OwnerResidentForm token={token} onSuccess={() => setAction(1)} /> 
              : <PropertyManager token={token} />
          )}
          
          {pillar === 3 && (
            action === 0 
              ? <CollectionForm token={token} onSuccess={() => setAction(1)} /> 
              : <CollectionsManager token={token} />
          )}
          
          {pillar === 4 && (
            action === 0 
              ? <ExpenseForm token={token} onSuccess={() => setAction(1)} /> 
              : <ExpenseManager token={token} />
          )}

        </Box>
      </Box>
    </Box>
  );
}

const actionStyle = {
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.85rem",
  color: "#64748b",
  '&.Mui-selected': { color: "white" },
  minHeight: 40,
  px: 3
};

export default AdminDashboard;