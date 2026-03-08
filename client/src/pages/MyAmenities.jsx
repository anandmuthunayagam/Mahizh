import React from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Stack, 
  Divider, List, ListItem, ListItemIcon, ListItemText, Chip, Container 
} from '@mui/material';
import { 
  Security, Videocam, InfoOutlined, WaterDrop, 
  Waves, Thunderstorm, CheckCircle, CleaningServices 
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StatusChip = ({ label = "Active" }) => (
  <Chip 
    icon={<CheckCircle sx={{ fontSize: '14px !important', color: '#10b981 !important' }} />}
    label={label} 
    size="small"
    sx={{ 
      bgcolor: 'rgba(16, 185, 129, 0.1)', 
      color: '#10b981', 
      fontWeight: 700,
      fontSize: '0.7rem',
      border: '1px solid rgba(16, 185, 129, 0.2)'
    }} 
  />
);

const AmenitySection = ({ title, icon, children, index, showStatus, statusLabel }) => (
  <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}> 
    <motion.div 
      custom={index} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1 }}
      style={{ display: 'flex', width: '100%' }}
    >
      <Card sx={{ 
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        bgcolor: '#0f172a', 
        border: '1px solid #1e293b', 
        borderRadius: 4,
        '&:hover': { borderColor: '#38bdf8' },
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'flex' }}>
              {icon}
            </Box>
            {showStatus && <StatusChip label={statusLabel} />}
          </Stack>
          
          <Typography variant="h6" fontWeight={700} color="white" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            {title}
          </Typography>
          
          <Divider sx={{ mb: 2, bgcolor: '#1e293b' }} />
          
          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  </Grid>
);

const MyAmenities = () => {
  return (
    <>
    <Box sx={{ p: 3,pl: 0,pt:0 }}>
     <Typography variant="h5" sx={{ color:  '#64748b', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.5rem' }  }}>
                   My Amenities
                 </Typography>
    </Box>
    <Box sx={{ 
      minHeight: { xs: 'auto', md: 'auto' }, // Full screen on desktop
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#0f172a' // Matches Login.jsx theme
    }}>
        
                 
         
        
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: { xs: 3, md: 5 }, textAlign: { xs: 'left', md: 'center' } }}>
          
        <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: '600px', mx: { md: 'auto' } }}>
            Community infrastructure status and maintenance schedules.
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch" sx={{ flexGrow: 1 }}>
          {/* 1. Safety & Security */}
          <AmenitySection index={0} title="Safety & Security" icon={<Security />} showStatus>
            <List dense disablePadding>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 30, color: '#38bdf8' }}><Videocam fontSize="small" /></ListItemIcon>
                <ListItemText primary="CCTV" secondary="7 Cameras Active" secondaryTypographyProps={{ color: '#64748b' }} />
              </ListItem>
              <ListItem sx={{ px: 0, mt: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30, color: '#38bdf8' }}><InfoOutlined fontSize="small" /></ListItemIcon>
                <ListItemText primary="All Gates & Terrace" secondary="24/7 Monitoring" secondaryTypographyProps={{ color: '#64748b' }} />
              </ListItem>
            </List>
          </AmenitySection>

          {/* 2. Water Management */}
          <AmenitySection index={1} title="Water Management" icon={<WaterDrop />} showStatus>
            <List dense disablePadding>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 30, color: '#38bdf8' }}><Waves fontSize="small" /></ListItemIcon>
                <ListItemText primary="Supply" secondary="2 Metro & 1 Borewell" secondaryTypographyProps={{ color: '#64748b' }} />
              </ListItem>
            </List>
          </AmenitySection>

          {/* 3. Drainage Management */}
          <AmenitySection index={2} title="Drainage Management" icon={<CleaningServices />} showStatus statusLabel="Maintained">
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.5, mb: 1.5 }}>
              Deep cleaning of drainage pit.
            </Typography>
            <Box sx={{ mt: 'auto', p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block' }}>
                LAST CLEANED
              </Typography>
              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>
                Oct 15, 2025
              </Typography>
            </Box>
          </AmenitySection>

          {/* 4. Rain Water Harvesting */}
          <AmenitySection index={3} title="Rain Water Harvesting" icon={<Thunderstorm />}showStatus>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
              Runoff is filtered and directed to sump.
            </Typography>
          </AmenitySection>
        </Grid>
      </Container>
    </Box>
    </>
  );
};

export default MyAmenities;