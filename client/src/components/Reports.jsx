import React, { useState } from "react";
import MonthlySummary from "./MonthlySummary";

import { Box, MenuItem, TextField } from "@mui/material";

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};

function Reports(){
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [year, setYear] = useState(new Date().getFullYear());
    
   

    const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
    return(

        
        <>
        {/*
        
        
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <TextField
                            select
                            
                            label="Month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ style: { color: "#cbd5f5" } }}
                            InputProps={{ style: { color: "white" } }}
                          >
                            {months.map((m) => (
                              <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))}
                </TextField>
        
                <TextField
                  select
                  label="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  InputLabelProps={{ style: { color: "#cbd5f5" } }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{ minWidth: 140 }}
                >
                  {[2024, 2025, 2026].map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
        */}
        {isAdmin() && (
            <>
                     
            <MonthlySummary></MonthlySummary>
           
            {/*
            <MonthlySummary month={month} year={year}></MonthlySummary>
             */}
            </>
        )}
        </>
    )

}
export default Reports