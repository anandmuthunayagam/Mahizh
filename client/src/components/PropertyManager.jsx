import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Stack, Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

// ✅ UPDATED: Accepting token as a prop
function PropertyManager({ token }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [residentName, setResidentName] = useState("");
  const [residentPhone, setResidentPhone] = useState("");
  const showSnackbar = useSnackbar();

  useEffect(() => { 
    if(token) fetchProperties(); 
  }, [token]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // ✅ AUTHENTICATION: Pass the session token
      const res = await axios.get("/owner-residents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(res.data);
    } catch (err) {
      showSnackbar("Failed to fetch property details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (prop) => {
    setSelectedProp(prop);
    setOwnerName(prop.owner.name);
    setOwnerPhone(prop.owner.phone);
    setResidentName(prop.resident.name);
    setResidentPhone(prop.resident.phone);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      // ✅ AUTHENTICATION: Pass the session token
      await axios.put(`/owner-residents/${selectedProp._id}`, {
        owner: { name: ownerName, phone: ownerPhone },
        resident: { name: residentName, phone: residentPhone },
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showSnackbar("Property updated successfully!", "success");
      setEditDialogOpen(false);
      fetchProperties();
    } catch (err) {
      showSnackbar("Update failed", "error");
    }
  };

  const filteredProperties = properties.filter(p => 
    p.homeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
           <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>Property Directory</Typography>
           <Typography variant="body2" sx={{ color: "#94a3b8" }}>Manage owner and resident information per unit</Typography>
        </Box>
        <TextField
          placeholder="Search home or owner..."
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
      </Stack>

      <TableContainer component={Paper} sx={{ bgcolor: "#0F172A", border: "1px solid #1e293b", borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress sx={{ color: "#38bdf8" }} /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1e293b" }}>
                <TableCell sx={styles.head}>Unit</TableCell>
                <TableCell sx={styles.head}>Owner Details</TableCell>
                <TableCell sx={styles.head}>Resident Details</TableCell>
                <TableCell align="center" sx={styles.head}>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProperties.map((prop) => (
                <TableRow key={prop._id} sx={{ "&:hover": { bgcolor: "rgba(56, 189, 248, 0.05)" } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <HomeIcon sx={{ color: "#38bdf8" }} />
                      <Typography sx={{ color: "white", fontWeight: 700 }}>{prop.homeNo}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "white", fontSize: "0.9rem" }}>{prop.owner.name}</Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>{prop.owner.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "white", fontSize: "0.9rem" }}>{prop.resident.name}</Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>{prop.resident.phone}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditClick(prop)} sx={{ color: "#6366f1" }}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { bgcolor: "#0f172a", border: "1px solid #1e293b", color: "white", borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Unit {selectedProp?.homeNo}</DialogTitle>
        <DialogContent>
          <Typography variant="overline" sx={{ color: "#38bdf8", fontWeight: 700 }}>Owner Info</Typography>
          <TextField fullWidth label="Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} margin="dense" sx={inputStyle} />
          <TextField fullWidth label="Phone" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} margin="dense" sx={inputStyle} />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="overline" sx={{ color: "#22d3ee", fontWeight: 700 }}>Resident Info</Typography>
            <TextField fullWidth label="Name" value={residentName} onChange={(e) => setResidentName(e.target.value)} margin="dense" sx={inputStyle} />
            <TextField fullWidth label="Phone" value={residentPhone} onChange={(e) => setResidentPhone(e.target.value)} margin="dense" sx={inputStyle} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: "#94a3b8" }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" sx={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)", fontWeight: 700 }}>Update Details</Button>
        </DialogActions>
      </Dialog>
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
  head: { color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem", borderBottom: "1px solid #1e293b" }
};

// Simple TableContainer shim for the code block
const TableContainer = ({ children, sx, component }) => <Box component={component} sx={sx}>{children}</Box>;

export default PropertyManager;