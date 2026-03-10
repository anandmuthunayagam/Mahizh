import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Container, Button, 
  Snackbar, Alert, Paper, MenuItem, TextField, Stack 
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

// Constants for filters and select options
const MONTHS = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//const YEARS = ["All", 2024, 2025, 2026, 2027, 2028];
const CATEGORIES = ["Maintenance", "Water", "Corpus Fund", "Others"];
// Generate years dynamically from 2012 to Current Year + 1
const startYear = 2012;
const currentYearValue = new Date().getFullYear();
const YEARS = [
  'All',
  ...Array.from(
    { length: currentYearValue - startYear + 1 }, 
    (_, i) => startYear + i
  ).reverse()
];
export default function CollectionManagement() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
  
  // ✅ Filter States for the Header
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  
  const token = sessionStorage.getItem("token");

  // ✅ 1. FETCH: Pass month/year as query params
  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/collections", {
        params: { 
          month: filterMonth, 
          year: filterYear 
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRows(res.data.map(item => ({ ...item, id: item._id })));
    } catch (err) {
      setSnackbar({ open: true, msg: 'Failed to fetch collections', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, filterMonth, filterYear]);

  useEffect(() => {
    if (token) fetchCollections();
  }, [token, fetchCollections]);

  // ✅ 2. ADD: Top-level button logic
  const handleAddPayment = () => {
    const id = `new-${Math.random()}`;
    const currentYear = new Date().getFullYear();
    const currentMonth = MONTHS[new Date().getMonth() + 1]; // +1 because 0 is "All"

    setRows((oldRows) => [
      { 
        id, 
        homeNo: '', 
        amount: 0, 
        month: filterMonth === "All" ? currentMonth : filterMonth, 
        year: filterYear === "All" ? currentYear : filterYear, 
        category: 'Maintenance', 
        isNew: true 
      },
      ...oldRows
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'homeNo' },
    }));
  };

  // ✅ 3. SAVE/UPDATE: Matches collectionRoutes logic
  const processRowUpdate = async (newRow) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (newRow.isNew) {
        // Post includes snapshot logic in backend
        await axios.post("/collections", newRow, { headers });
        setSnackbar({ open: true, msg: 'Payment added successfully', severity: 'success' });
      } else {
        await axios.put(`/collections/${newRow.id}`, newRow, { headers });
        setSnackbar({ open: true, msg: 'Payment updated successfully', severity: 'success' });
      }
      fetchCollections(); 
      return { ...newRow, isNew: false };
    } catch (err) {
      setSnackbar({ 
        open: true, 
        msg: err.response?.data?.message || 'Operation failed. Check for duplicate records.', 
        severity: 'error' 
      });
      throw err;
    }
  };

  const handleDeleteClick = (id) => async () => {
    if (window.confirm("Delete this payment record?")) {
      try {
        await axios.delete(`/collections/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRows(rows.filter((row) => row.id !== id));
        setSnackbar({ open: true, msg: 'Record deleted', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, msg: 'Delete failed', severity: 'error' });
      }
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
    { field: 'homeNo', headerName: 'Home No', flex: 0.8, minWidth: 100, editable: true,type: 'singleSelect', 
      valueOptions: ["G1", "F1", "F2", "S1", "S2"] },
    { 
      field: 'category', 
      headerName: 'Category', 
      flex: 1.2, 
      minWidth: 150, 
      editable: true,
      type: 'singleSelect',
      valueOptions: CATEGORIES
    },
    { field: 'amount', headerName: 'Amount', type: 'number', flex: 0.8, minWidth: 100, editable: true },
    { 
      field: 'month', 
      headerName: 'Month', 
      flex: 1, 
      minWidth: 120, 
      editable: true,
      type: 'singleSelect',
      valueOptions: MONTHS.filter(m => m !== "All")
    },
    { field: 'year', headerName: 'Year', type: 'number', flex: 0.8, minWidth: 100, editable: true },
    { 
      field: 'residentName', 
      headerName: 'Resident Name', 
      flex: 1.2, 
      minWidth: 150,
      description: 'Snapshot name at time of payment'
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
      {/* Header with Integrated Filters */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        gap: 2 
      }}>
        <Box>
          <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
            Collection Management
          </Typography>
          <Typography variant="body1" color="#94a3b8">Track and manage community maintenance and water payments.</Typography>
        </Box>

        {/* Filter Controls */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            select
            label="Month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            size="small"
            sx={{ 
              minWidth: 120, 
              '& .MuiInputBase-root': { color: 'white', bgcolor: '#020617' },
              '& .MuiInputLabel-root': { color: '#94a3b8' } 
            }}
          >
            {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          <TextField
            select
            label="Year"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            size="small"
            sx={{ 
              minWidth: 100, 
              '& .MuiInputBase-root': { color: 'white', bgcolor: '#020617' },
              '& .MuiInputLabel-root': { color: '#94a3b8' } 
            }}
          >
            {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>

          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddPayment} 
            sx={{ bgcolor: '#38bdf8', color: '#020617', fontWeight: 'bold', borderRadius: 2 }}
          >
            Add Payment
          </Button>
        </Stack>
      </Box>

      {/* Dark Themed DataGrid */}
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