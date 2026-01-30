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

import G1 from "../assets/homes/G1.png";
import F1 from "../assets/homes/F1.png";
import F2 from "../assets/homes/F2.png";
import S1 from "../assets/homes/S1.png";
import S2 from "../assets/homes/S2.png";

const homeImages = { G1, F1, F2, S1, S2 };

function HomeCard({ home, selectedMonth, selectedYear }) {
  const isPaid = home.status === "PAID";

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
          image={homeImages[home.homeNumber]}
          alt={home.homeNumber}
        />

        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6">{home.homeNumber}</Typography>
            <Chip
              label={isPaid ? "PAID" : "PENDING"}
              color={isPaid ? "success" : "warning"}
              size="small"
            />
          </Box>

          {/* Owner */}
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Owner: {home.ownerName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
            Contact: {home.ownerContact}
          </Typography>

          {/* WhatsApp Button */}
          {!isPaid && (
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
                "&:hover": {
                  backgroundColor: "#1ebe5d",
                },
              }}
            >
              Send Reminder
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default HomeCard;
