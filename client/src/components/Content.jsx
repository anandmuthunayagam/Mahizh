import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";


import Home from "./Home";
import Dashboard from "./Dashboard";
import Admin from "./Admin";
import Reports from "./Reports";
import LogoutButton from "./LogoutButton";
import MahizhConnect from "./MahizhConnect";
import ResidentDashboard from "../pages/ResidentDashboard";
import MyPayments from "../pages/MyPayment";
import AdminDashboard from "./AdminDashboard";



/* --- Error UI --- */
function ErrorFallback() {
  return (
    <Box sx={{ p: 4, color: "#E5E7EB", textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>Something went wrong</Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8" }}>
        Please refresh the page or contact admin
      </Typography>
    </Box>
  );
}

/* --- Main Content Component --- */
function Content() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: "#020617",
        padding: 3,
      }}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        
        <Routes>
          <Route index element={<MahizhConnect />}/>
          
          
          <Route path="/mahizhconnect" element={
            <>
              
              <Home />
              
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/myhome" element={<ResidentDashboard />} />
          <Route path="/mypayments" element={<MyPayments />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </ErrorBoundary>
    </Box>
  );
}

export default Content;