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
import mahizh from "../assets/Mahizh.jpg";
import LogoutButton from "./LogoutButton";
import MahizhConnect from "./MahizhConnect";
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;



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
      background: "linear-gradient(135deg, #6366F1, #22D3EE)",
      padding: "3px",
      borderRadius: "50%",
      boxShadow: "0 0 18px rgba(99,102,241,0.45)",
      mb: 1,
    }}
  >
    {/* Logo */}
    <Box
      sx={{
        backgroundColor: "#0F172A",
        borderRadius: "50%",
        p: 1,
      }}
    >
      <img
        src={mahizh}
        alt="Mahizh Logo"
        style={{
          height: 100,
          width: 100,
          borderRadius: "50%",
        }}
      />
    </Box>
  </Box>
      </Box>

      {/* MENU */}
      <List>
        <NavItem to="/mahizhconnect" icon={<PeopleIcon />} text="Mahizh Connect" />
       
        <NavItem to="/dashboard" icon={<Dashboard />} text="Dashboard" />
        <NavItem to="/admin" icon={<AdminPanelSettings />} text="Admin" />
        <NavItem to="/reports" icon={<BarChart />} text="Reports" />
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
