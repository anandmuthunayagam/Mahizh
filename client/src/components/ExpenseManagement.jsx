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
//const YEARS = ["All", 2024, 2025, 2026, 2027, 2028];
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

export default function ExpenseManagement() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
  
  // ✅ Preview & Filter States
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState({ url: '', type: '' });
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  
  const token = sessionStorage.getItem("token");

  // ✅ 1. FETCH: Pass both month and year filters
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

  // ✅ 2. PREVIEW LOGIC
  const handlePreview = async (expenseId) => {
    try {
      const response = await axios.get(`/expenses/attachment/${expenseId}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const contentType = response.headers['content-type']; 
      const fileURL = URL.createObjectURL(response.data);
      setPreviewData({ url: fileURL, type: contentType });
      setOpenPreview(true);
    } catch (error) {
      setSnackbar({ open: true, msg: "Error loading preview", severity: 'error' });
    }
  };

  // ✅ 3. DOWNLOAD LOGIC
  const handleDownloadReceipt = async (expenseId) => {
    try {
      const response = await axios.get(`/expenses/attachment/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${expenseId}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setSnackbar({ open: true, msg: 'No file found', severity: 'error' });
    }
  };

  // ✅ 4. SAVE/UPDATE LOGIC
  const processRowUpdate = async (newRow) => {
    try {
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
      const formData = new FormData();
      formData.append('title', newRow.title);
      formData.append('amount', newRow.amount);
      formData.append('date', newRow.date);
      if (newRow.receiptFile) formData.append('attachment', newRow.receiptFile);

      if (newRow.isNew) {
        await axios.post("/expenses", formData, { headers });
      } else {
        await axios.put(`/expenses/${newRow.id}`, formData, { headers });
      }
      fetchExpenses();
      return { ...newRow, isNew: false };
    } catch (err) {
      setSnackbar({ open: true, msg: 'Save failed', severity: 'error' });
      throw err;
    }
  };

  const handleAddExpense = () => {
    const id = `new-${Math.random()}`;
    const today = new Date().toISOString().split('T')[0];
    setRows((oldRows) => [{ id, title: '', amount: 0, date: today, isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({ ...oldModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' } }));
  };

  const columns = [
    { field: 'title', headerName: 'Expense Title', flex: 1.5, minWidth: 200, editable: true },
    { field: 'amount', headerName: 'Amount', type: 'number', flex: 0.8, minWidth: 100, editable: true },
    { 
      field: 'date', headerName: 'Date', flex: 1, minWidth: 130, editable: true, type: 'date',
      valueGetter: (params) => params ? new Date(params) : null
    },
    {
      field: 'receipt',
      headerName: 'Receipt',
      width: 140,
      renderCell: (params) => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return (
            <Button component="label" size="small" startIcon={<CloudUploadIcon />} sx={{ color: '#38bdf8' }}>
              Upload
              <input type="file" hidden onChange={(e) => params.api.setEditCellValue({ id: params.id, field: 'receiptFile', value: e.target.files[0] })} />
            </Button>
          );
        }
        return params.row.hasAttachment ? (
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={() => handlePreview(params.row.id)} sx={{ color: '#38bdf8' }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => handleDownloadReceipt(params.row.id)} sx={{ color: '#94a3b8' }}>
              <FileDownloadIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : <Typography variant="caption" color="gray">No File</Typography>;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isInEditMode ? [
          <GridActionsCellItem icon={<SaveIcon color="primary" />} label="Save" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })} />,
          <GridActionsCellItem icon={<CancelIcon color="error" />} label="Cancel" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } })} />,
        ] : [
          <GridActionsCellItem icon={<EditIcon sx={{ color: '#38bdf8' }} />} label="Edit" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })} />,
          <GridActionsCellItem icon={<DeleteIcon color="error" />} label="Delete" onClick={() => {}} />,
        ];
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 0.5 }}>
      {/* RESTORED HEADER WITH BOTH FILTERS */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>Expense Management</Typography>
          <Typography variant="body1" color="#94a3b8">Manage community expenditures and receipts.</Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField select label="Month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} size="small" sx={{ minWidth: 120, '& .MuiInputBase-root': { color: 'white', bgcolor: '#020617' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}>
            {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          <TextField select label="Year" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} size="small" sx={{ minWidth: 100, '& .MuiInputBase-root': { color: 'white', bgcolor: '#020617' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}>
            {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddExpense} sx={{ bgcolor: '#38bdf8', color: '#020617', fontWeight: 'bold', borderRadius: 2 }}>
            Add Expense
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ height: 400, bgcolor: '#0F172A', borderRadius: 4, border: '1px solid #1e293b', overflow: 'hidden' }}>
        <DataGrid rows={rows} columns={columns} loading={loading} editMode="row" rowModesModel={rowModesModel} processRowUpdate={processRowUpdate} slots={{ toolbar: GridToolbarQuickFilter }} sx={{ color: 'white', border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: '#020617', color: '#38bdf8' } }} />
      </Paper>

      {/* ✅ PREVIEW MODAL */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0F172A', color: 'white', borderRadius: 3 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #1e293b' }}>Receipt Preview</DialogTitle>
        <DialogContent sx={{ mt: 2, display: 'flex', justifyContent: 'center', minHeight: '400px' }}>
          {previewData.type.includes('image') ? (
            <img src={previewData.url} alt="Receipt" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          ) : (
            <iframe src={previewData.url} title="PDF Preview" width="100%" height="600px" style={{ border: 'none' }} />
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #1e293b', p: 2 }}>
          <Button onClick={() => setOpenPreview(false)} sx={{ color: '#94a3b8' }}>Close</Button>
          <Button variant="contained" onClick={() => window.open(previewData.url)} sx={{ bgcolor: '#38bdf8', color: '#020617' }}>View Full Size</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}><Alert severity={snackbar.severity} variant="filled">{snackbar.msg}</Alert></Snackbar>
    </Container>
  );
}