import React from "react";
import { Box, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        height: 48,
        backgroundColor: "#020617",
        borderTop: "1px solid #1E293B",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        color: "#94A3B8",
      }}
    >
      {/* LEFT */}
      <Typography variant="body2">
        © {new Date().getFullYear()} Mahizh Connect
      </Typography>

      {/* RIGHT */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Link
          href="#"
          underline="none"
          sx={{
            color: "#94A3B8",
            fontSize: 13,
            "&:hover": { color: "#38BDF8" },
          }}
        >
          Privacy
        </Link>

        <Link
          href="#"
          underline="none"
          sx={{
            color: "#94A3B8",
            fontSize: 13,
            "&:hover": { color: "#38BDF8" },
          }}
        >
          Terms
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;
