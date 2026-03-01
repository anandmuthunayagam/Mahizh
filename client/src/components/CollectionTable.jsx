import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Box } from "@mui/material";
import axios from "../utils/api/axios";

// ✅ UPDATED: Now accepting token as a prop from Dashboard
function CollectionTable({ refreshKey, filterMonth, filterYear, token }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const res = await axios.get("/collections", {
          params: { 
            month: filterMonth === "All" ? "" : filterMonth, 
            year: filterYear === "All" ? "" : filterYear 
          },
          // ✅ AUTHENTICATION: Use the session token
          headers: { Authorization: `Bearer ${token}` }
        });
        setCollections(res.data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchFiltered();
  }, [refreshKey, filterMonth, filterYear, token]); // Re-run if token changes

  return (
    <Paper elevation={0} sx={{ backgroundColor: "#020617", borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#1e293b" }}>
            {["Home No", "Month", "Year", "Amount", "Category"].map((h) => (
              <TableCell key={h} sx={{ color: "#94a3b8", fontWeight: 700, borderBottom: "none", textTransform: "uppercase", fontSize: "0.85rem" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {collections.map((c) => (
            <TableRow key={c._id} sx={{ '&:hover': { bgcolor: "rgba(99, 102, 241, 0.05)" } }}>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>{c.homeNo}</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>{c.month}</TableCell>
              <TableCell sx={{ color: "white", borderBottom: "1px solid #1e293b" }}>{c.year}</TableCell>
              <TableCell sx={{ color: "#22c55e", fontWeight: 700, borderBottom: "1px solid #1e293b" }}>₹{c.amount.toLocaleString()}</TableCell>
              <TableCell sx={{ color: "#f87171", borderBottom: "1px solid #1e293b" }}>{c.category}</TableCell>
            </TableRow>
          ))}
          {collections.length === 0 && (
            <TableRow><TableCell colSpan={5} align="center" sx={{ color: "#475569", py: 4 }}>No records found for this period.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      </Box>
    </Paper>
  );
}

export default CollectionTable;