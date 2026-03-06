import React from "react";
// ✅ IMPORT: Added useOutletContext to receive session data from MainLayout
import { useNavigate, useOutletContext } from "react-router-dom";
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

import G1 from "../assets/homes/G1.png";
import F1 from "../assets/homes/F1.png";
import F2 from "../assets/homes/F2.png";
import S1 from "../assets/homes/S1.png";
import S2 from "../assets/homes/S2.png";

const homeImages = { G1, F1, F2, S1, S2 };

function HomeCard({ home, selectedMonth, selectedYear,isClickable = false }) {
  // ✅ CONTEXT: Fetch the userRole passed down from MainLayout context
  const { userRole } = useOutletContext();
  
  const isPaid = home.status === "PAID";

  // ✅ UPDATED: Use userRole from context instead of localStorage
  const isAdmin = () => userRole === "admin";

  const navigate = useNavigate(); // Initialize navigation

  const handleCardClick = () => {
    // Navigate to the detail page
    // Only navigate if the prop is true
    if (isClickable) {
      navigate(`/home-details/${home.homeNo}`);
    }
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

  const getStatusDetails = () => {
    
  const isPaid = home.status === "PAID";
  if (isPaid) return { label: "PAID", color: "success" };

  const MONTHS = [
  "All", "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
  const now = new Date();
    const currentMonthIdx = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    // Convert selection to index (Subtract 1 because MONTHS[0] is "All")
    const selectedMonthIdx = MONTHS.indexOf(selectedMonth) - 1; 
    const selectedYearNum = parseInt(selectedYear);

    // 2. Check if it is OVERDUE (Past months)
    const isPast = selectedYearNum < currentYear || 
                   (selectedYearNum === currentYear && selectedMonthIdx < currentMonthIdx);

    if (isPast) {
      return { label: "OVERDUE", color: "error" };
    }

    // 3. For Current and Future months: Show "Due by next month start"
    // We calculate the 5th of the month following the selected one
    const dueDate = new Date(selectedYearNum, selectedMonthIdx + 1, 5);
    const formattedDate = dueDate.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short' 
    });

    return { 
      label: `DUE by ${formattedDate}`, 
      color: selectedMonthIdx === currentMonthIdx ? "warning" : "info" 
    };
  };

  const status = getStatusDetails();

  return (
    <motion.div
      layoutId={isClickable ? `card-${home.homeNo}` : undefined} // Unique ID for the whole card
      onClick={handleCardClick}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
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
            width: '100%',
        }}
      >
        <motion.div layoutId={`image-${home.homeNo}`}> {/* Shared ID for the image */}
        <CardMedia
          component="img"
          height="200"
          image={homeImages[home.homeNo]}
          alt={home.homeNo}
        />
        </motion.div>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6" fontWeight='bold' color="#B87333">{home.homeNo}</Typography>
            
            <Chip
              label={status.label}
              color={status.color}
              size="small"
              sx={{ fontWeight: 'bold' }}
/>
          </Box>
          {/*
          <Typography 
            noWrap 
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
            noWrap 
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
          <br></br>
          */}
          <Typography 
            noWrap 
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
            noWrap 
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

          {/* ✅ UPDATED: The button visibility now relies on the session context */}
          
          {isAdmin() && !isPaid ? (
            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsAppIcon />}
              href={whatsappUrl}
              target="_blank"
              sx={{
                mt: 2,
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