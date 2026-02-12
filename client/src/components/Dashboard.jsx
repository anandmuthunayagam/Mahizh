import React, { useState, useEffect, useRef } from "react";
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
  Button
} from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useReactToPrint } from "react-to-print";
import { toPng } from 'html-to-image'; 
import Summary from "./Summary";
import CollectionTable from "./CollectionTable";
import ExpenseTable from "./ExpenseTable";
import axios from "../utils/api/axios";
import mahizh from '../assets/MahizhLogo.png';

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

const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const contentRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false); 
  
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [filterMonth, setFilterMonth] = useState(lastMonthDate.toLocaleString('default', { month: 'long' }));
  const [filterYear, setFilterYear] = useState(lastMonthDate.getFullYear());

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Mahizh_Connect_${filterMonth}_${filterYear}`,
  });

  const exportImage = async () => {
    if (contentRef.current === null) return;
    
    setIsExporting(true);

    try {
      // Small delay to ensure React state update renders the header before capture
      setTimeout(async () => {
        const dataUrl = await toPng(contentRef.current, { 
          cacheBust: true,
          backgroundColor: "#020617",
          filter: (node) => {
            // Exclude elements with 'no-export' (buttons/filters) but keep the title
            if (node.classList && node.classList.contains('no-export')) return false;
            return true;
          },
          style: { padding: '20px' }
        });
        
        const link = document.createElement('a');
        link.download = `Mahizh_Connect_${filterMonth}_${filterYear}.png`;
        link.href = dataUrl;
        link.click();
        
        setIsExporting(false);
      }, 150);
    } catch (err) {
      console.error('Image export failed', err);
      setIsExporting(false);
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box 
        ref={contentRef} 
        sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#020617", minHeight: "100vh" }}
      >
        <style>
          {`
            @media print {
              @page { size: A4 portrait; margin: 0; }
              body { margin: 15mm; background-color: #f0f9ff !important; zoom: 80%; }
              .no-print { display: none !important; }
              .MuiBox-root, .MuiPaper-root { background-color: transparent !important; color: black !important; box-shadow: none !important; }
              .print-header { display: flex !important; justify-content: space-between; align-items: center; margin-bottom: 50px; padding-top: 20px; padding-bottom: 40px; border-bottom: 3px solid #0f172a; }
              .print-footer { display: block !important; position: fixed; bottom: 0; width: 100%; text-align: left; font-size: 11px; color: #475569; border-top: 1px solid #cbd5e1; padding-top: 10px; }
              table { width: 100% !important; border-collapse: collapse !important; border: 1px solid #cbd5e1 !important; }
              .MuiTableCell-head { background-color: #91bbe4 !important; color: black !important; font-weight: bold !important; border: 2px solid #cbd5e1 !important; }
              .MuiTableCell-root { color: black !important; border: 1px solid #e2e8f0 !important; padding: 10px !important; }
              .text-green { color: #15803d !important; font-weight: bold !important; }
              .text-red { color: #b91c1c !important; font-weight: bold !important; }
              .text-blue { color: #0369a1 !important; font-weight: bold !important; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
            
            /* Show print-only elements on web screen only during image export */
            .print-header, .print-footer { display: ${isExporting ? 'flex' : 'none'}; }
          `}
        </style>

        {/* --- PDF & IMAGE HEADER --- */}
        <Box className="print-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
              {/* Logo on the left */}
              <Box sx={{ height: 120, width: 120, borderRadius: "50%", overflow: 'hidden', border: '2px solid #38bdf8' }}>
                <img src={mahizh} alt="Logo" style={{ width: '100%', height: '100%' }} />
              </Box>

              {/* Mahizh Connect pushed to the right */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                gap: 1, 
                marginLeft: 'auto' // This is the key change
              }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: isExporting ? 'white' : 'black' }}>
                  Mahizh
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: isExporting ? 'rgb(56, 189, 248)' : 'black' }}>
                  Connect
                </Typography>
              </Box>
        </Box>
          <Box sx={{ textAlign: 'right' }}>
            {/*}
            <Typography variant="h5" sx={{ fontWeight: 700, color: isExporting ? 'white' : 'black' }}>
              {filterMonth} {filterYear}
            </Typography>
            
            <Typography variant="caption" sx={{ color: isExporting ? '#94a3b8' : '#64748b' }}>
              Report Generated: {new Date().toLocaleDateString()}
            </Typography>
            */}
          </Box>
        </Box>

        {/* SCREEN TITLE (OUTSIDE no-export to make it visible in Image) */}
        <Box sx={{ mb: 3,mt:3 }}>
          <Typography variant="h5" sx={{ color: isExporting ? '#94a3b8' : '#64748b', fontWeight: 700 }}>
            Dashboard Overview - {filterMonth} {filterYear}
          </Typography>
        </Box>
        
        {/* SCREEN CONTROLS (ONLY THESE WILL BE HIDDEN IN IMAGE) */}
        {isAdmin() && (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }} className="no-print no-export">
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={handlePrint} sx={{ bgcolor: "#ef4444",minWidth: 0, // Reduces extra horizontal padding
                '& .MuiButton-startIcon': { 
                  margin: 0 // Removes the right margin intended for text
                } }}></Button>
            <Button variant="contained" startIcon={<PhotoCameraIcon />} onClick={exportImage} sx={{ bgcolor: "#3b82f6",minWidth: 0, // Reduces extra horizontal padding
                '& .MuiButton-startIcon': { 
                  margin: 0 // Removes the right margin intended for text
                } }}></Button>

            <Paper sx={{ p: 1.5, bgcolor: "#1e293b", display: 'flex', gap: 2, borderRadius: 2 }}>
              <TextField select size="small" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} sx={{ width: 140, bgcolor: "#0f172a", "& .MuiOutlinedInput-root": { color: "white" } }}>
                {MONTHS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <TextField select size="small" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} sx={{ width: 100, bgcolor: "#0f172a", "& .MuiOutlinedInput-root": { color: "white" } }}>
                {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
            </Paper>
          </Stack>
        </Box>
        )}

        {/* DATA CARDS */}
        <Paper  sx={{ p: 3, bgcolor: "#0F172A", borderRadius: 3, border: "1px solid #1E293B", mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#38bdf8", mb: 2,fontWeight: 'bold' }}>Maintenance Collections</Typography>
          <CollectionTable refreshKey={refreshKey} filterMonth={filterMonth} filterYear={filterYear} />
        </Paper>

        <Paper sx={{ p: 3, bgcolor: "#0F172A", borderRadius: 3, border: "1px solid #1E293B", mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#f87171", mb: 2,fontWeight: 'bold' }}>Monthly Expenses</Typography>
          <ExpenseTable refreshKey={refreshKey} filterMonth={filterMonth} filterYear={filterYear} />
        </Paper>
        { isAdmin() && 
        <MonthlyBalance refreshKey={refreshKey} month={filterMonth} year={filterYear} />
        }
        {/* --- FOOTER --- */}
        <Box className="print-footer" sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: isExporting ? '#94a3b8' : '#475569' }}>
            © {new Date().getFullYear()} Mahizh Connect System
          </Typography>
        </Box>
        
      </Box>
    </Fade>
  );
}

// MonthlyBalance Sub-component
function MonthlyBalance({ refreshKey, month, year }) {
  const [data, setData] = useState({ collections: 0, expenses: 0 });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colRes, expRes] = await Promise.all([
          axios.get(`/collections?month=${month}&year=${year}`),
          axios.get(`/expenses?month=${month}&year=${year}`)
        ]);
        setData({ 
            collections: colRes.data.reduce((s, i) => s + i.amount, 0), 
            expenses: expRes.data.reduce((s, i) => s + i.amount, 0) 
        });
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [refreshKey, month, year]);

  const balance = data.collections - data.expenses;

  return (
    <Paper sx={{ p: 4, bgcolor: "#1e293b", borderRadius: 3, border: "2px solid #334155" }}>
      <Stack spacing={3} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <AccountBalanceWalletIcon sx={{ color: "#6366f1", fontSize: 40 }} />
          <Typography variant="h5" sx={{ color: "#6366f1", fontWeight: 800 }}>Financial Performance Summary</Typography>
        </Stack>
        <Divider sx={{ width: '60%', bgcolor: "#334155" }} />
        <Grid container spacing={6} justifyContent="center">
          <Grid item>
            <Typography variant="caption" sx={{ color: "#94a3b8",fontSize: '1rem' }}>Total In</Typography>
            <Typography variant="h5" sx={{ color: "#4ade80", fontWeight: 700 }}>₹{data.collections.toLocaleString()}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" sx={{ color: "#94a3b8",fontSize: '1rem' }}>Total Out</Typography>
            <Typography variant="h5" sx={{ color: "#f87171", fontWeight: 700 }}>₹{data.expenses.toLocaleString()}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" sx={{ color: "#94a3b8",fontSize: '1rem'   }}>Net Balance</Typography>
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