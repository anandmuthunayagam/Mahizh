import React from "react";
import Summary from "./Summary";
import CollectionForm from "./CollectionForm";
import CollectionTable from "./CollectionTable";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";
import { Divider, Typography } from "@mui/material";
import { useState } from "react";


const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};




function Dashboard(){
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
    return(
        <>
        <div style={{ padding: "20px", position: "relative" }}>
        <Typography variant="h5" sx={{ color: "white", mb: 3, fontWeight: 600 }}>Monthly Summary</Typography>
        <Summary refreshKey={refreshKey}/>
        <CollectionTable refreshKey={refreshKey}/>
        <ExpenseTable refreshKey={refreshKey}/>
        <Divider></Divider>
        
        {isAdmin() && (
            <>
            <CollectionForm onSuccess={triggerRefresh}/>
            <Divider></Divider>
            </>
        )}
        {isAdmin() && (
            <>
            <ExpenseForm onSuccess={triggerRefresh}/>
            <Divider></Divider>
            </>
      
        )}
        </div>
        </>
    )

}
export default Dashboard

