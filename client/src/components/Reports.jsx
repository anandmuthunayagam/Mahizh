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
        {isAdmin() && (
            <>
              <MonthlySummary></MonthlySummary>
            </>
        )}
        </>
    )
}
export default Reports