import React, { useEffect, useState } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ErrorBoundary } from "react-error-boundary";
import { 
  Box, 
  Typography, 
  IconButton, 
  Stack, 
  SwipeableDrawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Button 
} from "@mui/material";

// Icons
import { 
  Dashboard as DashboardIcon, 
  Home as HomeIcon, 
  AdminPanelSettings, 
  BarChart, 
  Logout as LogoutIcon,
  HelpOutline as HelpOutlineIcon, 
  People as PeopleIcon
} from '@mui/icons-material';
import mahizhLogo from '../assets/MahizhLogo.png';

import { createTheme } from '@mui/material/styles';

// ✅ 1. ADD PULSE ANIMATION KEYFRAMES
const pulseAnimation = {
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(56, 189, 248, 0.4)',
    },
    '70%': {
      boxShadow: '0 0 0 10px rgba(56, 189, 248, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(56, 189, 248, 0)',
    },
  },
};

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

  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("role");
  const username = sessionStorage.getItem("username");

  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null;

  const handleLogout = () => {
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
  ], [userRole]);

  const router = React.useMemo(() => ({
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => {
      if (path === '/logout') handleLogout();
      else navigate(path);
    },
  }), [location, navigate]);

  const helpItems = React.useMemo(() => [
    { 
      title: 'Mahizh Connect', 
      desc: 'Community hub for resident directories and maintenance monthly insights', 
      icon: <PeopleIcon sx={{ color: '#38bdf8' }} /> 
    },
    { 
      title: 'Dashboard', 
      desc: 'Overview of monthly collections and expenses.', 
      icon: <DashboardIcon sx={{ color: '#38bdf8' }} /> 
    },
    ...(userRole === 'admin' ? [
      { title: 'Admin Panel', desc: 'Manage users and society data.', icon: <AdminPanelSettings sx={{ color: '#fbbf24' }} /> },
      { title: 'Reports', desc: 'Track financial and defaulters data.', icon: <BarChart sx={{ color: '#fbbf24' }} /> }
    ] : [
      { title: 'My Home', desc: 'View unit specs, EB and Tax IDs.', icon: <HomeIcon sx={{ color: '#38bdf8' }} /> },
      { title: 'My Payments', desc: 'Track your payment history with categories.', icon: <BarChart sx={{ color: '#38bdf8' }} /> }
    ])
  ], [userRole]);

  return (
    <AppProvider
      theme={darkTheme}
      navigation={NAVIGATION}
      branding={{
        title: (
          <Box sx={{ display: "flex", gap: "5px" }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>Mahizh</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'rgb(56, 189, 248)' }}>Connect</Typography>
          </Box>
        ),
        logo: <img src={mahizhLogo} alt="Logo" style={{ borderRadius: '50%', height: 40 }} />,
      }}
      router={router}
    >
      <DashboardLayout 
        slots={{
          toolbarActions: () => (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography 
                variant="body1" 
                sx={{ mr: 1, color: '#94a3b8', display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}
              >
                Welcome, {username || 'User'}!
              </Typography>
              
              {/* ✅ 2. APPLY PULSE ANIMATION TO ICONBUTTON */}
              <Box sx={pulseAnimation}>
                <IconButton 
                  onClick={() => setHelpOpen(true)}
                  sx={{ 
                    color: "#38bdf8",
                    animation: 'pulse 2s infinite', // Trigger the pulse
                    borderRadius: '50%',
                  }}
                >
                  <HelpOutlineIcon />
                </IconButton>
              </Box>
            </Stack>
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
          },
          '& .MuiDrawer-paper': {
            width: 'var(--toolpad-sidebar-width)',
            backgroundColor: "#0F172A",
            borderRight: "1px solid #1E293B",
          },
        }}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Box sx={{ p: 3 }}>
            <Outlet context={{ token, userRole, username }} />
          </Box>
        </ErrorBoundary>
      </DashboardLayout>

      {/* ✅ 3. BOTTOM SHEET */}
      <SwipeableDrawer
        anchor="bottom"
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        onOpen={() => setHelpOpen(true)}
        sx={{ zIndex: 2000 }}
        PaperProps={{
          sx: {
            bgcolor: '#0f172a',
            color: 'white',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            borderTop: '3px solid #38bdf8',
            maxHeight: '80vh'
          }
        }}
      >
        <Box sx={{ p: 3, width: 'auto' }} role="presentation">
          <Box sx={{ width: 40, height: 4, bgcolor: '#334155', borderRadius: 2, mx: 'auto', mb: 2 }} />
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpOutlineIcon sx={{ color: '#38bdf8' }} /> Mahizh Guide
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: '#1e293b' }} />
          <List>
            {helpItems.map((item) => (
              <ListItem key={item.title} sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 45 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography fontWeight={600} color="#f8fafc">{item.title}</Typography>}
                  secondary={<Typography variant="body2" color="#94a3b8">{item.desc}</Typography>}
                />
              </ListItem>
            ))}
          </List>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => setHelpOpen(false)}
            sx={{ mt: 3, py: 1.2, bgcolor: '#38bdf8', color: '#020617', fontWeight: 'bold', borderRadius: '8px' }}
          >
            Close Guide
          </Button>
        </Box>
      </SwipeableDrawer>
    </AppProvider>
  );
}