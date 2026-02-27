import React, { useEffect } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ErrorBoundary } from "react-error-boundary";
import { Box, Typography } from "@mui/material";

// Icons from your original SideBar.jsx
import { 
  Dashboard as DashboardIcon, 
  Home as HomeIcon, 
  AdminPanelSettings, 
  BarChart, 
  Logout as LogoutIcon 
} from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import mahizhLogo from '../assets/MahizhLogo.png';

import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#020617',
      paper: '#0F172A',
    }
  },
  components: {
    MuiInternalAppSidebar: { 
      styleOverrides: {
        root: {
          '--toolpad-sidebar-width': '210px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingLeft: '8px', 
          paddingRight: '8px',
        },
      },
    },
  },
});

function ErrorFallback() {
  return (
    <Box sx={{ p: 4, color: "#E5E7EB", textAlign: "center", bgcolor: '#020617', minHeight: '100vh' }}>
      <Typography variant="h6" gutterBottom>Something went wrong</Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8" }}>
        Please refresh the page or contact admin
      </Typography>
    </Box>
  );
}

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ SESSION STORAGE MIGRATION: 
  // Fetching data from sessionStorage instead of localStorage
  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("role");
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    // If no token is found in this specific tab session, redirect to login
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null;

  const handleLogout = () => {
    // ✅ SESSION STORAGE MIGRATION: 
    // Clearing the current tab session
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  const NAVIGATION = React.useMemo(() => [
    { segment: 'mahizhconnect', title: 'Mahizh Connect', icon: <PeopleIcon /> },
    { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    ...(userRole === "admin" 
      ? [
          { segment: 'reports', title: 'Reports', icon: <BarChart /> },
          { segment: 'admindashboard', title: 'Admin Panel', icon: <AdminPanelSettings /> },
        ]
      : [
          { segment: 'myhome', title: 'My Home', icon: <HomeIcon /> },
          { segment: 'mypayments', title: 'My Payments', icon: <BarChart /> },
        ]
    ),
    { kind: 'divider' },
    { segment: 'logout', title: 'Logout', icon: <LogoutIcon /> },
  ], [userRole]); // Re-run if userRole changes

  const router = React.useMemo(() => ({
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => {
      if (path === '/logout') handleLogout();
      else navigate(path);
    },
  }), [location, navigate]);

  return (
    <AppProvider
      theme={darkTheme}
      navigation={NAVIGATION}
      branding={{
        title: (
          <Box sx={{ display: "flex", gap: "5px" }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>
              Mahizh
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'rgb(56, 189, 248)' }}>
              Connect
            </Typography>
          </Box>
        ),
        logo: <img src={mahizhLogo} alt="Logo" style={{ borderRadius: '50%', height: 40 }} />,
      }}
      router={router}
    >
      <DashboardLayout 
        slots={{
          toolbarActions: () => (
            <Typography 
              variant="body1" 
              sx={{ 
                mr: 2, 
                color: '#94a3b8', 
                display: { xs: 'none', sm: 'block' }, 
                fontWeight: 500 
              }}
            >
              {/* ✅ Welcome message now pulls from session storage */}
              Welcome, {username || 'User'}!
            </Typography>
          ),
        }}
        sx={{
          '--toolpad-sidebar-width': '180px',
          '--toolpad-sidebar-mini-width': '64px',
          '& .MuiPageContainer-root': {
            backgroundColor: "#020617",
            maxWidth: '100% !important',
            margin: '0 !important',
            paddingLeft: '24px !important',
            paddingRight: '24px !important',
            width: '100%',
          },
          '& .MuiDashboardLayout-main': {
            backgroundColor: "#020617",
            transition: 'padding-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          },
          '& .MuiDrawer-paper': {
            width: 'var(--toolpad-sidebar-width)',
            backgroundColor: "#0F172A",
            borderRight: "1px solid #1E293B",
          },
          '& .MuiDrawer-paperMini': {
            width: 'var(--toolpad-sidebar-mini-width) !important',
          }
        }}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Box sx={{ p: 3 }}>
            {/* ✅ PASSING CONTEXT: 
                This makes token, role, and username available to Home.jsx via useOutletContext() */}
            <Outlet context={{ token, userRole, username }} /> 
          </Box>
        </ErrorBoundary>
      </DashboardLayout>
    </AppProvider>
  );
}