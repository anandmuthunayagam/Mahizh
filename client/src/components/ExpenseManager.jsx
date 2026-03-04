import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, TextField, TablePagination, TableContainer,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ✅ UPDATED: Accepting token as a prop
function ExpenseManager({ token }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editMonth, setEditMonth] = useState("");
  const [editYear, setEditYear] = useState("");
  const showSnackbar = useSnackbar();

  // Filter States (Default to current month/year)
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.toLocaleString('default', { month: 'long' }));
  const [filterYear, setFilterYear] = useState(now.getFullYear());


  useEffect(() => { 
    if (token) fetchExpenses(); 
  }, [token]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/expenses", {
        params: { month: filterMonth, year: filterYear },
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      showSnackbar("Failed to fetch expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar("Expense deleted", "success");
      fetchExpenses();
    } catch (err) {
      showSnackbar("Delete failed", "error");
    }
  };

   const [editFile, setEditFile] = useState(null); // New state for the file

  const handleEditClick = (exp) => {
    setSelectedExp(exp);
    setEditTitle(exp.title);
    setEditAmount(exp.amount);
    setEditDate(exp.date ? new Date(exp.date).toISOString().split('T')[0] : "");
    setEditMonth(exp.month || "");
    setEditYear(exp.year || "");
    setEditFile(null); // Always reset file selection when opening a new record
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("amount", editAmount);
    formData.append("date", editDate);
    formData.append("month", editMonth);
    formData.append("year", editYear);

    if (editFile) {
        formData.append("attachment", editFile);
    }

    try {
        // CHANGE THIS: Use selectedExp._id instead of editData._id
        await axios.put(`/expenses/${selectedExp._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        showSnackbar("Update successful!", "success");
        setEditDialogOpen(false);
        fetchExpenses(); // Refresh the table
    } catch (err) {
        console.error("Update failed", err);
        showSnackbar("Update failed", "error");
    }
};

  const filtered = expenses.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ width: "100%" }}>
    <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        justifyContent="space-between" 
        alignItems="center" 
        spacing={2} 
        sx={{ mb: 3 }}
      >
        {/* Left Side: Title */}
        <Typography variant="h5" sx={{ color: "white", fontWeight: 700, whiteSpace: 'nowrap' }}>
          Expense Tracker
        </Typography>

        {/* Right Side: Grouped Controls */}
        <Stack 
          direction="row" 
          spacing={1.5} 
          alignItems="center" 
          sx={{ width: { xs: '100%', md: 'auto' }, flexWrap: 'wrap', justifyContent: 'flex-end' }}
        >
          <TextField
            select
            size="small"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            sx={{ ...styles.inputField, width: '120px' }} // Fixed width for alignment
          >
            {MONTHS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          <TextField
            size="small"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            sx={{ ...styles.inputField, width: '100px' }} // Fixed width for alignment
          />

          <Button
            variant="contained"
            startIcon={<FilterAltIcon />}
            onClick={fetchExpenses}
            sx={{ 
              height: '40px', 
              background: "linear-gradient(135deg, #6366f1, #22d3ee)", 
              fontWeight: 700,
              textTransform: 'none'
            }}
          >
            Refresh
          </Button>

          <TextField
            placeholder="Search..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ ...searchStyle, width: '200px' }}
          />
        </Stack>
      </Stack>

      <TableContainer component={Paper} sx={{ bgcolor: "#0F172A", border: "1px solid #1e293b", borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1e293b" }}>
                <TableCell sx={styles.head}>Title</TableCell>
                <TableCell sx={styles.head}>Amount</TableCell>
                <TableCell sx={styles.head}>Date</TableCell>
                <TableCell align="center" sx={styles.head}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((exp) => (
                <TableRow key={exp._id}>
                  <TableCell sx={styles.cell}>{exp.title}</TableCell>
                  <TableCell sx={{ ...styles.cell, color: "#f87171" }}>₹{exp.amount}</TableCell>
                  <TableCell sx={styles.cell}>{new Date(exp.date).toLocaleDateString()}</TableCell>
                  <TableCell align="center" sx={styles.cell}>
                    <IconButton onClick={() => handleEditClick(exp)} sx={{ color: "#38bdf8" }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton onClick={() => handleDelete(exp._id)} sx={{ color: "#f87171" }}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { bgcolor: "#0f172a", color: "white" } }}>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogContent>
                <TextField fullWidth label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} margin="dense" sx={inputStyle} />
                <TextField fullWidth label="Amount" type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} margin="dense" sx={inputStyle} />
                <TextField fullWidth type="date" label="Date" value={editDate} onChange={(e) => setEditDate(e.target.value)} margin="dense" sx={inputStyle}>
                  {expenses.map(e => <MenuItem key={e._id} value={e.date}>{new Date(e.date).toLocaleDateString()}</MenuItem>)}
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
                  {selectedExp?.hasAttachment && !editFile && (
                    <Typography variant="caption" sx={{ color: "#10b981", display: 'block' }}>
                      Current receipt exists. Upload a new one to replace it.
                    </Typography>
                  )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)} sx={{ color: "#94a3b8" }}>Cancel</Button>
                <Button onClick={handleUpdate} variant="contained">Update</Button>
              </DialogActions>
            </Dialog>
    </Box>
  );
}

const searchStyle = {
  width: 250,
  "& .MuiOutlinedInput-root": {
    color: "white",
    bgcolor: "#1e293b",
    "& fieldset": { borderColor: "#334155" },
  }
};

const styles = {
  head: { color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", borderBottom: "1px solid #1e293b" },
  cell: { color: "white", borderBottom: "1px solid #1e293b" }
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": { borderColor: "#555" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
};
export default ExpenseManager;