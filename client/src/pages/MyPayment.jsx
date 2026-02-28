import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CircularProgress
} from "@mui/material";
import axios from "../utils/api/axios";

function MyPayments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      // ✅ Retrieve token from sessionStorage
      const token = sessionStorage.getItem("token");
      
      try {
        const res = await axios.get("/resident/payments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRows(res.data);
      } catch (err) {
        console.error("Failed to fetch payment history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <Paper elevation={0} sx={{ backgroundColor: "#020617", borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
          My Payment History
        </Typography>
      </Box>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1e293b" }}>
                {["Month", "Year", "Amount", "Category"].map((header) => (
                  <TableCell 
                    key={header} 
                    sx={{ color: "#94a3b8", fontWeight: 700, borderBottom: "none" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow 
                  key={r._id} 
                  sx={{ '&:hover': { bgcolor: "rgba(56, 189, 248, 0.05)" } }} 
                >
                  <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>
                    {r.month}
                  </TableCell>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>
                    {r.year}
                  </TableCell>
                  <TableCell sx={{ color: "#10b981", fontWeight: 700, borderBottom: "1px solid #1e293b" }}>
                    ₹{r.amount.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>
                    {r.category || <span style={{ color: '#475569', fontStyle: 'italic' }}>General</span>}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "#94a3b8", py: 4 }}>
                    No payment records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Box>
    </Paper>
  );
}

export default MyPayments;