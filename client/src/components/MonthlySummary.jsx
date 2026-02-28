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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/collections/monthly-summary", {
          params: { month: MONTHS[month], year },
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [month, year, token]);

  const handleWhatsAppRemind = (home) => {
    const message = `Hi ${home.owner.name}, this is a friendly reminder regarding the maintenance payment for Home ${home.homeNo} for ${MONTHS[month]} ${year}. Please ignore if already paid.`;
    window.open(`https://wa.me/${home.owner.phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

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
        <Grid container spacing={3} alignItems="stretch">
          {/* 1. Bar Chart */}
          <Grid item xs={12} md={4}>
            <ChartCard title="Income vs Expense">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.pieData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.pieData.map((entry, index) => (
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
                    data={data.pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Stack direction="row" justifyContent="center" spacing={3}>
                <Typography sx={{ color: '#4ade80', fontSize: '0.8rem' }}>● Income</Typography>
                <Typography sx={{ color: '#f87171', fontSize: '0.8rem' }}>● Expense</Typography>
              </Stack>
            </ChartCard>
          </Grid>

          {/* 3. Pending Collections List - Now using md={4} for even width */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ ...styles.card, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={styles.sectionTitle}>
                Pending Payments ({data.pendingHomes.length})
              </Typography>
              <Box sx={{ flexGrow: 1, maxHeight: 320, overflow: 'auto', mt: 2, pr: 1 }}>
                {data.pendingHomes.length === 0 ? (
                  <Typography sx={{ color: '#94a3b8', textAlign: 'center', py: 2 }}>
                    All clear! No pending payments.
                  </Typography>
                ) : (
                  data.pendingHomes.map((home) => (
                    <Paper key={home.homeNo} sx={{ ...styles.listRow, mb: 1 }}>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                          Home: {home.homeNo}
                        </Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          Owner: {home.owner.name}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<WhatsAppIcon sx={{ fontSize: '1rem !important' }} />}
                        onClick={() => handleWhatsAppRemind(home)}
                        sx={{ ...styles.remindButton, fontSize: '0.7rem' }}
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
  <Paper sx={{ ...styles.card, height: '100%' }}>
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
      "& fieldset": { borderColor: "#1e293b" },
      "&:hover fieldset": { borderColor: "#334155" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
  },
  listRow: {
    backgroundColor: "#1e293b",
    p: 1.5,
    borderRadius: 1.5,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #334155",
  },
  remindButton: {
    borderColor: "#22c55e",
    color: "#22c55e",
    "&:hover": { borderColor: "#4ade80", backgroundColor: "rgba(34, 197, 94, 0.1)" },
  }
};

export default MonthlySummary;