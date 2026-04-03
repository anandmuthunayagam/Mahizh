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
  
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState({ url: '', type: '' });
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
      setRows(res.data.map(exp => ({ 
        ...exp, 
        id: exp._id,
        date: exp.date ? new Date(exp.date) : null 
      })));
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
      const contentType = response.headers['content-type']; 
      const fileURL = URL.createObjectURL(response.data);
      setPreviewData({ url: fileURL, type: contentType });
      setOpenPreview(true);
    } catch (error) {
      setSnackbar({ open: true, msg: "Error loading preview", severity: 'error' });
    }
  };

  // ✅ FIXED DOWNLOAD LOGIC
  const handleDownloadReceipt = async (expenseId) => {
    try {
      const response = await axios.get(`/expenses/attachment/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' 
      });
      
      const contentType = response.headers['content-type'];
      // Create blob with the correct MIME type from the server
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      // Determine extension based on content type
      const extension = contentType.includes('pdf') ? 'pdf' : 'jpg';
      link.setAttribute('download', `receipt-${expenseId}.${extension}`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setSnackbar({ open: true, msg: 'Download failed', severity: 'error' });
    }
  };

  const processRowUpdate = async (newRow) => {
    try {
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
      const formData = new FormData();
      formData.append('title', newRow.title);
      formData.append('amount', newRow.amount);
      
      // Local Date Fix
      const dateObj = newRow.date instanceof Date ? newRow.date : new Date(newRow.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}`;
      
      formData.append('date', localDateString);
      formData.append('month', MONTHS[dateObj.getMonth() + 1]);
      formData.append('year', year);

      if (newRow.receiptFile) {
        formData.append('attachment', newRow.receiptFile);
      }

      let response;
      if (newRow.isNew) {
        response = await axios.post("/expenses", formData, { headers });
      } else {
        response = await axios.put(`/expenses/${newRow.id}`, formData, { headers });
      }

      const savedData = response.data.data;
      const updatedRow = { 
        ...savedData, 
        id: savedData._id, 
        isNew: false,
        date: new Date(savedData.date),
        hasAttachment: savedData.hasAttachment || !!newRow.receiptFile
      };

      setRows((prev) => prev.map((row) => (row.id === newRow.id ? updatedRow : row)));
      setSnackbar({ open: true, msg: 'Expense saved successfully!', severity: 'success' });
      
      return updatedRow;
    } catch (err) {
      setSnackbar({ open: true, msg: 'Save failed', severity: 'error' });
      throw err;
    }
  };

  const handleAddExpense = () => {
    const id = `new-${Math.random()}`;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setRows((oldRows) => [{ id, title: '', amount: 0, date: today, isNew: true, hasAttachment: false }, ...oldRows]);
    setRowModesModel((oldModel) => ({ ...oldModel, [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' } }));
  };

  const columns = [
    { field: 'title', headerName: 'Expense Title', flex: 1.5, minWidth: 200, editable: true },
    { field: 'amount', headerName: 'Amount', type: 'number', flex: 0.8, minWidth: 100, editable: true },
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 130, editable: true, type: 'date' },
    {
      field: 'receipt',
      headerName: 'Receipt',
      width: 140,
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
                  params.api.setEditCellValue({ id: params.id, field: 'receiptFile', value: file });
                  setRows(prev => prev.map(r => r.id === params.id ? { ...r, receiptFile: file } : r));
                }} 
              />
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
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 700 }}>Expense Management</Typography>
          <Typography variant="body1" color="#94a3b8">Manage community expenditures and receipts.</Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField select label="Month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} size="small" sx={{ minWidth: 120, '& .MuiInputBase-root': { color: 'white', bgcolor: '#020617' } }}>
            {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          <TextField select label="Year" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} size="small" sx={{ minWidth: 100, '& .MuiInputBase-root': { color: 'white', bgcolor: '#020617' } }}>
            {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddExpense} sx={{ bgcolor: '#38bdf8', color: '#020617', fontWeight: 'bold' }}>
            Add Expense
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ height: 450, bgcolor: '#0F172A', borderRadius: 4, border: '1px solid #1e293b', overflow: 'hidden' }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          loading={loading} 
          editMode="row" 
          rowModesModel={rowModesModel} 
          onRowModesModelChange={setRowModesModel}
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
        <DialogTitle sx={{ borderBottom: '1px solid #1e293b' }}>Receipt Preview</DialogTitle>
        <DialogContent sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          {previewData.type.includes('image') ? (
            <img src={previewData.url} alt="Receipt" style={{ maxWidth: '100%', borderRadius: '8px' }} />
          ) : (
            <iframe src={previewData.url} title="PDF Preview" width="100%" height="600px" style={{ border: 'none' }} />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenPreview(false)} sx={{ color: '#94a3b8' }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.msg}</Alert>
      </Snackbar>
    </Container>
  );
}