import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider
} from "@mui/material";
import {
  Dashboard,
  Home,
  AdminPanelSettings,
  BarChart,
  Logout
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import mahizh from '../assets/MahizhLogo.png'
import LogoutButton from "./LogoutButton";
import MahizhConnect from "./MahizhConnect";
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};


function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from Login.jsx
    localStorage.removeItem("role");  // Clear role from Login.jsx
    navigate("/login");
  };  

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#0F172A",
          borderRight: "1px solid #1E293B",
          color: "#E5E7EB",
        },
      }}
    >
      {/* LOGO */}
      <Box
  sx={{
    p: 2.5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {/* Gradient Ring */}
  <Box
    sx={{
      
    }}
  >
    {/* Logo */}
    <Box
                component="img"
                src={mahizh}
                alt="Apartment Logo"
                    
                sx={{
                  height: 120,
                  width: 120,
                  mb: 1,
                  borderRadius: "50%",
                  boxShadow: "0 4px 12px rgba(56,189,248,0.4)",
                 }}
                
              />
  </Box>
      </Box>

      {/* MENU */}
      <List>
        <NavItem to="/mahizhconnect" icon={<PeopleIcon />} text="Mahizh Connect" />
        <NavItem to="/dashboard" icon={<Dashboard />} text="Dashboard" />
         {isAdmin() && (
          <>
          
          <NavItem to="/reports" icon={<BarChart />} text="Reports" />
          <NavItem to="/admindashboard" icon={<AdminPanelSettings />} text="Admin Panel" />
          </>
         )}
         {!isAdmin() && (
          <>
          <NavItem to="/myhome" icon={<Home />} text="My Home" />
          <NavItem to="/mypayments" icon={<BarChart />} text="My Payments" />
          </>
         )}
                   
        
        <NavItem to="/login" icon={<Logout />} text="Logout" onClick={handleLogout}/>
        
      </List>
    </Drawer>
  );
}

function NavItem({ to, icon, text, onClick }) {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      onClick={onClick}
      sx={{
        mx: 1,
        borderRadius: 1,
        "&.active": {
          backgroundColor: "#1E293B",
          color: "#38BDF8",
        },
        "&:hover": {
          backgroundColor: "#1E293B",
        },
      }}
    >
      <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}

export default Sidebar;
