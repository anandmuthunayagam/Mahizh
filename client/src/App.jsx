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
import Login from "./pages/Login";
import ProtectedRoute from './components/ProtectedRoute';
import HomeDetails from './components/HomeDetails';
import MyAmenities from './pages/MyAmenities';
import UserManagement from './components/UserManagement';
import PropertyManagement from './components/PropertyManagement';
import CollectionManagement from './components/CollectionManagement';
import ExpenseManagement from './components/ExpenseManagement';
import AdminPanel from './components/AdminPanel';

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
          <Route path="/myamenities" element={<MyAmenities />} />
          <Route path="adminpanel" element={<AdminPanel />} />
          <Route path="users" element={<UserManagement />} />
          <Route path='properties' element={<PropertyManagement />} />
          <Route path='collections' element={<CollectionManagement />} />
          <Route path='expenses' element={<ExpenseManagement />} />

          <Route path="/home-details/:homeNo" element={<HomeDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;