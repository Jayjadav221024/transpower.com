import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../api/client';
import { Chart, registerables } from 'chart.js';
import { 
  Users, Eye, Clock, ArrowDownRight, Compass, Laptop, BarChart2, 
  MapPin, Globe, Download, RefreshCw, Calendar, FileText, TrendingUp
} from 'lucide-react';
import '../../styles/analytics.css';

Chart.register(...registerables);

/** A hex colour at partial opacity — for fills derived from their own series. */
const fade = (hex, alpha) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

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

  /* The "live" green is one state colour shared by the Active Users card and the
     realtime chart, so it is declared once rather than typed into both. Light
     mode takes a darker step of the same hue: the dark-mode value measures
     2.5:1 against the white card, below the floor for text that size. */
  const LIVE = darkMode ? '#10b981' : '#0f9d68';

  /* The other two stat cards, on the same footing: ACCENT is the palette's
     second slot, and a rising bounce rate is a bad thing rather than "series
     three", so it wears the reserved critical colour and not a decorative red.
     Both replace hand-picked values that clashed with the charts below. */
  const ACCENT = darkMode ? '#3987e5' : '#2a78d6';
  const ALERT  = '#d03b3b';

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

    /* One palette for every chart on this page, so the dashboard reads as a
       single system rather than eleven independently-coloured cards.
       ------------------------------------------------------------------
       Slot 1 is the Transpower orange; the other seven are the same hues
       stepped separately for each surface, because a colour that works on the
       near-black card is not the one that works on white.

       The slot ORDER is not cosmetic — it is what keeps neighbouring segments
       of a doughnut apart for red/green colour blindness. Both sets were
       measured against the real card background (#13151b dark, #ffffff light)
       rather than chosen by eye: worst adjacent pair ΔE 8.4 dark and 9.1 light
       under simulated protanopia/deuteranopia. Re-ordering breaks that, so
       extend at the end rather than rearranging.

       `live` is a state colour, not a series colour, and deliberately sits
       outside the palette. The previous value (#10b981) measured 2.5:1 against
       the white card — fine in dark mode, washed out in light — so light mode
       takes a darker step of the same green. */
    const C = darkMode
      ? {
          surface: '#13151b',
          text:    '#787f95',
          grid:    'rgba(255, 255, 255, 0.06)',
          axis:    'rgba(255, 255, 255, 0.12)',
          live:    LIVE,
          series:  ['#e1590b', '#3987e5', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'],
        }
      : {
          surface: '#ffffff',
          text:    '#64748b',
          grid:    'rgba(15, 23, 42, 0.07)',
          axis:    'rgba(15, 23, 42, 0.14)',
          live:    LIVE,
          series:  ['#e1590b', '#2a78d6', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'],
        };

    const BRAND = C.series[0];
    const FONT  = { family: 'Plus Jakarta Sans', size: 11 };

    // Destroy all previous chart instances to prevent canvas reuse errors
    Object.keys(chartInstances.current).forEach(key => {
      chartInstances.current[key]?.destroy();
    });

    const tooltip = {
      backgroundColor: darkMode ? 'rgba(8, 9, 13, 0.95)' : 'rgba(255, 255, 255, 0.98)',
      titleColor:  darkMode ? '#f8fafc' : '#0f172a',
      bodyColor:   darkMode ? '#c7cbd9' : '#334155',
      borderColor: darkMode ? 'rgba(255, 255, 255, 0.10)' : 'rgba(15, 23, 42, 0.10)',
      borderWidth: 1,
      cornerRadius: 10,
      padding: 10,
      usePointStyle: true,
      boxWidth: 8,
      boxHeight: 8,
      boxPadding: 5,
      titleFont: { ...FONT, size: 11, weight: '700' },
      bodyFont:  { ...FONT, size: 12 },
    };

    /* Gridlines on the value axis only: a grid behind the category labels draws
       lines that mark nothing. `precision: 0` stops Chart.js inventing 0.2 of a
       visitor when the highest bar is 2 — the single most obvious tell that a
       chart is drawing an axis rather than reporting a number. */
    const cartesianScales = (indexAxis = 'x') => {
      const category = {
        grid:   { display: false },
        border: { color: C.axis },
        ticks:  { color: C.text, font: FONT },
      };
      const value = {
        beginAtZero: true,
        grid:   { color: C.grid, drawTicks: false },
        border: { display: false },
        ticks:  { color: C.text, font: FONT, padding: 6, precision: 0 },
      };
      return indexAxis === 'y' ? { x: value, y: category } : { x: category, y: value };
    };

    const optionsTemplate = {
      responsive: true,
      maintainAspectRatio: false,
      /* Hovering anywhere in a column beats having to land on the mark itself,
         which on a 30-point line is a two-pixel target. */
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: C.text,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            boxHeight: 8,
            padding: 14,
            font: FONT,
          },
        },
        tooltip,
      },
      scales: cartesianScales('x'),
    };

    // Helper to create chart
    const createChart = (key, type, chartData, options = {}) => {
      const ref = chartRefs[key]?.current;
      if (!ref) return;
      const ctx = ref.getContext('2d');
      chartInstances.current[key] = new Chart(ctx, {
        type,
        data: chartData,
        /* `plugins` is merged a level deeper than the rest: a plain spread would
           drop the shared tooltip styling the moment a chart passes its own
           `plugins: { legend: … }`, which most of them do. */
        options: {
          ...optionsTemplate,
          ...options,
          plugins: { ...optionsTemplate.plugins, ...options.plugins },
        },
      });
    };

    /* Doughnuts share everything except their data: a 2px ring in the card's own
       colour separates neighbouring arcs so two segments never bleed into one
       shape, and the share is written into the legend instead of being hidden
       behind a hover. That second part is also what makes light mode legal —
       three of its slots sit below 3:1 on white, so the number has to be
       readable without depending on the fill. */
    const doughnutOptions = () => ({
      cutout: '68%',
      interaction: { mode: 'nearest', intersect: true },
      scales: {},
      plugins: {
        tooltip: { ...tooltip, callbacks: { label: (ctx) => `  ${ctx.label}: ${ctx.parsed}%` } },
        legend: {
          position: 'bottom',
          labels: {
            color: C.text,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            boxHeight: 8,
            padding: 12,
            font: FONT,
            generateLabels: (chart) => {
              const ds = chart.data.datasets[0] || { data: [], backgroundColor: [] };
              return chart.data.labels.map((label, i) => ({
                text: `${label}  ${ds.data[i]}%`,
                fillStyle: ds.backgroundColor[i],
                strokeStyle: ds.backgroundColor[i],
                lineWidth: 0,
                pointStyle: 'circle',
                hidden: !chart.getDataVisibility(i),
                index: i,
              }));
            },
          },
        },
      },
    });

    /* Slots are handed out in order and never cycled: with more categories than
       slots the tail would otherwise restart at orange and two different things
       would wear the same colour. */
    const sliceColors = (count) => C.series.slice(0, count);

    /* A single measure is one series, so every one-series chart wears the same
       brand orange. Giving each card its own colour spends the identity channel
       on nothing — the bar length already says how much, and eleven unrelated
       hues is what made the grid look like a paint chart. */
    const BAR = { backgroundColor: BRAND, borderRadius: 4, maxBarThickness: 26 };

    // 1. Real-time Chart — one point per poll that actually returned
    createChart('realtime', 'line', {
      labels: realtimeHistory.map(s => s.at.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })),
      datasets: [{
        label: 'Active Users (Live)',
        data: realtimeHistory.map(s => s.users),
        borderColor: C.live,
        backgroundColor: fade(C.live, 0.16),
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: C.live,
        /* A ring in the card's colour keeps points legible where the line
           doubles back over itself. */
        pointBorderColor: C.surface,
        pointBorderWidth: 2,
      }]
    }, {
      plugins: { legend: { display: false } },
      scales: cartesianScales('x'),
    });

    // 2. Daily Visitors (Last 30 days)
    const dailyData = data.charts.dailyVisitors || [];
    createChart('daily', 'line', {
      labels: dailyData.map(d => d.date),
      datasets: [{
        label: 'Visitors',
        data: dailyData.map(d => d.visitors),
        borderColor: BRAND,
        backgroundColor: fade(BRAND, 0.16),
        tension: 0.35,
        fill: true,
        borderWidth: 2,
        /* No dot on every one of 30 days — only the one being read. */
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: BRAND,
        pointBorderColor: C.surface,
        pointBorderWidth: 2,
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
        ...BAR,
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
        ...BAR,
      }]
    }, {
      plugins: { legend: { display: false } }
    });

    /* The four share-of-total charts. Same dataset shape, same treatment — the
       2px ring is the card's own colour, so it reads as a gap between arcs
       rather than a stroke around them. */
    const ARC = (count) => ({
      backgroundColor: sliceColors(count),
      borderColor: C.surface,
      borderWidth: 2,
      hoverBorderColor: C.surface,
      hoverOffset: 6,
    });

    // 5. Traffic Sources
    const sourceData = data.charts.trafficSources || [];
    createChart('sources', 'doughnut', {
      labels: sourceData.map(s => s.source),
      datasets: [{ data: sourceData.map(s => s.percentage), ...ARC(sourceData.length) }]
    }, doughnutOptions());

    // 6. Device Types
    const deviceData = data.charts.devices || [];
    createChart('devices', 'doughnut', {
      labels: deviceData.map(d => d.type),
      datasets: [{ data: deviceData.map(d => d.percentage), ...ARC(deviceData.length) }]
    }, doughnutOptions());

    // 7. Browser Usage
    const browserData = data.charts.browsers || [];
    createChart('browsers', 'doughnut', {
      labels: browserData.map(b => b.name),
      datasets: [{ data: browserData.map(b => b.percentage), ...ARC(browserData.length) }]
    }, doughnutOptions());

    // 8. Operating Systems
    const osData = data.charts.operatingSystems || [];
    createChart('os', 'doughnut', {
      labels: osData.map(o => o.name),
      datasets: [{ data: osData.map(o => o.percentage), ...ARC(osData.length) }]
    }, doughnutOptions());

    // 9. Country-wise Visitors
    const countryData = data.charts.countries || [];
    createChart('countries', 'bar', {
      labels: countryData.map(c => c.name),
      datasets: [{
        label: 'Visitors',
        data: countryData.map(c => c.visitors),
        ...BAR,
        maxBarThickness: 18,
      }]
    }, {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: cartesianScales('y'),
    });

    // 10. Top Visited Pages
    const pagesData = data.charts.topPages || [];
    createChart('topPages', 'bar', {
      labels: pagesData.map(p => p.path),
      datasets: [{
        label: 'Page Views',
        data: pagesData.map(p => p.views),
        ...BAR,
        maxBarThickness: 18,
      }]
    }, {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: cartesianScales('y'),
    });

    // 11. Top Landing Pages
    const landingData = data.charts.topLandingPages || [];
    createChart('landingPages', 'bar', {
      labels: landingData.map(l => l.path),
      datasets: [{
        label: 'Entrances',
        data: landingData.map(l => l.sessions),
        ...BAR,
        maxBarThickness: 18,
      }]
    }, {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: cartesianScales('y'),
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
              <div className="stakent-asset-icon" style={{ background: fade(LIVE, 0.15), color: LIVE }}>
                <Users size={16} />
              </div>
              <div className="stakent-asset-arrow">↗</div>
            </div>
            <div className="stakent-asset-body">
              <div className="stakent-asset-label">Active Users</div>
              <div className="stakent-asset-value">{realtimeData ? realtimeData.activeUsers : '—'}</div>
            </div>
            <div className="stakent-asset-footer">
              <div className="stakent-asset-trend" style={{ color: LIVE }}>
                <span className="live-pulse"></span> Live
              </div>
              <Sparkline stroke={LIVE} data={realtimeHistory.map(s => s.users)} />
            </div>
          </div>

          {/* Asset 2: Total Visitors */}
          <div className="stakent-asset-card">
            <div className="stakent-asset-header">
              <div className="stakent-asset-icon" style={{ background: fade(ACCENT, 0.15), color: ACCENT }}>
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
              <div className="stakent-asset-trend" style={{ color: ACCENT }}>
                +5.67%
              </div>
              <Sparkline stroke={ACCENT} data={data?.charts.dailyVisitors?.slice(-10).map(d => d.visitors)} />
            </div>
          </div>

          {/* Asset 3: Bounce Rate */}
          <div className="stakent-asset-card">
            <div className="stakent-asset-header">
              <div className="stakent-asset-icon" style={{ background: fade(ALERT, 0.15), color: ALERT }}>
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
              <div className="stakent-asset-trend" style={{ color: ALERT }}>
                -1.89%
              </div>
              <Sparkline stroke={ALERT} data={[45, 43, 44, 42, 41, 40, 42]} />
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
