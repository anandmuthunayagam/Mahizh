import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Tooltip, Box, Typography } from "@mui/material";
import axios from "../utils/api/axios";
import IconButton from "@mui/material/IconButton";  
import VisibilityIcon from "@mui/icons-material/Visibility"; // For view attachment button
import AttachmentIcon from '@mui/icons-material/Attachment';
import DownloadIcon from '@mui/icons-material/Download';

function ExpenseTable({ refreshKey, filterMonth, filterYear }) {
  const [expenses, setExpenses] = useState([]);
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const res = await axios.get("/expenses", {
          params: { month: filterMonth === "All" ? "" : filterMonth, year: filterYear === "All" ? "" : filterYear }
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchFiltered();
  }, [refreshKey, filterMonth, filterYear]);

  const handleView = async (expenseId) => {
        try {
            const response = await axios.get(`/expenses/attachment/${expenseId}`, {
              responseType: 'blob' // Essential for binary data
            });

            // Extract content type from headers to tell the browser how to render the file
            const contentType = response.headers['content-type']; 

            // Create a Blob with the explicit type (e.g., 'image/png' or 'application/pdf')
            const file = new Blob([response.data], { type: contentType });
            
            // Generate a temporary local URL for the Blob
            const fileURL = URL.createObjectURL(file);
            
            // Open the file in a new browser tab
            window.open(fileURL, "_blank");
            
            // Cleanup: Revoke the URL after a delay to free up memory
            setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
          } catch (error) {
            console.error("Error viewing attachment", error);
          }
      };

const handleDownload = async (expenseId) => {
        try {
          const response = await axios.get(`/expenses/attachment/${expenseId}`, {
            responseType: 'blob' //
          });

          // 1. Get header
          const contentDisposition = response.headers['content-disposition'];
          let fileName = "receipt.png"; // Default fallback

          // 2. Robust Regex to catch the filename
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (fileNameMatch && fileNameMatch[1]) {
              fileName = fileNameMatch[1].replace(/['"]/g, '');
            }
          }

          // 3. Trigger the download
          const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName); 
          document.body.appendChild(link);
          link.click();
          
          // 4. Cleanup
          link.remove();
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Download failed", error);
        }
};

  return (
    <Paper elevation={0} sx={{ backgroundColor: "#020617", borderRadius: 2, overflow: "hidden" }}>
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
                    <IconButton onClick={() => handleView(e._id)} title="View">
                      <VisibilityIcon color="primary" />
                    </IconButton>
                    
                    {/* NEW DOWNLOAD BUTTON */}
                    <IconButton onClick={() => handleDownload(e._id)} title="Download">
                      <DownloadIcon sx={{ color: "#10b981" }} /> 
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ color: "#475569" }}></Typography>
                )}
            </TableCell>
            </TableRow>
          ))}
          {expenses.length === 0 && (
            <TableRow><TableCell colSpan={3} align="center" sx={{ color: "#475569", py: 4 }}></TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default ExpenseTable;