import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AnalyticsTracker from './components/common/AnalyticsTracker';
import { initAnalytics } from './lib/analytics';
import './styles/global.css';

/* Before the first render, so the tracker's opening page view has somewhere to
   go. A no-op unless VITE_GA_MEASUREMENT_ID is set — see lib/analytics.js. */
initAnalytics();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnalyticsTracker />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
