import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../api/client';
import { Chart, registerables } from 'chart.js';
import { 
  Users, Eye, Clock, ArrowDownRight, Compass, Laptop, BarChart2, 
  MapPin, Globe, Download, RefreshCw, Calendar, FileText, TrendingUp
} from 'lucide-react';

Chart.register(...registerables);

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
  const [darkMode, setDarkMode] = useState(false);

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
      primaryAlpha: 'rgba(225, 89, 11, 0.2)',
      grid: darkMode ? '#2d3d52' : '#e2e8f0',
      text: darkMode ? '#cbd5e1' : '#475569',
      cardBg: darkMode ? '#111e2f' : '#ffffff',
      palette: ['#e1590b', '#14607a', '#0f9d68', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b']
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
        borderColor: '#0f9d68', // Green line for live users
        backgroundColor: 'rgba(15, 157, 104, 0.15)',
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
          --analytics-primary-hover: #f97316;
          --analytics-bg: #f8fafc;
          --analytics-card-bg: #ffffff;
          --analytics-border: #e2e8f0;
          --analytics-text: #0f172a;
          --analytics-text-muted: #64748b;
          
          background: var(--analytics-bg);
          color: var(--analytics-text);
          min-height: 100vh;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .analytics-wrapper.dark-theme {
          --analytics-bg: #09131f;
          --analytics-card-bg: #111e2f;
          --analytics-border: #1e2d3d;
          --analytics-text: #f8fafc;
          --analytics-text-muted: #94a3b8;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left h1 {
          font-family: 'Plus Jakarta Sans', var(--font-sans);
          font-weight: 800;
          font-size: 2.2rem;
          color: var(--analytics-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-left p {
          color: var(--analytics-text-muted);
          font-size: 0.95rem;
        }

        .header-actions-new {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .theme-toggle-btn {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          color: var(--analytics-text);
          border-radius: 8px;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .theme-toggle-btn:hover {
          border-color: var(--analytics-primary);
          color: var(--analytics-primary);
        }

        .filter-select {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          color: var(--analytics-text);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
          min-height: 42px;
        }

        .filter-select:focus {
          border-color: var(--analytics-primary);
        }

        .custom-date-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          border-radius: 8px;
          padding: 0.25rem 0.5rem;
        }

        .custom-date-container input {
          background: transparent;
          border: none;
          color: var(--analytics-text);
          font-size: 0.8rem;
          outline: none;
        }

        .export-btn-group {
          display: flex;
          gap: 0.5rem;
        }

        .card-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-card-new {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card-new:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: var(--analytics-primary);
        }

        .stat-card-new.live-card {
          border-left: 4px solid #0f9d68;
        }

        .live-pulse {
          width: 8px;
          height: 8px;
          background: #0f9d68;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.5s infinite;
          margin-right: 0.5rem;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 1; box-shadow: 0 0 0 0 rgba(15, 157, 104, 0.7); }
          70% { transform: scale(1.1); opacity: 0.5; box-shadow: 0 0 0 8px rgba(15, 157, 104, 0); }
          100% { transform: scale(0.9); opacity: 1; box-shadow: 0 0 0 0 rgba(15, 157, 104, 0); }
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--analytics-text-muted);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .stat-card-body h2 {
          font-size: 2rem;
          font-family: var(--font-sans);
          font-weight: 800;
          margin: 0;
        }

        .stat-card-footer {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: var(--analytics-text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .chart-box-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .chart-card-header h3 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--analytics-text);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chart-container-new {
          position: relative;
          height: 260px;
          width: 100%;
        }

        .table-card {
          background: var(--analytics-card-bg);
          border: 1.5px solid var(--analytics-border);
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .table-card h3 {
          font-size: 0.95rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .table-responsive-new {
          overflow-x: auto;
          max-height: 350px;
        }

        .analytics-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .analytics-table th {
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--analytics-text-muted);
          border-bottom: 1.5px solid var(--analytics-border);
        }

        .analytics-table td {
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          border-bottom: 1px solid var(--analytics-border);
        }

        .analytics-table tr:hover {
          background: rgba(225, 89, 11, 0.03);
        }

        .status-badge {
          background: rgba(15, 157, 104, 0.15);
          color: #0f9d68;
          padding: 2px 8px;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
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
          border-left: 4px solid #d0342c;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .analytics-notice h3 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          font-weight: 800;
          color: var(--analytics-text);
        }

        .analytics-notice p {
          margin: 0 0 0.5rem;
          font-size: 0.88rem;
          color: var(--analytics-text-muted);
          line-height: 1.6;
        }

        .analytics-notice code {
          font-size: 0.78rem;
          word-break: break-word;
          background: rgba(208, 52, 44, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Skeleton Loaders */
        .skeleton {
          background: linear-gradient(90deg, var(--analytics-border) 25%, var(--analytics-card-bg) 50%, var(--analytics-border) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
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

      {/* Real-time Online Counter */}
      <div className="card-stats-grid">
        <div className="stat-card-new live-card">
          <div className="stat-card-header">
            <span>Active Users</span>
            <span className="live-pulse"></span>
          </div>
          <div className="stat-card-body">
            <h2>{realtimeData ? realtimeData.activeUsers : '—'}</h2>
          </div>
          <div className="stat-card-footer">
            <Users size={12} /> Currently online on your website
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>Total Visitors</span>
            <Eye size={14} />
          </div>
          <div className="stat-card-body">
            {loading ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div> : <h2>{cardValue(data?.cards.totalVisitors)}</h2>}
          </div>
          <div className="stat-card-footer">
            <TrendingUp size={12} color="#0f9d68" /> Total visits across selected range
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>Today's Visitors</span>
            <Users size={14} />
          </div>
          <div className="stat-card-body">
            {loading ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div> : <h2>{cardValue(data?.cards.todayVisitors)}</h2>}
          </div>
          <div className="stat-card-footer">
            Tracked since midnight today
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>Yesterday's Visitors</span>
            <Users size={14} />
          </div>
          <div className="stat-card-body">
            {loading ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div> : <h2>{cardValue(data?.cards.yesterdayVisitors)}</h2>}
          </div>
          <div className="stat-card-footer">
            Full tracked day yesterday
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>This Week's Visitors</span>
            <Calendar size={14} />
          </div>
          <div className="stat-card-body">
            {loading ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div> : <h2>{cardValue(data?.cards.weekVisitors)}</h2>}
          </div>
          <div className="stat-card-footer">
            Trailing 7-day visitor counts
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>This Month's Visitors</span>
            <Calendar size={14} />
          </div>
          <div className="stat-card-body">
            {loading ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div> : <h2>{cardValue(data?.cards.monthVisitors)}</h2>}
          </div>
          <div className="stat-card-footer">
            Trailing 30-day visitor counts
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>Total Page Views</span>
            <Eye size={14} />
          </div>
          <div className="stat-card-body">
            {loading ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div> : <h2>{cardValue(data?.cards.totalPageViews)}</h2>}
          </div>
          <div className="stat-card-footer">
            Total screens/pages loaded
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>Avg Session Duration</span>
            <Clock size={14} />
          </div>
          <div className="stat-card-body">
            {loading ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div> : <h2>{cardValue(data?.cards.avgSessionDuration)}</h2>}
          </div>
          <div className="stat-card-footer">
            Average minutes spent per visit
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>Bounce Rate</span>
            <ArrowDownRight size={14} color="#d0342c" />
          </div>
          <div className="stat-card-body">
            {loading ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div> : <h2>{cardValue(data?.cards.bounceRate)}</h2>}
          </div>
          <div className="stat-card-footer">
            Single-page sessions ratio
          </div>
        </div>

        <div className="stat-card-new">
          <div className="stat-card-header">
            <span>New vs Returning</span>
            <Users size={14} />
          </div>
          <div className="stat-card-body">
            {loading
              ? <div className="skeleton" style={{ height: '30px', width: '80px' }}></div>
              : <h2>{data ? `${data.cards.newVsReturning.new}% / ${data.cards.newVsReturning.returning}%` : '—'}</h2>}
          </div>
          <div className="stat-card-footer">
            Ratio of fresh vs repeat visitors
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
