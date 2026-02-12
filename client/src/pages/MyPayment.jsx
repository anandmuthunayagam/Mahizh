import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "../utils/api/axios";

function MyPayments() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    
    axios.get("/resident/payments").then(res => setRows(res.data));
  }, []);

  return (
    <Paper sx={{ p: 3, background: "#020617" }}>
      <Typography sx={{ color: "white", mb: 2 }}>
        My Payment History
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#cbd5f5" }}>Month</TableCell>
            <TableCell sx={{ color: "#cbd5f5" }}>Year</TableCell>
            <TableCell sx={{ color: "#cbd5f5" }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r._id}>
              <TableCell sx={{ color: "white" }}>{r.month}</TableCell>
              <TableCell sx={{ color: "white" }}>{r.year}</TableCell>
              <TableCell sx={{ color: "white" }}>₹ {r.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default MyPayments;
