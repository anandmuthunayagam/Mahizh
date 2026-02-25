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

const HOMES = ["G1", "F1", "F2", "S1", "S2"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const categories = ["Maintenance", "Water", "Corpus Fund", "Others"];

// Generate years dynamically from 2012 to Current Year + 1
const startYear = 2012;
const currentYearValue = new Date().getFullYear();
const YEARS = Array.from(
  { length: currentYearValue - startYear + 2 }, 
  (_, i) => startYear + i
).reverse();



function CollectionsManager() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter States: Defaulting to current month and year
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.toLocaleString('default', { month: 'long' }));
  const [filterYear, setFilterYear] = useState(now.getFullYear());

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Edit Modal State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCol, setSelectedCol] = useState(null);
  const [editHome, setEditHome] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editMonth, setEditMonth] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const showSnackbar = useSnackbar();

  useEffect(() => { 
    fetchCollections(); 
  }, [filterMonth, filterYear]); // Re-fetch automatically when filters change

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/collections", {
        params: { month: filterMonth, year: filterYear }
      });
      setCollections(res.data);
      setPage(0);
    } catch (err) { 
      console.error("Fetch failed", err); 
      showSnackbar("Failed to fetch collections", "error");
    } finally { 
      setLoading(false); 
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/collections/${selectedCol._id}`, {
        homeNo: editHome,
        amount: Number(editAmount),
        month: editMonth,
        year: Number(editYear),
        category: editCategory
      });
      setEditDialogOpen(false);
      fetchCollections();
      showSnackbar("Collection updated successfully!", "success");
    } catch (err) { 
      showSnackbar("Failed to update collection", "error");
      console.error("Update failed", err);}
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await axios.delete(`/collections/${id}`);
        fetchCollections();
        showSnackbar("Collection deleted successfully!", "success");
      } catch (err) { 
        showSnackbar("Failed to delete collection", "error");
        console.error("Delete failed", err);}
    }
  };

  const filteredData = collections.filter(c => 
    c.homeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={styles.mainPaper}>
      {/* 1. FILTER BAR */}
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="flex-end">
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Month"
            fullWidth
            size="small"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            sx={styles.inputField}
            InputLabelProps={{ style: { color: "#94a3b8" } }}
          >
            {MONTHS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            select
            label="Year"
            fullWidth
            size="small"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            sx={styles.inputField}
            InputLabelProps={{ style: { color: "#94a3b8" } }}
          >
            {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            fullWidth 
            variant="contained" 
            startIcon={<FilterAltIcon />} 
            onClick={fetchCollections} 
            sx={styles.filterBtn}
          >
            Refresh
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Search Home or Month..." 
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

      {/* 2. TABLE */}
      {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} /> : (
        <>
          <Table sx={{ backgroundColor: "#020617", borderRadius: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.head}>Home No</TableCell>
                <TableCell sx={styles.head}>Maintenance Period</TableCell>
                <TableCell sx={styles.head} >Amount</TableCell>
                <TableCell sx={styles.head}>Category</TableCell>
                

                <TableCell sx={styles.head} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => (
                <TableRow key={c._id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                  <TableCell sx={styles.cell}>{c.homeNo}</TableCell>
                  <TableCell sx={styles.cell}>{c.month} {c.year}</TableCell>
                  <TableCell sx={{ ...styles.cell, color: "#22c55e", fontWeight: 700 }} align="left">₹{c.amount.toLocaleString()}</TableCell>
                  <TableCell sx={{ ...styles.cell, color: "#f87171", fontWeight: 700 }} align="left">{c.category}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      sx={{ color: "#22d3ee" }} 
                      onClick={() => { 
                        setSelectedCol(c); 
                        setEditHome(c.homeNo); 
                        setEditAmount(c.amount); 
                        setEditMonth(c.month); 
                        setEditYear(c.year); 
                        setEditDialogOpen(true); 
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton sx={{ color: "#f87171" }} onClick={() => handleDelete(c._id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "#475569", py: 4 }}>
                    No records found for this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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

      {/* EDIT MODAL */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { bgcolor: "#1e293b", color: "white", minWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Collection</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Home No" value={editHome} onChange={(e) => setEditHome(e.target.value)} margin="normal" sx={styles.inputField}>
            {HOMES.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
          </TextField>
          <TextField fullWidth type="number" label="Amount" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} margin="normal" sx={styles.inputField} />
          <TextField select fullWidth label="Month" value={editMonth} onChange={(e) => setEditMonth(e.target.value)} margin="normal" sx={styles.inputField}>
            {MONTHS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Year" value={editYear} onChange={(e) => setEditYear(e.target.value)} margin="normal" sx={styles.inputField}>
            {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
          <TextField select fullWidth label="Category" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} margin="normal" sx={styles.inputField}>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>  
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: "#94a3b8" }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" sx={styles.filterBtn}>Update Record</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

const styles = {
  mainPaper: { backgroundColor: "#1e293b", p: 3, borderRadius: 3, border: "1px solid #334155",width: '100%' },
  head: { color: "#94a3b8", fontWeight: 700, borderBottom: "1px solid #334155", fontSize: '0.75rem', textTransform: 'uppercase' },
  cell: { color: "white", borderBottom: "1px solid #1e293b" },
  filterBtn: { height: '40px', background: "linear-gradient(135deg, #6366f1, #22d3ee)", fontWeight: 700 },
  inputField: { 
    backgroundColor: "#020617", 
    borderRadius: 1, 
    "& .MuiOutlinedInput-root": { 
                    color: "white",
                    // This line specifically makes the arrow icon white
                    "& .MuiSvgIcon-root": { color: "white" } 
                  }, 
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiSelect-icon": { color: "#94a3b8" },
    "& .MuiSvgIcon-root": { color: "white" } 
  }
};

export default CollectionsManager;