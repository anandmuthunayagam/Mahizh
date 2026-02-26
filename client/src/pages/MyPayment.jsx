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
} from "@mui/material";
import axios from "../utils/api/axios";

function MyPayments() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get("/resident/payments").then(res => setRows(res.data));
  }, []);

  return (
    // Updated Paper to match ExpenseTable's dark background and border radius
    <Paper elevation={0} sx={{ backgroundColor: "#020617", borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 2 ,}}>
        <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
          My Payment History
        </Typography>
      </Box>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <Table>
        <TableHead>
          {/* Header background matches the deep slate of ExpenseTable */}
          <TableRow sx={{ bgcolor: "#1e293b" }}>
            {["Month", "Year", "Amount", "Category"].map((header) => (
              <TableCell 
                key={header} 
                sx={{ 
                  color: "#94a3b8", 
                  fontWeight: 700, 
                  borderBottom: "none", 
                  textTransform: "uppercase", 
                  fontSize: "0.85rem" 
                }}
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
              // Added subtle hover effect and border colors to match ExpenseTable
              sx={{ '&:hover': { bgcolor: "rgba(56, 189, 248, 0.05)" } }} 
            >
              <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>
                {r.month}
              </TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>
                {r.year}
              </TableCell>
              {/* Amount styled with green accent to indicate credit/payment */}
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
              <TableCell colSpan={4} align="center" sx={{ color: "#475569", py: 4 }}>
                No payment history found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
    </Paper>
  );
}

export default MyPayments;