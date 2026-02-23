import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import CollectionForm from "./components/CollectionForm";
import ExpenseForm from "./components/ExpenseForm";
import Summary from "./components/Summary";
import CollectionTable from "./components/CollectionTable";
import ExpenseTable from "./components/ExpenseTable";
import { isAdmin } from "./utils/auth";
import CreateUser from "./components/createUser";
import Content from "./components/Content";
import Footer from "./components/Footer";
import AppLayout from "./components/AppLayout";
import { Box } from "@mui/material";






function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
           <AppLayout>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh",bgcolor: '#020617' }}>
              <Content />
              <Footer />
            </Box>
           </AppLayout>
          </ProtectedRoute>
        }
      />
    
    </Routes>
    
    </>
  );
}



export default App;
