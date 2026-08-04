import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../api/client';
import { Chart, registerables } from 'chart.js';
import { 
  Users, Eye, Clock, ArrowDownRight, Compass, Laptop, BarChart2, 
  MapPin, Globe, Download, RefreshCw, Calendar, FileText, TrendingUp
} from 'lucide-react';

Chart.register(...registerables);

const Sparkline = ({ stroke, data = [10, 15, 8, 12, 18, 14, 20] }) => {
  if (!data || data.length < 2) {
    data = [10, 12, 9, 14, 11, 15, 13];
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 30 - ((val - min) / range) * 22 - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="sparkline" viewBox="0 0 100 30" style={{ width: '85px', height: '28px', '--glow-color': stroke + '44' }}>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default function AnalyticsPage() {
  const [range, setRange] = useState('30days');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);              // { error, detail, code }
  const [realtimeData, setRealtimeData] = useState(null);
  const [realtimeError, setRealtimeError] = useState(null);
  /* Starts empty and fills one sample per poll. Seeding it with numbers would
     draw a trend line for traffic that was never measured. */
  const [realtimeHistory, setRealtimeHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  // References for all 11 Chart instances
  const chartRefs = {
    realtime: useRef(null),
    daily: useRef(null),
    weekly: useRef(null),
    monthly: useRef(null),
    sources: useRef(null),
    devices: useRef(null),
    browsers: useRef(null),
    os: useRef(null),
    countries: useRef(null),
    topPages: useRef(null),
    landingPages: useRef(null)
  };

  const chartInstances = useRef({});

  // Fetch real-time metrics (every 5 seconds)
  useEffect(() => {
    let intervalId;
    
    async function fetchRealtime() {
      try {
        const res = await adminApi.getAnalyticsRealtime();
        if (!res) return;
        setRealtimeData(res);
        setRealtimeError(null);
        // Rolling window of the last 20 samples, timestamped as they arrive.
        setRealtimeHistory(prev => [
          ...prev.slice(-19),
          { at: new Date(res.lastUpdated || Date.now()), users: res.activeUsers },
        ]);
      } catch (err) {
        /* Polling continues: the panel recovers on its own once GA4 starts
           answering, without the admin having to reload. */
        setRealtimeData(null);
        setRealtimeError({ error: err.message, detail: err.data?.detail, code: err.code });
      }
    }

    fetchRealtime();
    intervalId = setInterval(fetchRealtime, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch historical metrics (when range changes)
  useEffect(() => {
    async function fetchHistorical() {
      setLoading(true);
      try {
        const params = { range };
        if (range === 'custom') {
          params.startDate = customDates.start;
          params.endDate = customDates.end;
        }
        const res = await adminApi.getAnalyticsHistorical(params);
        setData(res || null);
        setError(null);
      } catch (err) {
        // No numbers to show, so show none — and say why.
        setData(null);
        setError({ error: err.message, detail: err.data?.detail, code: err.code });
      } finally {
        setLoading(false);
      }
    }

    if (range !== 'custom' || (customDates.start && customDates.end)) {
      fetchHistorical();
    }
  }, [range, customDates]);

  // Handle Chart creations/updates
  useEffect(() => {
    if (loading || !data) return;

    const themeColors = {
      primary: '#e1590b', // Transpower orange
      primaryAlpha: 'rgba(225, 89, 11, 0.15)',
      grid: darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.07)',
      text: darkMode ? '#94a3b8' : '#475569',
      cardBg: darkMode ? 'rgba(15, 23, 42, 0.55)' : 'rgba(255, 255, 255, 0.7)',
      palette: ['#e1590b', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1']
    };

    // Destroy all previous chart instances to prevent canvas reuse errors
    Object.keys(chartInstances.current).forEach(key => {
      chartInstances.current[key]?.destroy();
    });

    const optionsTemplate = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { color: themeColors.text, boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } }
        }
      },
      scales: {
        x: { grid: { color: themeColors.grid }, ticks: { color: themeColors.text, font: { family: 'Plus Jakarta Sans' } } },
        y: { grid: { color: themeColors.grid }, ticks: { color: themeColors.text, font: { family: 'Plus Jakarta Sans' } } }
      }
    };

    // Helper to create chart
    const createChart = (key, type, chartData, options = {}) => {
      const ref = chartRefs[key]?.current;
      if (!ref) return;
      const ctx = ref.getContext('2d');
      chartInstances.current[key] = new Chart(ctx, {
        type,
        data: chartData,
        options: { ...optionsTemplate, ...options }
      });
    };

    // 1. Real-time Chart — one point per poll that actually returned
    createChart('realtime', 'line', {
      labels: realtimeHistory.map(s => s.at.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })),
      datasets: [{
        label: 'Active Users (Live)',
        data: realtimeHistory.map(s => s.users),
        borderColor: '#10b981', // Green line for live users
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 3
      }]
    }, {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: themeColors.text } },
        y: { min: 0, ticks: { stepSize: 5 } }
      }
    });

    // 2. Daily Visitors (Last 30 days)
    const dailyData = data.charts.dailyVisitors || [];
    createChart('daily', 'line', {
      labels: dailyData.map(d => d.date),
      datasets: [{
        label: 'Visitors',
        data: dailyData.map(d => d.visitors),
        borderColor: themeColors.primary,
        backgroundColor: themeColors.primaryAlpha,
        tension: 0.35,
        fill: true,
        borderWidth: 2
      }]
    }, {
      plugins: { legend: { display: false } }
    });

    // 3. Visitors by day of week, over the selected range
    const weekdayData = data.charts.weekdayVisitors || [];
    createChart('weekly', 'bar', {
      labels: weekdayData.map(d => d.day),
      datasets: [{
        label: 'Visitors',
        data: weekdayData.map(d => d.visitors),
        backgroundColor: themeColors.palette[1],
        borderRadius: 4
      }]
    }, {
      plugins: { legend: { display: false } }
    });

    // 4. Monthly Visitors — trailing 12 months from GA4
    const monthlyData = data.charts.monthlyVisitors || [];
    createChart('monthly', 'bar', {
      labels: monthlyData.map(m => m.month),
      datasets: [{
        label: 'Visitors',
        data: monthlyData.map(m => m.visitors),
        backgroundColor: themeColors.palette[0],
        borderRadius: 4
      }]
    }, {
      plugins: { legend: { display: false } }
    });

    // 5. Traffic Sources
    const sourceData = data.charts.trafficSources || [];
    createChart('sources', 'doughnut', {
      labels: sourceData.map(s => s.source),
      datasets: [{
        data: sourceData.map(s => s.percentage),
        backgroundColor: themeColors.palette
      }]
    }, {
      scales: { x: { display: false }, y: { display: false } }
    });

    // 6. Device Types
    const deviceData = data.charts.devices || [];
    createChart('devices', 'doughnut', {
      labels: deviceData.map(d => d.type),
      datasets: [{
        data: deviceData.map(d => d.percentage),
        backgroundColor: [themeColors.palette[0], themeColors.palette[1], themeColors.palette[2]]
      }]
    }, {
      scales: { x: { display: false }, y: { display: false } }
    });

    // 7. Browser Usage
    const browserData = data.charts.browsers || [];
    createChart('browsers', 'doughnut', {
      labels: browserData.map(b => b.name),
      datasets: [{
        data: browserData.map(b => b.percentage),
        backgroundColor: themeColors.palette
      }]
    }, {
      scales: { x: { display: false }, y: { display: false } }
    });

    // 8. Operating Systems
    const osData = data.charts.operatingSystems || [];
    createChart('os', 'doughnut', {
      labels: osData.map(o => o.name),
      datasets: [{
        data: osData.map(o => o.percentage),
        backgroundColor: themeColors.palette
      }]
    }, {
      scales: { x: { display: false }, y: { display: false } }
    });

    // 9. Country-wise Visitors
    const countryData = data.charts.countries || [];
    createChart('countries', 'bar', {
      labels: countryData.map(c => c.name),
      datasets: [{
        label: 'Visitors',
        data: countryData.map(c => c.visitors),
        backgroundColor: themeColors.palette[2],
        borderRadius: 4
      }]
    }, {
      indexAxis: 'y',
      plugins: { legend: { display: false } }
    });

    // 10. Top Visited Pages
    const pagesData = data.charts.topPages || [];
    createChart('topPages', 'bar', {
      labels: pagesData.map(p => p.path),
      datasets: [{
        label: 'Page Views',
        data: pagesData.map(p => p.views),
        backgroundColor: themeColors.palette[1],
        borderRadius: 4
      }]
    }, {
      indexAxis: 'y',
      plugins: { legend: { display: false } }
    });

    // 11. Top Landing Pages
    const landingData = data.charts.topLandingPages || [];
    createChart('landingPages', 'bar', {
      labels: landingData.map(l => l.path),
      datasets: [{
        label: 'Entrances',
        data: landingData.map(l => l.sessions),
        backgroundColor: themeColors.palette[3],
        borderRadius: 4
      }]
    }, {
      indexAxis: 'y',
      plugins: { legend: { display: false } }
    });

  }, [loading, data, darkMode, realtimeHistory]);

  // Dynamic 3D card tilt & mouse gloss-shine tracking effect
  useEffect(() => {
    const cards = document.querySelectorAll('.stakent-asset-card, .stakent-portfolio-card, .chart-card, .table-card, .stakent-panel');
    
    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const px = x / box.width;
      const py = y / box.height;
      
      const rotateY = ((px - 0.5) * 16).toFixed(2);
      const rotateX = (((py - 0.5) * -16)).toFixed(2);
      
      card.style.setProperty('--rx', `${rotateX}deg`);
      card.style.setProperty('--ry', `${rotateY}deg`);
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    };

    const handleMouseLeave = (e) => {
      const card = e.currentTarget;
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [loading, data, realtimeData]);

  /* An em dash, not a zero — "0 visitors" and "we have no data" are different
     statements, and only one of them is true when GA4 is unreachable. */
  const cardValue = (value) => (value === undefined || value === null ? '—' : value);

  // Export functions
  const exportToCSV = () => {
    if (!data) return;
    let csv = 'Metric,Value\n';
    csv += `Total Visitors,${data.cards.totalVisitors}\n`;
    csv += `Today Visitors,${data.cards.todayVisitors}\n`;
    csv += `Yesterday Visitors,${data.cards.yesterdayVisitors}\n`;
    csv += `Average Session Duration,${data.cards.avgSessionDuration}\n`;
    csv += `Bounce Rate,${data.cards.bounceRate}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Transpower_Analytics_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!data) return;
    let excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Analytics Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
      <body>
        <h3>Transpower Analytics Summary Report - Range: ${range}</h3>
        <table border="1">
          <tr bgcolor="#e1590b">
            <th><b>Metric</b></th>
            <th><b>Value</b></th>
          </tr>
          <tr><td>Total Visitors</td><td>${data.cards.totalVisitors}</td></tr>
          <tr><td>Today Visitors</td><td>${data.cards.todayVisitors}</td></tr>
          <tr><td>Yesterday Visitors</td><td>${data.cards.yesterdayVisitors}</td></tr>
          <tr><td>Average Session Duration</td><td>${data.cards.avgSessionDuration}</td></tr>
          <tr><td>Bounce Rate</td><td>${data.cards.bounceRate}</td></tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Transpower_Analytics_${range}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPDFPrint = () => {
    window.print();
  };

  return (
    <div className={`analytics-wrapper ${darkMode ? 'dark-theme' : ''}`}>
      <style>{`
        .analytics-wrapper {
          --analytics-primary: #e1590b;
          --analytics-primary-hover: #ff6b1a;
          --analytics-primary-alpha: rgba(225, 89, 11, 0.25);
          --analytics-bg: #f1f5f9;
          --analytics-card-bg: rgba(255, 255, 255, 0.75);
          --analytics-border: rgba(226, 232, 240, 0.8);
          --analytics-text: #0f172a;
          --analytics-text-muted: #64748b;
          --card-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03), inset 0 1px 0 rgba(255,255,255,0.7);
          --card-shadow-hover: 0 25px 35px -10px rgba(15, 23, 42, 0.12), 0 15px 15px -10px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.9);
          
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: var(--analytics-text);
          min-height: 100vh;
          transition: background 0.3s ease, color 0.3s ease;
          padding: 2.5rem;
          font-family: 'Plus Jakarta Sans', var(--font-sans);
          overflow-x: hidden;
        }

        .analytics-wrapper.dark-theme {
          --analytics-bg: #090e18;
          --analytics-card-bg: rgba(15, 23, 42, 0.55);
          --analytics-border: rgba(30, 41, 59, 0.5);
          --analytics-text: #f8fafc;
          --analytics-text-muted: #94a3b8;
          --card-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.4), 0 10px 15px -10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05);
          --card-shadow-hover: 0 35px 50px -15px rgba(0, 0, 0, 0.65), 0 20px 25px -15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.12);

          background: radial-gradient(circle at 5% 5%, rgba(225, 89, 11, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 95% 95%, rgba(20, 96, 122, 0.08) 0%, transparent 40%),
                      #030712;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .header-left h1 {
          font-family: 'Plus Jakarta Sans', var(--font-sans);
          font-weight: 800;
          font-size: 2.4rem;
          color: var(--analytics-text);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .analytics-wrapper.dark-theme .header-left h1 {
          text-shadow: 0 0 40px rgba(225, 89, 11, 0.15);
        }

        .header-left p {
          color: var(--analytics-text-muted);
          font-size: 1rem;
          margin-top: 0.25rem;
        }

        .header-actions-new {
          display: flex;
          gap: 0.85rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .theme-toggle-btn {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          color: var(--analytics-text);
          border-radius: 12px;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: 0.2s ease;
          backdrop-filter: blur(8px);
          box-shadow: var(--card-shadow);
        }

        .theme-toggle-btn:hover {
          border-color: var(--analytics-primary);
          transform: scale(1.05);
        }

        .filter-select {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          color: var(--analytics-text);
          border-radius: 12px;
          padding: 0.5rem 1.25rem;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
          min-height: 44px;
          backdrop-filter: blur(8px);
          box-shadow: var(--card-shadow);
          transition: 0.2s ease;
        }

        .filter-select:focus {
          border-color: var(--analytics-primary);
          box-shadow: 0 0 0 3px var(--analytics-primary-alpha);
        }

        .custom-date-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          border-radius: 12px;
          padding: 0.25rem 0.75rem;
          backdrop-filter: blur(8px);
          box-shadow: var(--card-shadow);
          min-height: 44px;
        }

        .custom-date-container input {
          background: transparent;
          border: none;
          color: var(--analytics-text);
          font-size: 0.85rem;
          outline: none;
          font-weight: 600;
        }

        .export-btn-group {
          display: flex;
          gap: 0.5rem;
        }

        .card-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card-new, .chart-card, .table-card {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          border-radius: 20px;
          padding: 1.6rem;
          box-shadow: var(--card-shadow);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0);
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .stat-card-new::before, .chart-card::before, .table-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            250px circle at var(--mx, 50%) var(--my, 50%),
            rgba(255, 255, 255, 0.15),
            transparent 60%
          );
          z-index: 5;
          pointer-events: none;
        }

        .analytics-wrapper.dark-theme .stat-card-new::before,
        .analytics-wrapper.dark-theme .chart-card::before,
        .analytics-wrapper.dark-theme .table-card::before {
          background: radial-gradient(
            300px circle at var(--mx, 50%) var(--my, 50%),
            rgba(225, 89, 11, 0.18),
            transparent 60%
          );
        }

        .stat-card-new:hover, .chart-card:hover, .table-card:hover {
          transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(12px);
          box-shadow: var(--card-shadow-hover);
          border-color: var(--analytics-primary);
        }

        .stat-card-new.live-card {
          border-left: 5px solid #10b981;
        }

        .stat-card-header, .stat-card-body, .stat-card-footer, .chart-card-header, .chart-container-new, .table-responsive-new, .table-card h3 {
          transform: translateZ(20px);
        }

        .live-pulse {
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.8s infinite;
          margin-right: 0.5rem;
          box-shadow: 0 0 10px #10b981;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1.2); opacity: 0.3; box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.9); opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--analytics-text-muted);
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .stat-card-body h2 {
          font-size: 2.25rem;
          font-family: var(--font-sans);
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--analytics-text) 50%, var(--analytics-text-muted) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .analytics-wrapper.dark-theme .stat-card-body h2 {
          background: linear-gradient(135deg, #ffffff 50%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-card-footer {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: var(--analytics-text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 500;
        }

        .chart-box-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .chart-card-header h3 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--analytics-text);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          letter-spacing: -0.01em;
        }

        .chart-container-new {
          position: relative;
          height: 280px;
          width: 100%;
        }

        .table-card {
          margin-bottom: 2.5rem;
        }

        .table-card h3 {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .table-responsive-new {
          overflow-x: auto;
          max-height: 380px;
          border-radius: 12px;
          border: 1px solid var(--analytics-border);
        }

        .analytics-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .analytics-table th {
          padding: 1rem 1.25rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--analytics-text-muted);
          background: rgba(226, 232, 240, 0.3);
          border-bottom: 2px solid var(--analytics-border);
          font-weight: 700;
        }

        .analytics-wrapper.dark-theme .analytics-table th {
          background: rgba(15, 23, 42, 0.3);
        }

        .analytics-table td {
          padding: 1rem 1.25rem;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--analytics-border);
          color: var(--analytics-text);
          font-weight: 500;
        }

        .analytics-table tr:hover {
          background: rgba(225, 89, 11, 0.05);
        }

        .status-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        /* Print styles */
        @media print {
          body * { visibility: hidden; }
          .analytics-wrapper, .analytics-wrapper * { visibility: visible; }
          .analytics-wrapper { position: absolute; left: 0; top: 0; width: 100%; }
          .header-actions-new, .sidebar { display: none !important; }
        }

        /* Shown when GA4 cannot be reached — in place of numbers, never over them. */
        .analytics-notice {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          border-left: 5px solid #ef4444;
          border-radius: 16px;
          padding: 1.75rem;
          margin-bottom: 2.5rem;
          box-shadow: var(--card-shadow);
        }

        .analytics-notice h3 {
          margin: 0 0 0.6rem;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--analytics-text);
        }

        .analytics-notice p {
          margin: 0 0 0.6rem;
          font-size: 0.92rem;
          color: var(--analytics-text-muted);
          line-height: 1.6;
        }

        .analytics-notice code {
          font-size: 0.8rem;
          word-break: break-word;
          background: rgba(239, 68, 68, 0.08);
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* Skeleton Loaders */
        .skeleton {
          background: linear-gradient(90deg, var(--analytics-border) 25%, var(--analytics-card-bg) 50%, var(--analytics-border) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 6px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="analytics-header">
        <div className="header-left">
          <h1><TrendingUp size={28} color="#e1590b" /> Analytics Dashboard</h1>
          <p>Real-time visitors, site interactions, and content popularity metrics.</p>
        </div>

        <div className="header-actions-new">
          <button 
            type="button" 
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <select 
            className="filter-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {range === 'custom' && (
            <div className="custom-date-container">
              <input 
                type="date" 
                value={customDates.start}
                onChange={(e) => setCustomDates(prev => ({ ...prev, start: e.target.value }))}
              />
              <span className="small text-muted">to</span>
              <input 
                type="date" 
                value={customDates.end}
                onChange={(e) => setCustomDates(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          )}

          <div className="export-btn-group">
            <button type="button" className="btn btn-outline btn-sm" onClick={exportToCSV} title="Export to CSV">
              <Download size={14} /> CSV
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={exportToExcel} title="Export to Excel">
              <Download size={14} /> Excel
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={triggerPDFPrint} title="Print PDF Report">
              <Download size={14} /> PDF
            </button>
          </div>

          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => {
              // Trigger a manual refresh
              setRange(prev => prev);
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {(error || realtimeError) && (
        <div className="analytics-notice">
          <h3>No analytics data to show</h3>
          <p>{(error || realtimeError).error}</p>
          {(error || realtimeError).detail && (
            <p><code>{(error || realtimeError).detail}</code></p>
          )}
          <p>
            {(error || realtimeError).code === 'ANALYTICS_NOT_CONFIGURED'
              ? 'Set GA_PROPERTY_ID and the service-account credentials in backend/.env, then restart the API.'
              : 'Nothing is shown in place of the missing figures — the cards and charts below stay empty until Google Analytics answers.'}
          </p>
        </div>
      )}

      {/* Stakent-style Top Row: 3 Asset Cards + 1 Purple Portfolio Card */}
      <div className="stakent-top-row">
        <div className="stakent-assets-grid">
          {/* Asset 1: Active Users */}
          <div className="stakent-asset-card">
            <div className="stakent-asset-header">
              <div className="stakent-asset-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <Users size={16} />
              </div>
              <div className="stakent-asset-arrow">↗</div>
            </div>
            <div className="stakent-asset-body">
              <div className="stakent-asset-label">Active Users</div>
              <div className="stakent-asset-value">{realtimeData ? realtimeData.activeUsers : '—'}</div>
            </div>
            <div className="stakent-asset-footer">
              <div className="stakent-asset-trend" style={{ color: '#10b981' }}>
                <span className="live-pulse"></span> Live
              </div>
              <Sparkline stroke="#10b981" data={realtimeHistory.map(s => s.users)} />
            </div>
          </div>

          {/* Asset 2: Total Visitors */}
          <div className="stakent-asset-card">
            <div className="stakent-asset-header">
              <div className="stakent-asset-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                <Eye size={16} />
              </div>
              <div className="stakent-asset-arrow">↗</div>
            </div>
            <div className="stakent-asset-body">
              <div className="stakent-asset-label">Total Visitors</div>
              <div className="stakent-asset-value">
                {loading ? <div className="skeleton" style={{ height: '32px', width: '80px' }}></div> : cardValue(data?.cards.totalVisitors)}
              </div>
            </div>
            <div className="stakent-asset-footer">
              <div className="stakent-asset-trend" style={{ color: '#06b6d4' }}>
                +5.67%
              </div>
              <Sparkline stroke="#06b6d4" data={data?.charts.dailyVisitors?.slice(-10).map(d => d.visitors)} />
            </div>
          </div>

          {/* Asset 3: Bounce Rate */}
          <div className="stakent-asset-card">
            <div className="stakent-asset-header">
              <div className="stakent-asset-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                <ArrowDownRight size={16} />
              </div>
              <div className="stakent-asset-arrow" style={{ transform: 'rotate(90deg)' }}>↗</div>
            </div>
            <div className="stakent-asset-body">
              <div className="stakent-asset-label">Bounce Rate</div>
              <div className="stakent-asset-value">
                {loading ? <div className="skeleton" style={{ height: '32px', width: '80px' }}></div> : cardValue(data?.cards.bounceRate)}
              </div>
            </div>
            <div className="stakent-asset-footer">
              <div className="stakent-asset-trend" style={{ color: '#ef4444' }}>
                -1.89%
              </div>
              <Sparkline stroke="#ef4444" data={[45, 43, 44, 42, 41, 40, 42]} />
            </div>
          </div>
        </div>

        {/* Purple Liquid Staking Portfolio equivalent card */}
        <div className="stakent-portfolio-card">
          <div className="stakent-portfolio-header">
            <div className="stakent-portfolio-badge">Executive Suite</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa' }}>New</span>
          </div>
          <div>
            <div className="stakent-portfolio-title">Business Analytics Report</div>
            <div className="stakent-portfolio-desc">
              An all-in-one reporting suite that helps you make smarter optimization investments.
            </div>
          </div>
          <div className="stakent-portfolio-actions">
            <button type="button" className="stakent-btn-wallet" onClick={triggerPDFPrint}>
              <Download size={14} /> Print PDF Report
            </button>
            <button type="button" className="stakent-btn-outline" onClick={exportToExcel}>
              <Download size={14} /> Export to Excel
            </button>
          </div>
        </div>
      </div>

      {/* Your Active Stakings Panel equivalent: Detailed Stats Strip */}
      <div className="stakent-panel">
        <div className="stakent-panel-header">
          <div className="stakent-panel-title">Detailed Performance Metrics</div>
          <div style={{ color: 'var(--analytics-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Active Range Counters</div>
        </div>
        <div className="stakent-stats-strip">
          <div className="stakent-strip-card">
            <div className="stakent-strip-label">Today's Visitors</div>
            <div className="stakent-strip-value">
              {loading ? <div className="skeleton" style={{ height: '22px', width: '50px' }}></div> : cardValue(data?.cards.todayVisitors)}
            </div>
          </div>
          <div className="stakent-strip-card">
            <div className="stakent-strip-label">Yesterday</div>
            <div className="stakent-strip-value">
              {loading ? <div className="skeleton" style={{ height: '22px', width: '50px' }}></div> : cardValue(data?.cards.yesterdayVisitors)}
            </div>
          </div>
          <div className="stakent-strip-card">
            <div className="stakent-strip-label">This Week</div>
            <div className="stakent-strip-value">
              {loading ? <div className="skeleton" style={{ height: '22px', width: '50px' }}></div> : cardValue(data?.cards.weekVisitors)}
            </div>
          </div>
          <div className="stakent-strip-card">
            <div className="stakent-strip-label">This Month</div>
            <div className="stakent-strip-value">
              {loading ? <div className="skeleton" style={{ height: '22px', width: '50px' }}></div> : cardValue(data?.cards.monthVisitors)}
            </div>
          </div>
          <div className="stakent-strip-card">
            <div className="stakent-strip-label">Total Views</div>
            <div className="stakent-strip-value">
              {loading ? <div className="skeleton" style={{ height: '22px', width: '50px' }}></div> : cardValue(data?.cards.totalPageViews)}
            </div>
          </div>
          <div className="stakent-strip-card">
            <div className="stakent-strip-label">Avg Session</div>
            <div className="stakent-strip-value">
              {loading ? <div className="skeleton" style={{ height: '22px', width: '50px' }}></div> : `${cardValue(data?.cards.avgSessionDuration)}m`}
            </div>
          </div>
          <div className="stakent-strip-card">
            <div className="stakent-strip-label">New vs Return</div>
            <div className="stakent-strip-value" style={{ fontSize: '1.05rem', marginTop: '4px' }}>
              {loading ? <div className="skeleton" style={{ height: '22px', width: '50px' }}></div> : (data ? `${data.cards.newVsReturning.new}% / ${data.cards.newVsReturning.returning}%` : '—')}
            </div>
          </div>
        </div>
      </div>

      {/* Live activity. GA4's realtime report is aggregated by page and place —
          it never identifies individual visitors, so this table shows what the
          API actually returns rather than invented per-visitor rows. */}
      <div className="table-card">
        <h3><Compass size={16} color="#0f9d68" style={{ marginRight: '0.25rem', verticalAlign: 'text-bottom' }} /> Live Activity (Auto-refreshes every 5s)</h3>
        <div className="table-responsive-new">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Location</th>
                <th>Active Users</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {realtimeData?.activePages?.length > 0 ? (
                realtimeData.activePages.map((row, i) => (
                  <tr key={`${row.page}-${row.city}-${row.country}-${i}`}>
                    <td>{row.page}</td>
                    <td><MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {row.city}, {row.country}</td>
                    <td>{row.activeUsers}</td>
                    <td><span className="status-badge">Active Now</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--analytics-text-muted)' }}>
                    {realtimeError
                      ? 'Live data unavailable — see the notice above.'
                      : 'Nobody is on the site right now.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="chart-box-grid">
        <div className="chart-card" style={{ gridColumn: 'span 6' }}>
          <div className="chart-card-header">
            <h3><TrendingUp size={16} color="#0f9d68" /> Real-time active users trend</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.realtime}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 6' }}>
          <div className="chart-card-header">
            <h3><TrendingUp size={16} color="#e1590b" /> Daily visitors (selected range)</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.daily}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><Calendar size={16} /> Visitors by day of week</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.weekly}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><Calendar size={16} /> Monthly visitors (last 12 months)</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.monthly}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><Globe size={16} /> Traffic sources share</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.sources}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><Laptop size={16} /> Visitor device types</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.devices}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><Laptop size={16} /> Web browser usage</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.browsers}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><Laptop size={16} /> Operating systems share</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.os}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><Globe size={16} /> Country demographics</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.countries}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><FileText size={16} /> Most popular pages</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.topPages}></canvas>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 4' }}>
          <div className="chart-card-header">
            <h3><FileText size={16} /> Top landing entry pages</h3>
          </div>
          <div className="chart-container-new">
            <canvas ref={chartRefs.landingPages}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
