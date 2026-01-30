import React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";

function AppLayout({ children }) {
  return (
    <Box sx={{ display: "flex",bgcolor: '#020617', minHeight: '100vh' }}>
      <Sidebar />
      <TopBar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#020617",
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Toolbar /> {/* spacing below TopBar */}
        {children}
      </Box>
    </Box>
  );
}

export default AppLayout;
