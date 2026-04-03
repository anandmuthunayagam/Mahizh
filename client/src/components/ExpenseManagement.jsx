import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Container, Button, 
  Snackbar, Alert, Paper, MenuItem, TextField, Stack, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "../utils/api/axios";

const MONTHS = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const startYear = 2012;
const currentYearValue = new Date().getFullYear();
const YEARS = ['All', ...Array.from({ length: currentYearValue - startYear + 1 }, (_, i) => startYear + i).reverse()];

export default function ExpenseManagement() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
  
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState({ url: '', type: '' });
  
  // ✅ RESTORED FILTERS
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  
  const token = sessionStorage.getItem("token");

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/expenses", {
        params: { month: filterMonth, year: filterYear },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRows(res.data.map(exp => ({ ...exp, id: exp._id })));
    } catch (err) {
      setSnackbar({ open: true, msg: 'Failed to fetch expenses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, filterMonth, filterYear]);

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token, fetchExpenses]);

  const handlePreview = async (expenseId) => {
    try {
      const response = await axios.get(`/expenses/attachment/${expenseId}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const fileURL = URL.createObjectURL(response.data);
      setPreviewData({ url: fileURL, type: response.headers['content-type'] });
      setOpenPreview(true);
    } catch (error) {
      setSnackbar({ open: true, msg: "Error loading preview", severity: 'error' });
    }
  };

  const processRowUpdate = async (newRow) => {
    try {
      const formData = new FormData();
      formData.append('title', newRow.title);
      formData.append('amount', newRow.amount);
      
      const dateObj = new Date(newRow.date);
      formData.append('date', dateObj.toISOString().split('T')[0]);
      
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      formData.append('month', monthNames[dateObj.getMonth()]);
      formData.append('year', dateObj.getFullYear());

      if (newRow.receiptFile) {
        formData.append('attachment', newRow.receiptFile);
      }

      let response;
      if (newRow.isNew) {
        response = await axios.post("/expenses", formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.put(`/expenses/${newRow.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      }

      // ✅ Prepare updated data for the grid
      const savedData = { 
        ...response.data.data, 
        id: response.data.data._id, 
        isNew: false,
        // Force the grid to see the attachment if a file was just uploaded
        hasAttachment: response.data.data.hasAttachment || !!newRow.receiptFile 
      };
      
      setSnackbar({ open: true, msg: 'Expense saved successfully!', severity: 'success' });
      
      // Update local state immediately
      setRows((prev) => prev.map((row) => (row.id === newRow.id ? savedData : row)));
      
      return savedData;
    } catch (err) {
      setSnackbar({ open: true, msg: 'Save failed: Check file size (5MB limit)', severity: 'error' });
      throw err;
    }
  };

  const handleAddExpense = () => {
    const id = `new-${Math.random()}`;
    const today = new Date().toISOString().split('T')[0];
    const newRow = { id, title: '', amount: 0, date: today, isNew: true, hasAttachment: false };
    setRows((oldRows) => [newRow, ...oldRows]);
    setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' } }));
  };

  const columns = [
    { field: 'title', headerName: 'Expense Title', flex: 1.5, editable: true },
    { field: 'amount', headerName: 'Amount', type: 'number', flex: 0.8, editable: true },
    { field: 'date', headerName: 'Date', type: 'date', flex: 1, editable: true, valueGetter: (p) => p ? new Date(p) : null },
    {
      field: 'receipt',
      headerName: 'Receipt',
      width: 150,
      renderCell: (params) => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return (
            <Button component="label" size="small" startIcon={<CloudUploadIcon />} sx={{ color: '#38bdf8' }}>
              {params.row.receiptFile ? "Ready" : "Upload"}
              <input 
                type="file" 
                hidden 
                onChange={(e) => {
                  const file = e.target.files[0];
                  // ✅ CRITICAL: Using setEditCellValue to update the DataGrid's internal state
                  params.api.setEditCellValue({ id: params.id, field: 'receiptFile', value: file });
                  // Force a re-render so "Ready" shows up
                  setRows(prev => prev.map(r => r.id === params.id ? { ...r, receiptFile: file } : r));
                }} 
              />
            </Button>
          );
        }
        return params.row.hasAttachment ? (
          <IconButton size="small" onClick={() => handlePreview(params.row.id)} sx={{ color: '#38bdf8' }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        ) : <Typography variant="caption" color="gray">No Receipt</Typography>;
      }
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
            <GridActionsCellItem icon={<SaveIcon color="primary" />} label="Save" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })} />,
            <GridActionsCellItem icon={<CancelIcon color="error" />} label="Cancel" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } })} />,
          ];
        }
        return [
          <GridActionsCellItem icon={<EditIcon sx={{ color: '#38bdf8' }} />} label="Edit" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })} />,
          <GridActionsCellItem icon={<DeleteIcon color="error" />} label="Delete" onClick={async () => {
            if(window.confirm("Delete this expense?")) {
              await axios.delete(`/expenses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
              fetchExpenses();
            }
          }} />,
        ];
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* ✅ HEADER WITH RESTORED FILTERS */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#64748b">Expense Management</Typography>
          <Typography variant="body2" color="#94a3b8">Manage and track all community expenditures.</Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField select label="Month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} size="small" sx={{ minWidth: 120, '& .MuiInputBase-root': { color: 'white', bgcolor: '#020617' } }}>
            {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          <TextField select label="Year" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} size="small" sx={{ minWidth: 100, '& .MuiInputBase-root': { color: 'white', bgcolor: '#020617' } }}>
            {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddExpense} sx={{ bgcolor: '#38bdf8', color: '#020617' }}>
            Add
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ height: 500, bgcolor: '#0F172A', borderRadius: 4, overflow: 'hidden', border: '1px solid #1e293b' }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          loading={loading} 
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(m) => setRowModesModel(m)}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: GridToolbarQuickFilter }}
          sx={{ 
            color: 'white', border: 'none', 
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#020617', color: '#38bdf8' },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #1e293b' }
          }} 
        />
      </Paper>

      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0F172A', color: 'white' } }}>
        <DialogTitle>Receipt Preview</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
          {previewData.type?.includes('image') ? <img src={previewData.url} alt="Receipt" style={{ maxWidth: '100%' }} /> : <iframe src={previewData.url} width="100%" height="500px" />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)} sx={{ color: '#94a3b8' }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.msg}</Alert>
      </Snackbar>
    </Container>
  );
}