import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Grid,
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

/* ================= CONSTANTS ================= */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const startYear = 2012;
const currentYearValue = new Date().getFullYear();
const YEARS = Array.from(
  { length: currentYearValue - startYear + 2 }, 
  (_, i) => startYear + i
).reverse();

const COLORS = ["#4ade80", "#f87171"];
const CURRENT_MONTH = new Date().getMonth(); 
const CURRENT_YEAR = new Date().getFullYear();

/* ================= COMPONENT ================= */
function MonthlySummary({ token }) {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // If no token is provided yet, don't attempt fetch
      if (!token) return;

      setLoading(true);
      try {
        const monthName = MONTHS[month];
        const config = {
          params: { month: monthName, year },
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch all required data in parallel
        const [colRes, expRes, homesRes] = await Promise.all([
          axios.get("/collections", config),
          axios.get("/expenses", config),
          axios.get("/owner-residents/home-status", config),
        ]);

        const totalCollections = colRes.data.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = expRes.data.reduce((sum, item) => sum + item.amount, 0);
        const pendingHomes = (homesRes.data || []).filter((h) => h.status !== "PAID");

        setData({
          totalCollections,
          totalExpenses,
          pieData: [
            { name: "Collections", value: totalCollections },
            { name: "Expenses", value: totalExpenses },
          ],
          pendingHomes,
        });
      } catch (error) {
        console.error("Error fetching summary data:", error);
        // Set empty data instead of null to prevent white screen
        setData({ totalCollections: 0, totalExpenses: 0, pieData: [], pendingHomes: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year, token]);

  const handleWhatsAppRemind = (home) => {
    const message = encodeURIComponent(
      `Hello ${home.owner.name},\n\nThis is a friendly reminder for the Maintenance payment for Home ${home.homeNo} (${MONTHS[month]} ${year}).\n\nStatus: Pending. Thank you!`
    );
    window.open(`https://wa.me/91${home.owner.phone}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress sx={{ color: '#38bdf8' }} />
      </Box>
    );
  }

  return (
    <Paper sx={styles.container}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={styles.title}>Financial Performance Summary</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select size="small" label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={styles.select}
          >
            {MONTHS.map((m, index) => <MenuItem key={m} value={index}>{m}</MenuItem>)}
          </TextField>

          <TextField
            select size="small" label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={styles.select}
          >
            {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>
        </Box>
      </Stack>

      <Divider sx={styles.divider} />

      <Grid container spacing={3} alignItems="stretch">
        {/* 1. Bar Chart */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Income vs Expense">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.pieData || []}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {(data?.pieData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList dataKey="value" position="top" fill="#fff" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* 2. Pie Chart */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Allocation Ratio">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.pieData || []}
                  innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                >
                  {(data?.pieData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <Stack direction="row" justifyContent="center" spacing={3}>
              <Typography sx={{ color: '#4ade80', fontSize: '0.8rem' }}>● Income</Typography>
              <Typography sx={{ color: '#f87171', fontSize: '0.8rem' }}>● Expense</Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* 3. Pending Collections */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ ...styles.card, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={styles.sectionTitle}>
              Pending Payments ({data?.pendingHomes?.length || 0})
            </Typography>
            <Box sx={{ flexGrow: 1, maxHeight: 310, overflow: 'auto', mt: 1 }}>
              {!data?.pendingHomes?.length ? (
                <Typography sx={{ color: '#94a3b8', textAlign: 'center', py: 2 }}>All clear!</Typography>
              ) : (
                data.pendingHomes.map((home) => (
                  <Paper key={home.homeNo} sx={styles.listRow}>
                    <Box>
                      <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>Home: {home.homeNo}</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>{home.owner.name}</Typography>
                    </Box>
                    <Button
                      size="small" variant="outlined"
                      startIcon={<WhatsAppIcon sx={{ fontSize: '1rem !important' }} />}
                      onClick={() => handleWhatsAppRemind(home)}
                      sx={styles.remindButton}
                    >
                      Remind
                    </Button>
                  </Paper>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}

const ChartCard = ({ title, children }) => (
  <Paper sx={{ ...styles.card, height: '100%' }}>
    <Typography sx={styles.sectionTitle}>{title}</Typography>
    {children}
  </Paper>
);

const styles = {
  container: { backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: 3, p: 3, width: '100%' },
  title: { color: "#e5e7eb", fontWeight: 700 },
  sectionTitle: { color: "#38bdf8", fontWeight: 600, mb: 1 },
  divider: { borderColor: "#1e293b", my: 2 },
  card: { backgroundColor: "#0F172A", border: "1px solid #1e293b", p: 2, borderRadius: 2 },
  select: {
    width: 150,
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "#1e293b" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
  },
  listRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    p: 1.5, mb: 1, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 1
  },
  remindButton: {
    color: '#25D366', borderColor: '#25D366', fontSize: '0.7rem',
    '&:hover': { borderColor: '#1ebe5d', bgcolor: 'rgba(37, 211, 102, 0.1)' }
  }
};

export default MonthlySummary;