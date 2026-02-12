import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, TextField, InputAdornment, 
  CircularProgress, Chip, Tooltip,
  TableContainer
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../utils/api/axios";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Assuming your backend endpoint for getting all users
      const res = await axios.get("/auth/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (window.confirm(`Are you sure you want to delete user: ${username}? This action cannot be undone.`)) {
      try {
        await axios.delete(`/auth/admin/users/${id}`);
        fetchUsers(); // Refresh list
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.homeNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
<>
<TableContainer 
      component={Paper} 
      sx={{ 
        backgroundColor: "#1e293b", 
        p: { xs: 1, md: 3 }, // Reduced mobile padding
        borderRadius: 3, 
        border: "1px solid #334155", 
        width: '100%',
        boxSizing: "border-box",
        overflowX: "auto", // Enables internal horizontal scroll if needed
        boxShadow: "none"
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
          Manage System Users
        </Typography>
        <TextField
          size="small"
          placeholder="Search..."
          sx={{ width: { xs: '100%', sm: 250 }, bgcolor: "#020617", borderRadius: 1 }}
          // ... rest of TextField props ...
        />
      </Box>

      <Table sx={{ 
        minWidth: 600, // Forces scroll inside the container instead of breaking the page
        tableLayout: "fixed", // CRITICAL: Prevents columns from expanding indefinitely
        backgroundColor: "#020617" 
      }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...styles.head, width: '40%' }}>User / Resident</TableCell>
            <TableCell sx={{ ...styles.head, width: '25%' }}>Home</TableCell>
            <TableCell sx={{ ...styles.head, width: '20%' }}>Role</TableCell>
            <TableCell sx={{ ...styles.head, width: '15%' }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell sx={styles.cell}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ color: "#6366f1", fontSize: 18 }} />
                  <Typography noWrap sx={{ color: "white", overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.username}
                  </Typography>
                </Box>
              </TableCell>
              {/* ... other cells ... */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer></>
  );
}

const styles = {
  head: { color: "#94a3b8", fontWeight: 700, borderBottom: "1px solid #334155", fontSize: '0.75rem', textTransform: 'uppercase' },
  cell: { color: "white", borderBottom: "1px solid #1e293b" }
};

export default UserManager;