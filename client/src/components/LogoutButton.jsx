import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();      // remove token + role
    navigate("/login");        // go to login page
  };

  return (
    
    <></>
    
  );
}

export default LogoutButton;
