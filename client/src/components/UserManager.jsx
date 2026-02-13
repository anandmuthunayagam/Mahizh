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
  Snackbar,
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const showSnackbar = useSnackbar()

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/auth/admin/users"); // Ensure your backend has this route
      setUsers(res.data);
    } catch (err) {
      showSnackbar("Failed to fetch users", "error");
      showSnackbar(err?.response?.data?.message || "Failed to fetch users", "error");
      console.error("Fetch users failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      try {
        await axios.delete(`auth/admin/users/${id}`);
        
        showSnackbar(`User ${username} deleted successfully`, "success");
        fetchUsers(); // Refresh list
      } catch (err) {
        showSnackbar("Failed to delete user", "error");
        showSnackbar(err?.response?.data?.message || "Failed to delete user", "error");
        console.error("Delete user failed", err);
      }
    }
  };

  

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.homeNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#1e293b",
          p: { xs: 1.5, md: 3 },
          borderRadius: 3,
          border: "1px solid #334155",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "auto", // Prevents page-level scroll 
          boxShadow: "none"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            mb: 3,
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2
          }}
        >
          <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
            Manage System Users
          </Typography>

          <TextField
            size="small"
            placeholder="Search Username or Home..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "#020617",
              borderRadius: 1,
              width: { xs: "100%", sm: 280 },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#6366f1" },
              }
            }}
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
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress sx={{ color: "#22d3ee" }} />
          </Box>
        ) : (
          <Table sx={{ minWidth: 600, tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.head}>User / Resident</TableCell>
                <TableCell sx={styles.head} width="120px">Home</TableCell>
                <TableCell sx={styles.head} width="150px">Role</TableCell>
                <TableCell sx={styles.head} align="center" width="100px">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                    <TableCell sx={styles.cell}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <PersonIcon sx={{ color: "#6366f1", fontSize: 20 }} />
                        <Typography noWrap sx={{ color: "white", fontWeight: 500 }}>
                          {user.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={styles.cell}>
                      <Chip
                        label={user.homeNo || "N/A"}
                        size="small"
                        sx={{ bgcolor: "#334155", color: "#22d3ee", fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={styles.cell}>
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                        {user.role || "Resident"}
                      </Typography>
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
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: "#94a3b8" }}>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      
    </Box>
  );
}

const styles = {
  head: {
    color: "#94a3b8",
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: "0.75rem",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #334155"
  },
  cell: {
    borderBottom: "1px solid #1e293b",
    py: 2
  }
};

export default UserManager;