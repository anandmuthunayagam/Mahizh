import React, { useEffect, useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableRow, Paper, 
  Tooltip, Box, Typography, Modal, Backdrop, Fade 
} from "@mui/material";
import axios from "../utils/api/axios";
import IconButton from "@mui/material/IconButton";  
import VisibilityIcon from "@mui/icons-material/Visibility"; 
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

// ✅ UPDATED: Now accepting token as a prop
function ExpenseTable({ refreshKey, filterMonth, filterYear, token }) {
  const [expenses, setExpenses] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState({ url: "", type: "" });

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const res = await axios.get("/expenses", {
          params: { 
            month: filterMonth === "All" ? "" : filterMonth, 
            year: filterYear === "All" ? "" : filterYear 
          },
          // ✅ AUTHENTICATION: Added header
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchFiltered();
  }, [refreshKey, filterMonth, filterYear, token]);

  const handlePreview = async (expenseId) => {
    try {
      const response = await axios.get(`/expenses/attachment/${expenseId}`, {
        responseType: 'blob',
        // ✅ AUTHENTICATION: Required for secure file access
        headers: { Authorization: `Bearer ${token}` }
      });
      const contentType = response.headers['content-type']; 
      const fileURL = URL.createObjectURL(response.data);
      
      setPreviewData({ url: fileURL, type: contentType });
      setOpenPreview(true);
    } catch (error) {
      console.error("Error previewing attachment", error);
    }
  };

  const handleDownload = async (expenseId) => {
    try {
      const response = await axios.get(`/expenses/attachment/${expenseId}`, {
        responseType: 'blob',
        // ✅ AUTHENTICATION: Required for secure file access
        headers: { Authorization: `Bearer ${token}` }
      });

      const contentDisposition = response.headers['content-disposition'];
      let fileName = "receipt.png"; 

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ backgroundColor: "#020617", borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#1e293b" }}>
              {["Title", "Date", "Month/Year", "Amount", "Receipt"].map((h) => (
                <TableCell key={h} sx={{ color: "#94a3b8", fontWeight: 700, borderBottom: "none", textTransform: "uppercase", fontSize: "0.85rem" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e._id} sx={{ '&:hover': { bgcolor: "rgba(239, 68, 68, 0.05)" } }}>
                <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>{e.title}</TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>
                  {new Date(e.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </TableCell>
                <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>{e.month} {e.year}</TableCell>
                <TableCell sx={{ color: "#ef4444", fontWeight: 700, borderBottom: "1px solid #1e293b" }}>₹{e.amount.toLocaleString()}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #1e293b" }}>
                  {e.hasAttachment ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Preview">
                        <IconButton onClick={() => handlePreview(e._id)}>
                          <VisibilityIcon sx={{ color: "#38bdf8" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton onClick={() => handleDownload(e._id)}>
                          <DownloadIcon sx={{ color: "#10b981" }} /> 
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: "#475569" }}>No file</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center" sx={{ color: "#475569", py: 4 }}>No records found for this period.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        </Box>
      </Paper>

      <Modal
        open={openPreview}
        onClose={() => { setOpenPreview(false); URL.revokeObjectURL(previewData.url); }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openPreview}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: { xs: '90%', md: '600px' },
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #38bdf8',
            borderRadius: 3, p: 3, outline: 'none',
            boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)"
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: "#38bdf8" }}>Receipt Preview</Typography>
              <IconButton onClick={() => setOpenPreview(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ width: '100%', maxHeight: '70vh', overflow: 'auto', textAlign: 'center' }}>
              {previewData.type.includes("pdf") ? (
                <iframe src={previewData.url} width="100%" height="500px" style={{ border: 'none' }} title="PDF Preview" />
              ) : (
                <img src={previewData.url} alt="Receipt" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default ExpenseTable;