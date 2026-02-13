import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import axios from "../utils/api/axios";

function ExpenseTable({ refreshKey, filterMonth, filterYear }) {
  const [expenses, setExpenses] = useState([]);

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

  return (
    <Paper elevation={0} sx={{ backgroundColor: "#020617", borderRadius: 2, overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#1e293b" }}>
            {["Title", "Date", "Month/Year", "Amount"].map((h) => (
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
            </TableRow>
          ))}
          {expenses.length === 0 && (
            <TableRow><TableCell colSpan={3} align="center" sx={{ color: "#475569", py: 4 }}>No expenses found for this period.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default ExpenseTable;