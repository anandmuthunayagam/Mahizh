import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Container, Button, 
  Snackbar, Alert, Paper, Stack
} from '@mui/material';
import { 
  DataGrid, GridActionsCellItem, GridRowModes, 
  GridToolbarQuickFilter 
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import axios from "../utils/api/axios";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { InputBase, IconButton} from '@mui/material';

export default function UserManagement() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
  
  const token = sessionStorage.getItem("token");

  // ✅ 1. Create a standalone component for the password edit cell
const PasswordEditInput = (params) => {
  // Hooks are now at the top level of this specific component
  const [showPassword, setShowPassword] = React.useState(false);
  
  const handleChange = (event) => {
    params.api.setEditCellValue({ 
      id: params.id, 
      field: params.field, 
      value: event.target.value 
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 1 }}>
      <InputBase
        type={showPassword ? 'text' : 'password'}
        // If it's a new row or default, show empty; otherwise show the current value
        value={params.value === '********' ? '' : params.value}
        onChange={handleChange}
        sx={{ color: 'white', flex: 1, fontSize: '0.875rem' }}
        autoFocus
      />
      <IconButton 
        size="small" 
        onClick={() => setShowPassword(!showPassword)} 
        sx={{ color: '#94a3b8' }}
      >
        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </Box>
  );
};

  // ✅ 1. Moved Add Logic to a Top-Level Function
  const handleAddNewResident = () => {
    const id = `new-${Math.random()}`;
    // Injects a new row at the top
    setRows((oldRows) => [{ id, username: '', homeNo: '', password: '', isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'username' },
    }));
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/auth/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRows(res.data.map(user => ({ ...user, id: user._id })));
    } catch (err) {
      setSnackbar({ open: true, msg: 'Failed to fetch users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  const processRowUpdate = async (newRow) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (newRow.isNew) {
        await axios.post("/auth/admin/create-user", newRow, { headers });
        setSnackbar({ open: true, msg: 'User created successfully', severity: 'success' });
      } else {
        await axios.put(`/auth/admin/users/${newRow.id}`, newRow, { headers });
        setSnackbar({ open: true, msg: 'User updated successfully', severity: 'success' });
      }
      fetchUsers(); 
      return { ...newRow, isNew: false };
    } catch (err) {
      setSnackbar({ open: true, msg: err.response?.data?.message || 'Operation failed', severity: 'error' });
      throw err;
    }
  };

  const handleDeleteClick = (id) => async () => {
    if (window.confirm("Delete this resident?")) {
      try {
        await axios.delete(`/auth/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRows(rows.filter((row) => row.id !== id));
        setSnackbar({ open: true, msg: 'User deleted', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, msg: 'Error deleting user', severity: 'error' });
      }
    }
  };

  // Standard Action Handlers
  const handleEditClick = (id) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  const handleSaveClick = (id) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  const handleCancelClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) setRows(rows.filter((row) => row.id !== id));
  };

  const columns = [
    { field: 'username', headerName: 'Username', flex: 1,
      minWidth: 150, editable: true },
    { 
      field: 'homeNo', 
      headerName: 'Home No', 
      //width: 130, 
      flex: 1,
      minWidth: 150,
      editable: true, 
      type: 'singleSelect', 
      valueOptions: ["G1", "F1", "F2", "S1", "S2"]
    },
    { 
      field: 'joinedAt', 
      headerName: 'Joined Date', 
      //width: 180, 
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => params ? new Date(params).toLocaleDateString() : 'N/A'
    },
    { 
        field: 'password', 
    headerName: 'Set Password', 
    //width: 180, 
    flex: 1, 
    minWidth: 150,
    editable: true,
    // ✅ Custom cell for viewing/editing with Visibility Toggle
    renderEditCell: (params) => <PasswordEditInput {...params} />,
    valueGetter: () => '********' // Keep it masked in view mode
     },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem icon={<SaveIcon color="primary" />} label="Save" onClick={handleSaveClick(id)} />,
            <GridActionsCellItem icon={<CancelIcon color="error" />} label="Cancel" onClick={handleCancelClick(id)} />,
          ];
        }
        return [
          <GridActionsCellItem icon={<EditIcon sx={{ color: '#38bdf8' }} />} label="Edit" onClick={handleEditClick(id)} />,
          <GridActionsCellItem icon={<DeleteIcon color="error" />} label="Delete" onClick={handleDeleteClick(id)} />,
        ];
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 0.5 }}>
      {/* ✅ 2. MODIFIED HEADER: Button is now here instead of inside the table */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.5rem' }  }}>User Management</Typography>
          <Typography variant="body1" color="#94a3b8">Admin controls for community resident accounts.</Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddNewResident} 
          sx={{ bgcolor: '#38bdf8', color: '#020617', fontWeight: 'bold', borderRadius: 2 }}>
          Add User
        </Button>
      </Box>

      <Paper sx={{ 
        height: 400, width: '100%', bgcolor: '#0F172A', borderRadius: 4, border: '1px solid #1e293b', overflow: 'hidden',
        '& .MuiDataGrid-root': { color: 'white', border: 'none' },
        '& .MuiDataGrid-cell': { borderBottom: '1px solid #1e293b' },
        '& .MuiDataGrid-columnHeaders': { bgcolor: '#020617', borderBottom: '2px solid #38bdf8', color: '#38bdf8' },
        '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #1e293b', bgcolor: '#020617' },
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: GridToolbarQuickFilter }} // Only search bar in the table toolbar now
        />
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Container>
  );
}