import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, TextField, TablePagination, TableContainer,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  
  const showSnackbar = useSnackbar();

  useEffect(() => { 
    if (token) fetchExpenses(); 
  }, [token]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/expenses", {
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

  const filtered = expenses.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>Expense Tracker</Typography>
        <TextField
          placeholder="Search expenses..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={searchStyle}
        />
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
                    <IconButton onClick={() => handleDelete(exp._id)} sx={{ color: "#f87171" }}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
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

export default ExpenseManager;