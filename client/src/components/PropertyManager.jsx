import React, { useEffect, useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../utils/api/axios";
import { useSnackbar } from "../utils/context/SnackbarContext";

function PropertyManager() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit Modal State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [residentName, setResidentName] = useState("");
  const [residentPhone, setResidentPhone] = useState("");
  const showSnackbar = useSnackbar();

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/owner-residents");
      setProperties(res.data);
      
    } catch (err) { console.error("Fetch failed", err); }
    finally { setLoading(false); }
  };

  const handleOpenEdit = (prop) => {
    setSelectedProp(prop);
    setOwnerName(prop.owner?.name || "");
    setOwnerPhone(prop.owner?.phone || "");
    setResidentName(prop.resident?.name || "");
    setResidentPhone(prop.resident?.phone || "");
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.post(`/owner-residents/${selectedProp._id}`, {
        owner: { name: ownerName, phone: ownerPhone },
        resident: { name: residentName, phone: residentPhone },
      });
      setEditDialogOpen(false);
      fetchProperties();
      showSnackbar("Property details updated successfully!", "success");
    } catch (err) { 
      showSnackbar(err.response?.data?.message || "Update failed", "error");
      console.error("Update failed", err);}
  };

  const filtered = properties.filter(p => 
    p.homeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ backgroundColor: "#1e293b", p: 3, borderRadius: 3, border: "1px solid #334155", width: '100%' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>Property Occupancy Manager</Typography>
        <TextField
          size="small"
          placeholder="Search Home or Owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "#020617", borderRadius: 1, width: 280 }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "#94a3b8" }} /></InputAdornment>),
            style: { color: "white" }
          }}
        />
      </Box>

      {loading ? <CircularProgress sx={{ display: 'block', m: 'auto' }} /> : (
        <Table sx={{ backgroundColor: "#020617", borderRadius: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.head}>Unit</TableCell>
              <TableCell sx={styles.head}>Owner Details</TableCell>
              <TableCell sx={styles.head}>Resident Details</TableCell>
              <TableCell sx={styles.head} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p._id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                <TableCell sx={styles.cell}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <HomeIcon sx={{ color: "#6366f1" }} fontSize="small" />
                    <Typography sx={{ fontWeight: 700 }}>{p.homeNo}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={styles.cell}>
                  <Typography variant="body2">{p.owner?.name}</Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>{p.owner?.phone}</Typography>
                </TableCell>
                <TableCell sx={styles.cell}>
                  <Typography variant="body2">{p.resident?.name}</Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>{p.resident?.phone}</Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton sx={{ color: "#22d3ee" }} onClick={() => handleOpenEdit(p)}><EditIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* EDIT MODAL */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { bgcolor: "#1e293b", color: "white", minWidth: 500 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Occupancy: {selectedProp?.homeNo}</DialogTitle>
        <DialogContent>
          <Typography variant="overline" sx={{ color: "#22d3ee", fontWeight: 700 }}>Owner Information</Typography>
          <TextField fullWidth label="Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} margin="dense" InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} />
          <TextField fullWidth label="Phone" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} margin="dense" sx={{ mb: 2 }} InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} />
          
          <Typography variant="overline" sx={{ color: "#22d3ee", fontWeight: 700 }}>Resident Information</Typography>
          <TextField fullWidth label="Name" value={residentName} onChange={(e) => setResidentName(e.target.value)} margin="dense" InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} />
          <TextField fullWidth label="Phone" value={residentPhone} onChange={(e) => setResidentPhone(e.target.value)} margin="dense" InputLabelProps={{ style: { color: "#94a3b8" } }} InputProps={{ style: { color: "white" } }} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: "#94a3b8" }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" sx={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)", fontWeight: 700 }}>Update Unit Details</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

const styles = {
  head: { color: "#94a3b8", fontWeight: 700, borderBottom: "1px solid #334155", textTransform: 'uppercase', fontSize: '0.7rem' },
  cell: { color: "white", borderBottom: "1px solid #1e293b", py: 1.5 }
};

export default PropertyManager;