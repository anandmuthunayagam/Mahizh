import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, TextField, TablePagination,
  CircularProgress, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Generate years from 2012 to Current Year + 1
const startYear = 2012;
const currentYearValue = new Date().getFullYear();
const YEARS = Array.from({ length: currentYearValue - startYear + 2 }, (_, i) => startYear + i).reverse();

function ExpenseManager() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCol, setSelectedCol] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editMonth, setEditMonth] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editFile, setEditFile] = useState(null);

  // Filter States (Default to current month/year)
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.toLocaleString('default', { month: 'long' }));
  const [filterYear, setFilterYear] = useState(now.getFullYear());

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const showSnackbar = useSnackbar();

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchExpenses();
  }, [filterMonth, filterYear]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/expenses", {
        params: { month: filterMonth, year: filterYear }
      });
      setExpenses(res.data);
      setPage(0);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = expenses.filter(exp =>
    exp.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`/expenses/${id}`);
        showSnackbar("Expense deleted successfully!", "success");
        fetchExpenses();
        
      } catch (err) { 
        showSnackbar("Failed to delete expense", "error");
        console.error("Delete failed", err);
      }
    }
  };

  const handleOpenEdit = (exp) => {
    setSelectedCol(exp);
    setEditTitle(exp.title);
    setEditAmount(exp.amount);
    setEditDate(exp.date ? new Date(exp.date).toISOString().split('T')[0] : "");
    setEditMonth(exp.month || "");
    setEditYear(exp.year || "");
    setEditFile(null);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
  const formData = new FormData();
  formData.append("title", editTitle);
  formData.append("amount", editAmount);
  formData.append("date", editDate);
  formData.append("month", editMonth);
  formData.append("year", editYear);

  // If the user selected a new file in the edit modal
  if (editFile) {
    formData.append("attachment", editFile);
  }

  try {
    await axios.put(`/expenses/${selectedCol._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    showSnackbar("Expense updated successfully!", "success");
    // Refresh your list here
    setEditDialogOpen(false);
    fetchExpenses();
  } catch (err) {
    showSnackbar("Update failed", "error");
    console.error("Update failed", err);
  }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={styles.mainPaper}>
      {/* 1. UPDATED FILTER BAR */}
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="flex-end">
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Month"
            fullWidth size="small"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            sx={styles.inputField}
          >
            {MONTHS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            select
            label="Year"
            fullWidth size="small"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            sx={styles.inputField}
          >
            {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FilterAltIcon />}
            onClick={fetchExpenses}
            sx={{ height: '40px', background: "linear-gradient(135deg, #6366f1, #22d3ee)", fontWeight: 700 }}
          >
            Refresh
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth size="small"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={styles.inputField}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#94a3b8", mr: 1 }} />,
              style: { color: "white" }
            }}
          />
        </Grid>
      </Grid>

      {/* 2. DATA TABLE */}
      {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} /> : (
        <>
          <Table sx={{ backgroundColor: "#020617", borderRadius: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.head}>Title</TableCell>
                <TableCell sx={styles.head}>Date</TableCell>
                <TableCell sx={styles.head} align="center">Month/Year</TableCell>
                <TableCell sx={styles.head} align="center">Amount</TableCell>
                <TableCell sx={styles.head} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((exp) => (
                  <TableRow key={exp._id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                    <TableCell sx={styles.cell}>{exp.title}</TableCell>
                    <TableCell sx={styles.cell}>{new Date(exp.date).toLocaleDateString()}</TableCell>
                    <TableCell sx={styles.cell} align="center">{exp.month} {exp.year}</TableCell>  
                    <TableCell sx={{ ...styles.cell, color: "#f87171", fontWeight: 700 }} align="center">
                      ₹{exp.amount}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton sx={{ color: "#22d3ee" }} onClick={() => handleOpenEdit(exp)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton sx={{ color: "#f87171" }} onClick={() => handleDelete(exp._id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "#475569", py: 4 }}>
                    No expenses found for this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* EDIT MODAL */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { bgcolor: "#1e293b", color: "white", minWidth: 400 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>Edit Expense Record</DialogTitle>
            <DialogContent>
              <TextField fullWidth label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} margin="normal" InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} sx={styles.inputField} />
              <TextField fullWidth label="Amount" type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} margin="normal" InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} sx={styles.inputField} />
                <TextField fullWidth type="date" label="Date" value={editDate} onChange={(e) => setEditDate(e.target.value)} margin="normal" InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} sx={{"& input::-webkit-calendar-picker-indicator": {
      filter: "invert(100%)", // This flips the black icon to white
      cursor: "pointer",
                },
                "& .MuiOutlinedInput-root": {
      backgroundColor: "#020617",
      "& fieldset": {
        borderColor: "#334155",
      },
    }}} />
              <TextField select fullWidth label="Month" value={editMonth} onChange={(e) => setEditMonth(e.target.value)} margin="normal" InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} sx={styles.inputField}>
                {MONTHS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <TextField select fullWidth label="Year" value={editYear} onChange={(e) => setEditYear(e.target.value)} margin="normal" InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} sx={styles.inputField}>
                {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
              <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 2, mb: 1, color: 'white', borderColor: '#555' }}
                >
                  {editFile ? editFile.name : "Add/Replace Receipt"}
                  <input 
                    type="file" 
                    hidden 
                    onChange={(e) => setEditFile(e.target.files[0])} 
                  />
                </Button>
                {selectedCol?.hasAttachment && !editFile && (
                  <Typography variant="caption" sx={{ color: "#10b981", display: 'block' }}>
                    Current receipt exists. Upload a new one to replace it.
                  </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setEditDialogOpen(false)} sx={{ color: "#94a3b8" }}>Cancel</Button>
              <Button onClick={(e) => handleUpdate(e)} variant="contained" sx={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)", fontWeight: 700 }}>Save Changes</Button>
            </DialogActions>
          </Dialog>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ color: "#94a3b8" }}
          />
        </>
      )}
    </Paper>
  );
}

const styles = {
  mainPaper: { backgroundColor: "#1e293b", p: 3, borderRadius: 3, border: "1px solid #334155", width: '100%' },
  head: { color: "#94a3b8", fontWeight: 700, borderBottom: "1px solid #334155", textTransform: 'uppercase', fontSize: '0.75rem' },
  cell: { color: "white", borderBottom: "1px solid #1e293b" },
  inputField: { 
    backgroundColor: "#020617", 
    borderRadius: 1, 
    "& .MuiOutlinedInput-root": { 
                    color: "white",
                    // This line specifically makes the arrow icon white
                    "& .MuiSvgIcon-root": { color: "white" } 
                  },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiSelect-icon": { color: "#94a3b8" }
  }
};

export default ExpenseManager;