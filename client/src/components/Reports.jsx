import React from "react";
import ReportsDashboard from "./ReportsDashboard";

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};

function Reports(){
    return(
        <>
        {isAdmin() && (
            <>
            <ReportsDashboard />
            </>
        )}
        </>
    )

}
export default Reports