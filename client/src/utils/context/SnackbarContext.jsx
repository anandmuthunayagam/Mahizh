import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // can be 'success', 'error', 'info', or 'warning'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={2000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%', bgcolor: '#1e293b', color: 'rgb(56, 189, 248)',fontWeight: 'bold',fontSize: '16px',py: 3, px: 4,borderRadius: 5, }}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use the snackbar in any component
export const useSnackbar = () => useContext(SnackbarContext);