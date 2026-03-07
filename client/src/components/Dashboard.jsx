import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Stack, 
  Paper, 
  Fade,
  MenuItem,
  TextField,
  Divider,
  Grid,
  Button,
  Tooltip,
  IconButton
} from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import TableChartIcon from '@mui/icons-material/TableChart';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import { toPng } from 'html-to-image'; 
import CollectionTable from "./CollectionTable";
import ExpenseTable from "./ExpenseTable";
import axios from "../utils/api/axios";
import mahizh from '../assets/MahizhLogo.png';
import { useSnackbar } from "../utils/context/SnackbarContext";

const MONTHS = [
  "All", "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const startYear = 2012;
const currentYearValue = new Date().getFullYear();
const YEARS = [
  "All", 
  ...Array.from(
    { length: currentYearValue - startYear + 2 }, 
    (_, i) => (startYear + i).toString()
  ).reverse()
];

function Dashboard() {
  const { token, userRole } = useOutletContext(); //
  const [refreshKey, setRefreshKey] = useState(0);
  const contentRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false); 
  
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [filterMonth, setFilterMonth] = useState(lastMonthDate.toLocaleString('default', { month: 'long' }));
  const [filterYear, setFilterYear] = useState(lastMonthDate.getFullYear().toString());
  const showSnackbar = useSnackbar();

  const isAdmin = () => userRole === "admin";

  const exportToExcel = async () => {
    try {
      const params = {};
      if (filterMonth !== "All") params.month = filterMonth;
      if (filterYear !== "All") params.year = filterYear;
      const config = { params, headers: { Authorization: `Bearer ${token}` } };
      const [colRes, expRes] = await Promise.all([
        axios.get('/collections', config),
        axios.get('/expenses', config)
      ]);
      const wb = XLSX.utils.book_new();
      const colData = colRes.data.map(item => ({ HomeNo: item.homeNo, Amount: item.amount, Month: item.month, Year: item.year, Status: item.status || "Paid" }));
      const expData = expRes.data.map(item => ({ Date: new Date(item.date).toLocaleDateString(), Title: item.title, Amount: item.amount, Month: item.month, Year: item.year }));
      const colSheet = XLSX.utils.json_to_sheet(colData);
      const expSheet = XLSX.utils.json_to_sheet(expData);
      XLSX.utils.book_append_sheet(wb, colSheet, "Collections");
      XLSX.utils.book_append_sheet(wb, expSheet, "Expenses");
      XLSX.writeFile(wb, `Mahizh_Connect_${filterMonth}_${filterYear}.xlsx`);
      showSnackbar("Excel exported successfully!", "success");
    } catch (err) { console.error('Excel export failed', err); }
  };

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Mahizh_Connect_${filterMonth}_${filterYear}`,
  });

  const exportImage = async () => {
    if (!contentRef.current) return;
    setIsExporting(true);
    
    try {
      // Delay to ensure the DOM updates with export-specific CSS classes
      await new Promise(resolve => setTimeout(resolve, 850));

      const dataUrl = await toPng(contentRef.current, { 
        cacheBust: true,
        backgroundColor: "#020617",
        // Force capture of the full scrollable area
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight,
        filter: (node) => !(node.classList && node.classList.contains('no-export')),
        style: {
          padding: '40px',
          overflow: 'visible'
        }
      });

      const link = document.createElement('a');
      link.download = `Mahizh_Connect_${filterMonth}_${filterYear}.png`;
      link.href = dataUrl;
      link.click();
      
      setIsExporting(false);
      showSnackbar("Full Dashboard captured successfully!", "success");
    } catch (err) {
      console.error('Capture failed', err);
      setIsExporting(false);
      showSnackbar("Failed to capture image", "error");
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box 
        ref={contentRef} 
        sx={{ 
          p: { xs: 2, md: 4 }, 
          backgroundColor: "#020617", 
          minHeight: "100vh",
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <style>
          {`
            @media print {
              @page { size: A4 portrait; margin: 0; }
              body { margin: 15mm; background-color: #020617 !important; zoom: 79%; }
              .no-print { display: none !important; }
            }

            ${isExporting ? `
              /* Remove all scrollbars without collapsing containers */
              * { 
                scrollbar-width: none !important; 
                -ms-overflow-style: none !important; 
              }
              *::-webkit-scrollbar { display: none !important; }

              /* Force UI components to expand to their full content height */
              .MuiPaper-root, .MuiTableContainer-root { 
                overflow: visible !important; 
                height: auto !important; 
                max-height: none !important;
                width: 100% !important;
              }

              /* Lock Logo Dimensions to maintain circle shape */
              .logo-fixed-wrapper {
                width: 110px !important;
                height: 110px !important;
                min-width: 110px !important;
                border-radius: 50% !important;
                overflow: hidden !important;
                flex-shrink: 0 !important;
                border: 2px solid #38bdf8 !important;
              }
            ` : ''}
            
            .export-header { display: ${isExporting ? 'flex' : 'none'}; width: 100%; justify-content: space-between; align-items: center; margin-bottom: 40px; }
            .export-footer { display: ${isExporting ? 'block' : 'none'}; margin-top: 40px; text-align: center; }
          `}
        </style>

        {/* --- EXPORT HEADER --- */}
        <Box className="export-header">
            <Box className="logo-fixed-wrapper">
              <img src={mahizh} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'white' }}>Mahizh</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#38bdf8' }}>Connect</Typography>
            </Box>
        </Box>

        <Box sx={{ mb: 3,pt:0 }}>
          <Typography variant="h5" sx={{ color: isExporting ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.5rem' }  }}>
            Dashboard Overview  {filterMonth === "All" ? "-" : "- " + filterMonth} {filterYear === "All" ? "Life-to-Date" : filterYear}
          </Typography>
        </Box>
        
        {isAdmin() && (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }} className="no-print no-export">
          <Stack direction="row" spacing={2}>
            <Tooltip title="Excel">
              <IconButton
                onClick={exportToExcel} 
                sx={{ bgcolor: "#10b981", color: "white", borderRadius: 2, '&:hover': { bgcolor: "#059669" } }}
              >
                <TableChartIcon />
              </IconButton>
            </Tooltip>        
            <Tooltip title="PDF">
              <IconButton 
                onClick={handlePrint} 
                sx={{ bgcolor: "#ef4444", color: "white", borderRadius: 2, '&:hover': { bgcolor: "#dc2626" } }}
              >
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Screenshot">
              <IconButton 
                onClick={exportImage} 
                sx={{ bgcolor: "#3b82f6", color: "white", borderRadius: 2, '&:hover': { bgcolor: "#2563eb" } }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Tooltip>
            
            <Paper sx={{ p: 1, bgcolor: "#1e293b", display: 'flex', gap: 1.5, borderRadius: 2 }}>
              <TextField select size="small" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { color: "white" } }}>
                {MONTHS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <TextField select size="small" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { color: "white" } }}>
                {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
            </Paper>
          </Stack>
        </Box>
        )}

        <Paper sx={{ p: 3, bgcolor: "#0F172A", borderRadius: 3, border: "1px solid #1E293B", mb: 4, width: '100%' }}>
          <Typography variant="h6" sx={{ color: "#38bdf8", mb: 2, fontWeight: 'bold' }}>Collections</Typography>
          <CollectionTable 
            refreshKey={refreshKey} 
            token={token} 
            filterMonth={filterMonth === "All" ? "" : filterMonth} 
            filterYear={filterYear === "All" ? "" : filterYear} 
          />
        </Paper>

        <Paper sx={{ p: 3, bgcolor: "#0F172A", borderRadius: 3, border: "1px solid #1E293B", mb: 4, width: '100%' }}>
          <Typography variant="h6" sx={{ color: "#f87171", mb: 2, fontWeight: 'bold' }}>Expenses</Typography>
          <ExpenseTable 
            refreshKey={refreshKey} 
            token={token} 
            filterMonth={filterMonth === "All" ? "" : filterMonth} 
            filterYear={filterYear === "All" ? "" : filterYear} 
          />
        </Paper>

        {isAdmin() && (
          <MonthlyBalance refreshKey={refreshKey} month={filterMonth} year={filterYear} token={token} />
        )}

        <Box className="export-footer">
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            © {new Date().getFullYear()} Mahizh Connect - Generated on {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}

function MonthlyBalance({ refreshKey, month, year, token }) {
  const [data, setData] = useState({ collections: 0, expenses: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mParam = month === "All" ? "" : month;
        const yParam = year === "All" ? "" : year;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [colRes, expRes] = await Promise.all([
          axios.get(`/collections?month=${mParam}&year=${yParam}`, config),
          axios.get(`/expenses?month=${mParam}&year=${yParam}`, config)
        ]);
        setData({ 
            collections: colRes.data.reduce((s, i) => s + i.amount, 0), 
            expenses: expRes.data.reduce((s, i) => s + i.amount, 0) 
        });
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [refreshKey, month, year, token]);

  const balance = data.collections - data.expenses;

  return (
    <Paper sx={{ p: 4, bgcolor: "#1e293b", borderRadius: 3, border: "2px solid #334155", width: '100%' }}>
      <Stack spacing={3} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <AccountBalanceWalletIcon sx={{ color: "#6366f1", fontSize: 40 }} />
          <Typography variant="h5" sx={{ color: "#6366f1", fontWeight: 800 }}>Financial Performance Summary</Typography>
        </Stack>
        <Divider sx={{ width: '60%', bgcolor: "#334155" }} />
        <Grid container spacing={6} justifyContent="center">
          <Grid item>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: '1rem' }}>Total In</Typography>
            <Typography variant="h5" sx={{ color: "#4ade80", fontWeight: 700 }}>₹{data.collections.toLocaleString()}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: '1rem' }}>Total Out</Typography>
            <Typography variant="h5" sx={{ color: "#f87171", fontWeight: 700 }}>₹{data.expenses.toLocaleString()}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: '1rem' }}>Net Balance</Typography>
            <Typography variant="h4" sx={{ color: balance >= 0 ? "#22d3ee" : "#fb923c", fontWeight: 900 }}>
                ₹{balance.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}

export default Dashboard;