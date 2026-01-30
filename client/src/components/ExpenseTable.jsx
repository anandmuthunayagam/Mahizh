import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "../utils/api/axios";

function ExpenseTable({refreshKey}) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get("/expenses").then(res => setExpenses(res.data));
  }, [refreshKey]);

  return (
    <Paper
      sx={{
        backgroundColor: "#020617",
        borderRadius: 3,
        p: 2,
        border: "1px solid #1e293b",
      }}
    >
      <Typography sx={{ color: "#e5e7eb", mb: 2, fontWeight: 600 }}>
        Expenses
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            {["Title", "Date", "Amount"].map(h => (
              <TableCell key={h} sx={{ color: "#94a3b8" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {expenses.map(e => (
            <TableRow key={e._id}>
              <TableCell sx={{ color: "white" }}>{e.title}</TableCell>
              <TableCell sx={{ color: "white" }}>
                {new Date(e.date).toLocaleDateString()}
              </TableCell>
              <TableCell sx={{ color: "#ef4444", fontWeight: 600 }}>
                ₹{e.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default ExpenseTable;
