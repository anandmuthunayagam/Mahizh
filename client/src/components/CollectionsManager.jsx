import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, TextField, TablePagination, TableContainer,
  CircularProgress, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, MenuItem, Stack
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const categories = ["Maintenance", "Water", "Corpus Fund", "Others"];
// Generate years dynamically from 2012 to Current Year + 1
const startYear = 2012;
const currentYearValue = new Date().getFullYear();
const YEARS = Array.from(
  { length: currentYearValue - startYear + 2 }, 
  (_, i) => startYear + i
).reverse();

// ✅ UPDATED: Accepting token as a prop
function CollectionsManager({ token }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const showSnackbar = useSnackbar();

  // Edit States
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCol, setSelectedCol] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editMonth, setEditMonth] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Filter States (Default to current month/year)
    const now = new Date();
    const [filterMonth, setFilterMonth] = useState(now.toLocaleString('default', { month: 'long' }));
    const [filterYear, setFilterYear] = useState(now.getFullYear());
  

  useEffect(() => {
    if (token) fetchCollections();
  }, [token]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      // ✅ AUTHENTICATION: Pass the session token
      const res = await axios.get("/collections", {
        params: { month: filterMonth, year: filterYear },
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(res.data);
    } catch (err) {
      showSnackbar("Failed to fetch collections", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar("Deleted successfully", "success");
      fetchCollections();
    } catch (err) {
      showSnackbar("Delete failed", "error");
    }
  };

  const handleEditClick = (col) => {
    setSelectedCol(col);
    setEditAmount(col.amount);
    setEditMonth(col.month);
    setEditCategory(col.category);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/collections/${selectedCol._id}`, {
        amount: Number(editAmount),
        month: editMonth,
        year:editYear,
        category: editCategory
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar("Updated successfully", "success");
      setEditDialogOpen(false);
      fetchCollections();
    } catch (err) {
      showSnackbar("Update failed", "error");
    }
  };

  const filtered = collections.filter(c => 
    c.homeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Collections Log
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
                >
                  {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </TextField>
      
                <Button
                  variant="contained"
                  startIcon={<FilterAltIcon />}
                  onClick={fetchCollections}
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
                <TableCell sx={styles.head}>Home</TableCell>
                <TableCell sx={styles.head}>Amount</TableCell>
                <TableCell sx={styles.head}>Period</TableCell>
                <TableCell sx={styles.head}>Category</TableCell>
                <TableCell align="center" sx={styles.head}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((col) => (
                <TableRow key={col._id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                  <TableCell sx={styles.cell}>{col.homeNo}</TableCell>
                  <TableCell sx={{ ...styles.cell, color: "#4ade80", fontWeight: 700 }}>₹{col.amount}</TableCell>
                  <TableCell sx={styles.cell}>{col.month} {col.year}</TableCell>
                  <TableCell sx={styles.cell}>{col.category}</TableCell>
                  <TableCell align="center" sx={styles.cell}>
                    <IconButton onClick={() => handleEditClick(col)} sx={{ color: "#38bdf8" }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton onClick={() => handleDelete(col._id)} sx={{ color: "#f87171" }}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { bgcolor: "#0f172a", color: "white" } }}>
        <DialogTitle>Edit Collection</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Amount" type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} margin="dense" sx={inputStyle} />
          <TextField select fullWidth label="Month" value={editMonth} onChange={(e) => setEditMonth(e.target.value)} margin="dense" sx={inputStyle}>
            {MONTHS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Year" type="number" value={editYear} onChange={(e) => setEditYear(e.target.value)} margin="dense" sx={inputStyle} >
            {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Category" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} margin="dense" sx={inputStyle}>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: "#94a3b8" }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ✅ STYLES: Fixes ReferenceError
const searchStyle = {
  width: 250,
  "& .MuiOutlinedInput-root": {
    color: "white",
    bgcolor: "#1e293b",
    "& fieldset": { borderColor: "#334155" },
  }
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": { borderColor: "#555" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
};

const styles = {
  head: { color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem", borderBottom: "1px solid #1e293b" },
  cell: { color: "white", borderBottom: "1px solid #1e293b" }
};

export default CollectionsManager;