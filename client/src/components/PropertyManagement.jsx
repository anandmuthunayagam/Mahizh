import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Container, Button, 
  Snackbar, Alert, Paper 
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

export default function PropertyManagement() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
  
  const token = sessionStorage.getItem("token");

  // ✅ 1. FETCH: Uses the GET /owner-resident route
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/owner-residents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Flatten the nested owner/resident objects for DataGrid row compatibility
      const flattenedData = res.data.map(item => ({
        id: item._id,
        homeNo: item.homeNo,
        ownerName: item.owner?.name || '',
        ownerPhone: item.owner?.phone || '',
        residentName: item.resident?.name || '',
        residentPhone: item.resident?.phone || ''
      }));
      setRows(flattenedData);
    } catch (err) {
      setSnackbar({ open: true, msg: 'Failed to fetch property data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchProperties();
  }, [token, fetchProperties]);

  // ✅ 2. ADD: Top-level header button action
  const handleAddNewProperty = () => {
    const id = `new-${Math.random()}`;
    setRows((oldRows) => [
      { id, homeNo: '', ownerName: '', ownerPhone: '', residentName: '', residentPhone: '', isNew: true },
      ...oldRows
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'homeNo' },
    }));
  };

  // ✅ 3. SAVE/UPDATE: Uses the POST /owner-resident route
  const processRowUpdate = async (newRow) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Re-structure the flat row back into the nested object format required by the model
      const payload = {
        homeNo: newRow.homeNo,
        owner: { name: newRow.ownerName, phone: newRow.ownerPhone },
        resident: { name: newRow.residentName, phone: newRow.residentPhone }
      };

      await axios.post("/owner-residents", payload, { headers });
      
      setSnackbar({ open: true, msg: 'Property details saved successfully', severity: 'success' });
      fetchProperties(); // Refresh to sync with DB
      return { ...newRow, isNew: false };
    } catch (err) {
      setSnackbar({ open: true, msg: err.response?.data?.message || 'Update failed', severity: 'error' });
      throw err;
    }
  };

  const handleEditClick = (id) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  const handleSaveClick = (id) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  const handleCancelClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) setRows(rows.filter((row) => row.id !== id));
  };

  const columns = [
    { 
      field: 'homeNo', 
      headerName: 'Home No', 
      flex: 1, 
      minWidth: 100, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ["G1", "F1", "F2", "S1", "S2"]
    },
    { field: 'ownerName', headerName: 'Owner Name', flex: 1.5, minWidth: 150, editable: true },
    { field: 'ownerPhone', headerName: 'Owner Phone', flex: 1.2, minWidth: 130, editable: true },
    { field: 'residentName', headerName: 'Resident Name', flex: 1.5, minWidth: 150, editable: true },
    { field: 'residentPhone', headerName: 'Resident Phone', flex: 1.2, minWidth: 130, editable: true },
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
          // Delete function is not explicitly in your routes, so we keep Edit/Save for now
        ];
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 0.5 }}>
      {/* HEADER SECTION - Matching UserManagement.jsx Typography */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
            Property Management
          </Typography>
          <Typography variant="body1" color="#94a3b8">
            Manage owner and resident details for each unit.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddNewProperty} 
          sx={{ bgcolor: '#38bdf8', color: '#020617', fontWeight: 'bold', borderRadius: 2 }}
        >
          Add Property
        </Button>
      </Box>

      {/* DATAGRID SECTION - Matching UserManagement.jsx Dark Theme */}
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
          slots={{ toolbar: GridToolbarQuickFilter }}
        />
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Container>
  );
}