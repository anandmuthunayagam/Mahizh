import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

// ✅ UPDATED: Now accepting token as a prop from AdminDashboard
function UserManager({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]); // ✅ RE-FETCH: If the session token changes

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // ✅ AUTHENTICATION: Pass the session token
      const res = await axios.get("/auth/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      showSnackbar("Failed to fetch users", "error");
      console.error("Fetch users failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
      try {
        // ✅ AUTHENTICATION: Pass the session token
        await axios.delete(`/auth/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSnackbar("User deleted successfully", "success");
        fetchUsers();
      } catch (err) {
        showSnackbar("Error deleting user", "error");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.homeNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>User Management</Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>View and manage active resident accounts</Typography>
        </Box>

        <TextField
          placeholder="Search by name or home..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={searchStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#38bdf8" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "#0F172A", border: "1px solid #1e293b", borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress sx={{ color: "#38bdf8" }} /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1e293b" }}>
                <TableCell sx={styles.head}>Resident</TableCell>
                <TableCell sx={styles.head}>Apartment</TableCell>
                <TableCell sx={styles.head}>Role</TableCell>
                <TableCell align="center" sx={styles.head}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id} sx={{ "&:hover": { bgcolor: "rgba(56, 189, 248, 0.05)" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <PersonIcon sx={{ color: "#6366f1" }} />
                        <Typography sx={{ color: "white", fontWeight: 500 }}>{user.username}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={user.homeNo || "N/A"} size="small" sx={{ bgcolor: "#1e293b", color: "#38bdf8", fontWeight: "bold" }} />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>{user.role || "Resident"}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete Account">
                        <IconButton
                          size="small"
                          sx={{ color: "#f87171", "&:hover": { bgcolor: "rgba(248,113,113,0.1)" } }}
                          onClick={() => handleDeleteUser(user._id, user.username)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: "#94a3b8" }}>No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
}

const searchStyle = {
  width: 300,
  "& .MuiOutlinedInput-root": {
    color: "white",
    bgcolor: "#1e293b",
    "& fieldset": { borderColor: "#334155" },
    "&:hover fieldset": { borderColor: "#38bdf8" },
  }
};

const styles = {
  head: {
    color: "#94a3b8",
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: "0.75rem",
    borderBottom: "1px solid #1e293b",
  }
};

export default UserManager;