import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, TextField, InputAdornment, 
  CircularProgress, Chip, Tooltip
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
    <Paper sx={{ backgroundColor: "#1e293b", p: 3, borderRadius: 3, border: "1px solid #334155", width: '100%' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
          Manage System Users
        </Typography>
        
        <TextField
          size="small"
          placeholder="Search Username or Home..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "#020617", borderRadius: 1, width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94a3b8" }} />
              </InputAdornment>
            ),
            style: { color: "white" }
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress sx={{ color: "#22d3ee" }} />
        </Box>
      ) : (
        <Table sx={{ backgroundColor: "#020617", borderRadius: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.head}>User / Resident</TableCell>
              <TableCell sx={styles.head}>Assigned Home</TableCell>
              <TableCell sx={styles.head}>Role</TableCell>
              <TableCell sx={styles.head} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                <TableCell sx={styles.cell}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonIcon sx={{ color: "#6366f1", fontSize: 20 }} />
                    <Typography sx={{ color: "white", fontWeight: 500 }}>
                      {user.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={styles.cell}>
                  <Chip 
                    label={user.homeNo} 
                    size="small" 
                    sx={{ bgcolor: "#334155", color: "#22d3ee", fontWeight: 700 }} 
                  />
                </TableCell>
                <TableCell sx={styles.cell}>
                   <Typography sx={{ color: "#94a3b8", fontSize: '0.85rem' }}>
                    {user.role || 'Resident'}
                   </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete Account">
                    <IconButton 
                      sx={{ color: "#f87171" }} 
                      onClick={() => handleDeleteUser(user._id, user.username)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

const styles = {
  head: { color: "#94a3b8", fontWeight: 700, borderBottom: "1px solid #334155", fontSize: '0.75rem', textTransform: 'uppercase' },
  cell: { color: "white", borderBottom: "1px solid #1e293b" }
};

export default UserManager;