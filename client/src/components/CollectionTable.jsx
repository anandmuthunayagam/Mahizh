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

function CollectionTable({ refreshKey }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    axios.get("/collections").then(res => setCollections(res.data));
  }, [refreshKey]);

  return (
    <Paper
      sx={{
        backgroundColor: "#020617",
        borderRadius: 3,
        p: 2,
        mb: 4,
        border: "1px solid #1e293b",
      }}
    >
      <Typography sx={{ color: "#e5e7eb", mb: 2, fontWeight: 600 }}>
        Collections
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            {["Home", "Month", "Year", "Amount"].map(h => (
              <TableCell key={h} sx={{ color: "#94a3b8" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {collections.map(c => (
            <TableRow key={c._id}>
              <TableCell sx={{ color: "white" }}>{c.homeNumber}</TableCell>
              <TableCell sx={{ color: "white" }}>{c.month}</TableCell>
              <TableCell sx={{ color: "white" }}>{c.year}</TableCell>
              <TableCell sx={{ color: "#22c55e", fontWeight: 600 }}>
                ₹{c.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default CollectionTable;
