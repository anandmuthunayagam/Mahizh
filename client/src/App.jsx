import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';

// Imports from Content.jsx
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import MahizhConnect from "./components/MahizhConnect";
import ResidentDashboard from "./pages/ResidentDashboard";
import MyPayments from "./pages/MyPayment";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* This Route "wraps" all pages in MainLayout */}
        <Route element={<MainLayout />}>
          {/* Index route: when user hits "/", go to MahizhConnect */}
          <Route index element={<Navigate to="/mahizhconnect" replace />} />
          
          <Route path="mahizhconnect" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="myhome" element={<ResidentDashboard />} />
          <Route path="mypayments" element={<MyPayments />} />
          <Route path="admindashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;