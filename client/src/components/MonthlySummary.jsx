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

// ✅ UPDATED: Accepting token as a prop from Reports.jsx
function MonthlySummary({ token }) {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthName = MONTHS[month];
        
        // ✅ AUTHENTICATION: Create config with the session token
        const config = {
          params: { month: monthName, year },
          headers: { Authorization: `Bearer ${token}` }
        };

        const [colRes, expRes, homesRes] = await Promise.all([
          axios.get("/collections", config),
          axios.get("/expenses", config),
          axios.get("/owner-residents/home-status", config),
        ]);

        const totalCollections = colRes.data.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = expRes.data.reduce((sum, item) => sum + item.amount, 0);
        const pendingHomes = homesRes.data.filter((h) => h.status !== "PAID");

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year, token]); // ✅ RE-RUN: If the token changes (session reset)

  const handleWhatsAppRemind = (home) => {
    const message = encodeURIComponent(
      `Hello ${home.owner.name},\n\n` +
      `This is a friendly reminder for the Apartment Maintenance payment.\n\n` +
      `🏠 Home: ${home.homeNo}\n` +
      `📅 Month: ${MONTHS[month]} ${year}\n` +
      `💰 Status: Pending\n\n` +
      `Please clear the dues at your convenience. Thank you!`
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

  const barData = data ? [
    { name: "Collection", value: data.totalCollection },
    { name: "Expense", value: data.totalExpense },
  ] : [];

  const pieData = data ? [
    { name: "Paid", value: data.paidHomes.length },
    { name: "Pending", value: data.pendingHomes.length },
  ] : [];

  return (
    <Paper sx={styles.container}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={styles.title}>Financial Performance Summary</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={styles.select}
          >
            {MONTHS.map((m, index) => (
              <MenuItem key={m} value={index}>{m}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={styles.select}
          >
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Stack>

      <Divider sx={styles.divider} />

      {data && (
        <Grid container spacing={3}>
          {/* Charts Row */}
          <Grid item xs={12} md={4}>
             <ChartCard title="Collection vs Expense">
              <Box sx={{ height: 400, width:400,mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#cbd5f5" fontSize={12} />
                    <YAxis stroke="#cbd5f5" fontSize={12} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: "#1e293b", border: "none", color: "#fff" }}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    {/* Adding the labels here */}
                    <LabelList dataKey="value" position="center" fill="#111110" fontSize={12} offset={1} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </ChartCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <ChartCard title="Paid vs Pending">
              <Box sx={{ height: 400, width:400,mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={5}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </ChartCard>
          </Grid>

          {/* Pending Collections List */}
          <Grid item xs={12}>
            <Paper sx={styles.card}>
              <Typography sx={styles.sectionTitle}>
                Pending Payments ({data.pendingHomes.length})
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto', mt: 2 }}>
                {data.pendingHomes.length === 0 ? (
                  <Typography sx={{ color: '#94a3b8', textAlign: 'center', py: 2 }}>All clear! No pending payments.</Typography>
                ) : (
                  data.pendingHomes.map((home) => (
                    <Paper key={home.homeNo} sx={styles.listRow}>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 600 }}>Home: {home.homeNo}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>Owner: {home.owner.name}</Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
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
      )}
    </Paper>
  );
}

/* ================= REUSABLE ================= */

const ChartCard = ({ title, children }) => (
  <Paper sx={styles.card}>
    <Typography sx={styles.sectionTitle}>{title}</Typography>
    {children}
  </Paper>
);

/* ================= STYLES ================= */

const styles = {
  container: {
    backgroundColor: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 3,
    p: 3,
    width: '100%',
  },
  title: {
    color: "#e5e7eb",
    fontWeight: 700,
  },
  sectionTitle: {
    color: "#38bdf8",
    fontWeight: 600,
    mb: 1,
  },
  divider: {
    borderColor: "#1e293b",
    my: 2,
  },
  card: {
    backgroundColor: "#0F172A",
    border: "1px solid #1e293b",
    p: 2,
    borderRadius: 2,
  },
  select: {
    width: 150,
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& .MuiSvgIcon-root": { color: "#38bdf8" },
      "& fieldset": { borderColor: "#1e293b" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
  },
  listRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 1.5,
    mb: 1,
    bgcolor: '#1e293b',
    border: '1px solid #334155',
  },
  remindButton: {
    color: '#25D366',
    borderColor: '#25D366',
    '&:hover': {
      borderColor: '#1ebe5d',
      bgcolor: 'rgba(37, 211, 102, 0.1)',
    }
  }
};

export default MonthlySummary;