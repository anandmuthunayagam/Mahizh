import React from 'react';
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
    MuiInternalAppSidebar: { // Internal Toolpad component
      styleOverrides: {
        root: {
          '--toolpad-sidebar-width': '210px', // Force variable here
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingLeft: '8px', // Reduce padding to keep icons centered in narrow bar
          paddingRight: '8px',
        },
      },
    },
  },
});

/* --- Error UI from your Content.jsx --- */
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

const isAdmin = () => localStorage.getItem("role") === "admin";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the role directly inside the component so it stays fresh
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Define Navigation based on your SideBar.jsx logic
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
  ], []);

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
        title: 
        (
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
    // Use toolbarActions to inject content into the top bar
    toolbarActions: () => (
      <Typography 
        variant="body1" 
        sx={{ 
          mr: 2, 
          color: '#94a3b8', // Subtle grey to match your theme
          display: { xs: 'none', sm: 'block' }, // Hide on mobile to save space
          fontWeight: 500 
        }}
      >
        Welcome, {localStorage.getItem("username") || 'User'}!
      </Typography>
    ),
  }}
  sx={{
    // 1. Sync the sidebar variables
    '--toolpad-sidebar-width': '180px',
    '--toolpad-sidebar-mini-width': '64px',

    // 2. Target the Internal Page Wrapper to remove the "Center Gap"
    '& .MuiPageContainer-root': {
      backgroundColor: "#020617",
      maxWidth: '100% !important', // Prevents the content from "squeezing" in the middle
      margin: '0 !important',      // Snaps content to the left edge
      paddingLeft: '24px !important', // Standard spacing from the menu
      paddingRight: '24px !important',
      width: '100%',
    },

    // 3. Fix the Main Layout container padding
    '& .MuiDashboardLayout-main': {
      backgroundColor: "#020617",
      transition: 'padding-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },

    // 4. Sidebar Paper adjustments
    '& .MuiDrawer-paper': {
      width: 'var(--toolpad-sidebar-width)',
      backgroundColor: "#0F172A",
      borderRight: "1px solid #1E293B",
    },

    // 5. Ensure icons stay centered in the 64px mini-bar
    '& .MuiDrawer-paperMini': {
      width: 'var(--toolpad-sidebar-mini-width) !important',
    }
  }}
>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Box sx={{ p: 3 }}>
            <Outlet /> 
          </Box>
        </ErrorBoundary>
      </DashboardLayout>
    </AppProvider>
  );
}