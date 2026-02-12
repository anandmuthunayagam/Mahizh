import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { motion } from "framer-motion";

import G1 from "../assets/homes/Gemini_G1.png";
import F1 from "../assets/homes/Gemini_F1.png";
import F2 from "../assets/homes/Gemini_F2.png";
import S1 from "../assets/homes/Gemini_S1.png";
import S2 from "../assets/homes/Gemini_S2.png";

const homeImages = { G1, F1, F2, S1, S2 };

function HomeCard({ home, selectedMonth, selectedYear }) {
  const isPaid = home.status === "PAID";
  const isAdmin = () => {
    return localStorage.getItem("role") === "admin";
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${home.ownerName},\n\n` +
      `This is a reminder for Apartment Maintenance payment.\n\n` +
      `🏠 Home: ${home.homeNumber}\n` +
      `📅 Month: ${selectedMonth} ${selectedYear}\n` +
      `💰 Status: Pending\n\n` +
      `Please make the payment at your convenience.\nThank you.`
  );

  const whatsappUrl = `https://wa.me/91${home.ownerContact}?text=${whatsappMessage}`;

  return (
    <motion.div
      animate={
        !isPaid
          ? { scale: [1, 1.03, 1] }
          : {}
      }
      transition={
        !isPaid
          ? { duration: 1.4, repeat: Infinity }
          : {}
      }
    >
      <Card
        sx={{
          backgroundColor: "#121212",
          color: "#fff",
          borderRadius: 3,
          boxShadow: isPaid
            ? "0 4px 12px rgba(0,0,0,0.4)"
            : "0 0 16px rgba(255, 193, 7, 0.8)",
        }}
      >
        {/* Image */}
        <CardMedia
          component="img"
          height="160"
          image={homeImages[home.homeNo]}
          alt={home.homeNo}
        />

        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6">{home.homeNo}</Typography>
            <Chip
              label={isPaid ? "PAID" : "PENDING"}
              color={isPaid ? "success" : "warning"}
              size="small"
            />
          </Box>

          {/* Owner */}
          <Typography 
            noWrap // Truncates with "..."
            // OR use line-clamp for multi-line truncation:
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.75rem',
            }}
          >
            Owner: {home.owner.name}
          </Typography>
          <Typography 
            noWrap // Truncates with "..."
            // OR use line-clamp for multi-line truncation:
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color:"#38bdf8",
              fontSize: '0.75rem',
            }}
          >
            Contact: {home.owner.phone}
          </Typography>
           {/* Owner */}
          <Typography 
            noWrap // Truncates with "..."
            // OR use line-clamp for multi-line truncation:
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.75rem',
            }}
          >
            Resident: {home.resident.name}
          </Typography>
          <Typography 
            noWrap // Truncates with "..."
            // OR use line-clamp for multi-line truncation:
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color:"#38bdf8",
              fontSize: '0.75rem',
            }}
          >
            Contact: {home.resident.phone}
          </Typography>

          {/* WhatsApp Button */}
         
          {isAdmin() && !isPaid ? (
            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsAppIcon />}
              href={whatsappUrl}
              target="_blank"
              sx={{
                backgroundColor: "#25D366",
                color: "#000",
                fontWeight: "bold",
                fontSize: '0.75rem',
                "&:hover": {
                  backgroundColor: "#1ebe5d",
                },
              }}
            >
              Send Reminder
            </Button>
          ) : null}
        
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default HomeCard;
