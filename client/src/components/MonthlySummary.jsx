import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Divider,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "../utils/api/axios";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const COLORS = ["#4ade80", "#f87171"];

function MonthlySummary({ token }) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const config = { params: { month: MONTHS[month], year }, headers: { Authorization: `Bearer ${token}` } };
        const [colRes, expRes, homesRes] = await Promise.all([
          axios.get("/collections", config),
          axios.get("/expenses", config),
          axios.get("/owner-residents/home-status", config),
        ]);
        const totalCollections = colRes.data.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = expRes.data.reduce((sum, item) => sum + item.amount, 0);
        setData({
          pieData: [
            { name: "Income", value: totalCollections },
            { name: "Expense", value: totalExpenses }
          ],
          pendingHomes: (homesRes.data || []).filter((h) => h.status !== "PAID"),
        });
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, [month, year, token]);

  const handleWhatsAppRemind = (home) => {
    const message = encodeURIComponent(`Hello ${home.owner.name}, Reminder for Home ${home.homeNo} maintenance.`);
    window.open(`https://wa.me/91${home.owner.phone}?text=${message}`, "_blank");
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

  return (
    <Paper sx={styles.container}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 700 }}>Financial Performance Summary</Typography>
        <Stack direction="row" spacing={2}>
          <TextField select size="small" value={month} onChange={(e) => setMonth(e.target.value)} sx={styles.select}>
            {MONTHS.map((m, i) => <MenuItem key={m} value={i}>{m}</MenuItem>)}
          </TextField>
          <TextField select size="small" value={year} onChange={(e) => setYear(e.target.value)} sx={styles.select}>
            {[2024, 2025, 2026].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: "#1e293b", mb: 4 }} />

      {/* CSS FLEXBOX REPLACEMENT FOR MUI GRID 
          This forces 3 equal columns across the full width 
      */}
      <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3, 
          width: '100%', 
          alignItems: 'stretch' 
      }}>
        
        {/* 1. Bar Chart */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={styles.card}>
            <Typography sx={styles.sectionTitle}>Income vs Expense</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.pieData} margin={{ top: 25, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis hide />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                  {data?.pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  <LabelList dataKey="value" position="top" fill="#fff" formatter={(v) => `₹${v.toLocaleString()}`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* 2. Pie Chart */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={styles.card}>
            <Typography sx={styles.sectionTitle}>Allocation Ratio</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data?.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" cx="50%" cy="50%">
                  {data?.pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 1 }}>
              <Typography sx={{ color: COLORS[0], fontSize: '0.75rem', fontWeight: 600 }}>● Income</Typography>
              <Typography sx={{ color: COLORS[1], fontSize: '0.75rem', fontWeight: 600 }}>● Expense</Typography>
            </Stack>
          </Paper>
        </Box>

        {/* 3. Pending Collections */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ ...styles.card, height: '100%' }}>
            <Typography sx={styles.sectionTitle}>Pending Payments ({data?.pendingHomes?.length})</Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 310, mt: 1 }}>
              {data?.pendingHomes.map((home) => (
                <Paper key={home.homeNo} sx={styles.listRow}>
                  <Box>
                    <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Home: {home.homeNo}</Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>{home.owner.name}</Typography>
                  </Box>
                  <Button 
                    size="small" variant="outlined" 
                    startIcon={<WhatsAppIcon sx={{ fontSize: '1rem !important' }} />} 
                    onClick={() => handleWhatsAppRemind(home)}
                    sx={styles.waButton}
                  >Remind</Button>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>

      </Box>
    </Paper>
  );
}

const styles = {
  container: { 
    backgroundColor: "#020617", 
    border: "1px solid #1e293b", 
    borderRadius: 3, 
    p: { xs: 2, md: 3 }, 
    width: '100%', 
    boxSizing: 'border-box' 
  },
  card: { 
    backgroundColor: "#0F172A", 
    border: "1px solid #1e293b", 
    p: 2.5, 
    borderRadius: 2, 
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  sectionTitle: { color: "#38bdf8", fontWeight: 600, mb: 1 },
  select: { width: 140, "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "#1e293b" } } },
  listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#1e293b', borderRadius: 1 },
  waButton: { color: '#25D366', borderColor: '#25D366', fontSize: '0.65rem', textTransform: 'none' }
};

export default MonthlySummary;