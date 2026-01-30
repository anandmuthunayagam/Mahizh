import React from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, alpha, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// --- Styled Components for Search ---
const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: alpha("#ffffff", 0.05),
  "&:hover": {
    backgroundColor: alpha("#ffffff", 0.08),
    border: "1px solid #38bdf8",
  },
  border: "1px solid #1e293b",
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: "100%",
  maxWidth: "500px", // Limits search bar width in the middle
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  color: "#94a3b8",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    fontSize: "0.9rem",
  },
}));

function TopBar() {
  const userRole = localStorage.getItem("role") || "Guest";

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
        ml: `240px`,
        bgcolor: "#020617",
        boxShadow: "none",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* SECTION 1: Branding (Left) */}
        <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 700, letterSpacing: "-0.5px" }}>
          Mahizh <span style={{ color: "#38bdf8" }}>Connect</span>
        </Typography>

        {/* SECTION 2: Search Bar (Middle) */}
        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search for residents, bills, or reports..."
            inputProps={{ "aria-label": "search" }}
          />
        </SearchContainer>

        {/* SECTION 3: User Info (Right) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "fit-content" }}>
          <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Welcome,
          </Typography>
          <Typography
            sx={{
              color: "#38bdf8",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {userRole}
          </Typography>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default TopBar;