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
} from "recharts";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "../utils/api/axios";

/* ================= CONSTANTS ================= */

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

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
    // eslint-disable-next-line
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
      console.log(res.data);
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
      <Typography sx={styles.title}>
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
            {[2025, 2026, 2027].map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Divider sx={styles.divider} />

      {loading && <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>}

      {error && <Typography sx={{ color: "#f87171" }}>{error}</Typography>}

      {data && !loading && (
        <>
          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ChartCard title="Collection vs Expense">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#cbd5f5" />
                    <YAxis stroke="#cbd5f5" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <ChartCard title="Paid vs Pending Homes">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={90}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          <Divider sx={styles.divider} />

          {/* Defaulters Drill Down */}
          <Typography sx={styles.sectionTitle}>Defaulters (Action Required)</Typography>

          {data.pendingHomes.length === 0 && (
            <Typography sx={{ color: "#4ade80" }}>
              🎉 No pending payments
            </Typography>
          )}

          {data.pendingHomes.map((h) => (
            <Paper key={h.homeNo} sx={styles.defaulterCard}>
              <Stack spacing={1}>
                <Typography sx={{ fontWeight: 600, color: "#e5e7eb" }}>
                  Home: {h.homeNo}
                </Typography>

                <Typography sx={styles.meta}>
                  Owner: {h.owner?.name || "N/A"} — {h.owner?.phone || "N/A"}
                </Typography>

                <Typography sx={styles.meta}>
                  Resident: {h.resident?.name || "N/A"} — {h.resident?.phone || "N/A"}
                </Typography>

                {h.owner?.phone && (
                  <Button
                    startIcon={<WhatsAppIcon />}
                    sx={styles.whatsappBtn}
                    onClick={() => {
                      const msg =
                        `Hello ${h.resident.name}, This is a Gentle Reminder that the apartment maintenance payment Rs.550 for ${MONTHS[month - 1]} ${year} is pending. Please ignore if already paid.`;
                      window.open(
                        `https://wa.me/91${h.resident.phone}?text=${encodeURIComponent(msg)}`
                      );
                    }}
                  >
                    Send WhatsApp Reminder
                  </Button>
                )}
              </Stack>
            </Paper>
          ))}
        </>
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
    backgroundColor: "#020617",
    border: "1px solid #7f1d1d",
    borderRadius: 2,
    p: 2,
    mt: 2,
  },
  meta: {
    color: "#cbd5f5",
    fontSize: 14,
  },
  whatsappBtn: {
    mt: 1,
    alignSelf: "flex-start",
    color: "#22c55e",
    border: "1px solid #22c55e",
    "&:hover": {
      backgroundColor: "rgba(34,197,94,0.1)",
    },
  },
  label: { color: "#cbd5f5" },
  input: { color: "white" },
};

export default MonthlySummary;
