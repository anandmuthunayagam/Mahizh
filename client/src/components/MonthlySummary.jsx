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
  Tooltip,
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

function MonthlySummary() {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isInteger(month) || !Number.isInteger(year)) return;
    fetchSummary(month, year);
  }, [month, year]);

  const fetchSummary = async (m, y) => {
    const monthName = MONTHS[m - 1];
    if (!monthName || !y) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `/reports/monthly-summary?month=${monthName}&year=${y}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load monthly summary");
    } finally {
      setLoading(false);
    }
  };

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
      <Typography variant="h5" sx={styles.title}>
        Monthly Summary — {MONTHS[month - 1]} {year}
      </Typography>
      
      {/* Filters */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select fullWidth label="Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            InputLabelProps={{ style: styles.label }}
            InputProps={{ style: styles.input }}
          >
            {MONTHS.map((m, i) => (
              <MenuItem key={m} value={i + 1}>{m}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select fullWidth label="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            InputLabelProps={{ style: styles.label }}
            InputProps={{ style: styles.input }}
          >
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Divider sx={styles.divider} />

      {loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#6366f1" }} />
        </Box>
      )}

      {error && <Typography sx={{ color: "#f87171" }}>{error}</Typography>}

      {data && !loading && (
        <Grid container spacing={5}>
          {/* 1. Bar Chart Section (1/3 Width) */}
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

          {/* 2. Pie Chart Section (1/3 Width) */}
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

          {/* 3. Defaulters Section (1/3 Width) */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ ...styles.card, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={styles.sectionTitle}>
                Defaulters ({data.pendingHomes.length})
              </Typography>
              <Divider sx={{ ...styles.divider, my: 1 }} />
              
              <Box sx={{ 
                flexGrow: 1, 
                overflowY: "auto", 
                maxHeight: 400, width:300,
                pr: 1,
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: "#1e293b", borderRadius: "10px" }
              }}>
                {data.pendingHomes.length === 0 ? (
                  <Typography sx={{ color: "#4ade80", mt: 2 }}>🎉 No pending payments</Typography>
                ) : (
                  data.pendingHomes.map((h) => (
                    <Paper key={h.homeNo} sx={{ ...styles.defaulterCard, mt: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: "#e5e7eb", fontSize: 16 }}>
                        Home: {h.homeNo}
                      </Typography>
                      <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                        {h.resident?.name || "N/A"}
                      </Typography>
                      {h.resident?.phone && (
                        <Button
                          size="small"
                          startIcon={<WhatsAppIcon />}
                          sx={{ ...styles.whatsappBtn, fontSize: '1rem', py: 0.3, mt: 1 }}
                          onClick={() => {
                            const msg = `Hello ${h.resident.name}, Gentle Reminder: Maintenance Rs.550 for ${MONTHS[month - 1]} ${year} is pending.`;
                            window.open(`https://wa.me/91${h.resident.phone}?text=${encodeURIComponent(msg)}`);
                          }}
                        >
                          Remind
                        </Button>
                      )}
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
    width: '100%', // Ensure it expands to full screen width
  },
  title: {
    color: "#e5e7eb",
    fontWeight: 700,
    mb: 2,
  },
  sectionTitle: {
    color: "#e5e7eb",
    fontWeight: 600,
    mb: 1,
  },
  divider: {
    borderColor: "#1e293b",
    my: 2,
  },
  card: {
    backgroundColor: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 2,
    p: 2,
  },
  defaulterCard: {
    backgroundColor: "rgba(127, 29, 29, 0.1)",
    border: "1px solid #7f1d1d",
    borderRadius: 2,
    p: 1.2,
  },
  whatsappBtn: {
    color: "#22c55e",
    border: "1px solid #22c55e",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgba(34,197,94,0.1)",
    },
  },
  label: { color: "#cbd5f5" },
  input: { color: "white" },
};

export default MonthlySummary;