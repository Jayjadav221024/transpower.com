/* ==========================================================================
   Google Analytics 4 reporting.

   Every number this file serves comes from the GA4 Data API. There is no
   simulated dataset and no placeholder constants: when GA4 is not configured,
   or the API refuses the call, the endpoint answers 503 with the reason and the
   dashboard shows that instead of numbers.

   That is deliberate. Plausible-looking fake traffic cannot be told apart from
   real traffic once it is on screen — it silently becomes the thing decisions
   get made on. An empty panel that explains itself is worth more.
   ========================================================================== */
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('node:fs');

/* Caching keeps the GA4 request quota out of trouble: the live panel polls
   every 5s and the historical view refetches on every range change. Each key
   carries its own expiry — a shared one meant a freshly cached range could be
   discarded because an older key had aged out. */
const CACHE_HISTORICAL_MS = 5 * 60 * 1000;
const CACHE_REALTIME_MS   = 5 * 1000;

const cache = new Map();   // key -> { data, expiry }

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() >= hit.expiry) { cache.delete(key); return null; }
  return hit.data;
}

function cacheSet(key, data, ttlMs) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
  return data;
}

/**
 * Read the service account key from GOOGLE_CREDENTIALS_JSON (raw JSON or base64).
 * Hosts like Render have no persistent disk for a key file, so the inline env var
 * is the primary path; GOOGLE_APPLICATION_CREDENTIALS is the local-dev fallback.
 */
function loadInlineCredentials() {
  const raw = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!raw || !raw.trim()) return null;

  // Strip a BOM and any surrounding whitespace a copy/paste may have introduced
  const cleaned = raw.replace(/^﻿/, '').trim();

  let text;
  if (cleaned.startsWith('{')) {
    text = cleaned;
  } else {
    // Dashboard fields often wrap long values; drop whitespace so the base64
    // stays byte-aligned. Node's decoder skips bad characters silently, which
    // would otherwise turn a truncated paste into unreadable bytes.
    const compact = cleaned.replace(/\s+/g, '');
    if (compact.length % 4 !== 0) {
      throw new Error(`base64 value looks truncated (${compact.length} chars, not a multiple of 4)`);
    }
    text = Buffer.from(compact, 'base64').toString('utf8');
    if (!text.trimStart().startsWith('{')) {
      throw new Error('decoded base64 is not JSON — the value was likely truncated or partially pasted');
    }
  }

  const parsed = JSON.parse(text);
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('missing client_email or private_key');
  }
  // Env vars typically carry the key with literal \n escapes rather than real newlines
  parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  return parsed;
}

// Initialize GA4 client from inline credentials, or a key file on disk
let gaClient = null;
const propertyId = process.env.GA_PROPERTY_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let inlineCredentials = null;
try {
  inlineCredentials = loadInlineCredentials();
} catch (err) {
  console.error(`  Analytics Warning: GOOGLE_CREDENTIALS_JSON could not be parsed (${err.message}).`);
}

const hasCredentialsFile = Boolean(credentialsPath) && fs.existsSync(credentialsPath);

/* What is missing, in words the admin can act on. Kept as a function so the
   message reflects the environment rather than being written twice. */
function missingConfig() {
  const gaps = [];
  if (!propertyId) gaps.push('GA_PROPERTY_ID is not set');
  if (!inlineCredentials && !hasCredentialsFile) {
    gaps.push(
      credentialsPath
        ? `no readable service-account key (GOOGLE_APPLICATION_CREDENTIALS points at "${credentialsPath}")`
        : 'no service-account credentials (set GOOGLE_CREDENTIALS_JSON or GOOGLE_APPLICATION_CREDENTIALS)'
    );
  }
  return gaps;
}

if (propertyId && (inlineCredentials || hasCredentialsFile)) {
  try {
    gaClient = inlineCredentials
      ? new BetaAnalyticsDataClient({
          credentials: {
            client_email: inlineCredentials.client_email,
            private_key: inlineCredentials.private_key,
          },
          projectId: inlineCredentials.project_id,
        })
      : new BetaAnalyticsDataClient();
    console.log(`  Google Analytics 4 Data API client initialized (${inlineCredentials ? 'inline credentials' : 'key file'}).`);
  } catch (err) {
    gaClient = null;
    console.error('  Error initializing GA4 client:', err.message);
  }
} else {
  console.warn(`  Analytics: reporting disabled — ${missingConfig().join('; ')}. The dashboard will say so.`);
}

/* ─── Response helpers ───────────────────────────────────────────────────── */

/** The only response shape when live figures cannot be produced. Carries no numbers. */
function unavailable(res, { code, error, detail }) {
  return res.status(503).json({
    code,
    error,
    detail: detail || undefined,
    configured: Boolean(gaClient),
    propertyId: propertyId || null,
  });
}

const notConfigured = (res) =>
  unavailable(res, {
    code: 'ANALYTICS_NOT_CONFIGURED',
    error: 'Google Analytics is not connected, so there are no figures to show.',
    detail: missingConfig().join('; '),
  });

const apiFailed = (res, err, what) => {
  console.error(`GA4 ${what} request failed:`, err.message);
  return unavailable(res, {
    code: 'ANALYTICS_API_ERROR',
    error: `Google Analytics refused the ${what} request.`,
    detail: err.message,
  });
};

/* ─── Parsing helpers ────────────────────────────────────────────────────── */

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const rowsOf = (report) => (report && report.rows) || [];

/** dimension value + metric value, as a share of the report's own total. */
function shares(report, labelKey, countKey) {
  const items = rowsOf(report).map((row) => ({
    label: row.dimensionValues[0].value || '(not set)',
    count: num(row.metricValues[0].value),
  }));
  const total = items.reduce((sum, i) => sum + i.count, 0);
  return items.map((i) => ({
    [labelKey]: i.label,
    [countKey]: i.count,
    /* A real share of the total, not a raw count wearing the name
       "percentage" — the doughnut legends read these as percentages. */
    percentage: total ? Number(((i.count * 100) / total).toFixed(1)) : 0,
  }));
}

/** "20260804" → "04 Aug" */
function shortDate(yyyymmdd) {
  const raw = String(yyyymmdd || '');
  if (raw.length !== 8) return raw;
  const date = new Date(`${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return raw;
  return `${raw.slice(6, 8)} ${date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })}`;
}

/** "202608" → "Aug 26" */
function shortMonth(yyyymm) {
  const raw = String(yyyymm || '');
  if (raw.length !== 6) return raw;
  const date = new Date(`${raw.slice(0, 4)}-${raw.slice(4, 6)}-01T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return raw;
  return `${date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })} ${raw.slice(2, 4)}`;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Seconds → "2m 45s", the shape the cards display. */
function duration(seconds) {
  const total = Math.max(0, Math.round(num(seconds)));
  return `${Math.floor(total / 60)}m ${total % 60}s`;
}

/** Named date ranges arrive as an extra "dateRange" dimension on each row. */
function byDateRange(report) {
  const headers = (report && report.dimensionHeaders) || [];
  const at = headers.findIndex((h) => h.name === 'dateRange');
  const out = {};
  for (const row of rowsOf(report)) {
    const key = at >= 0 ? row.dimensionValues[at].value : 'total';
    out[key] = num(row.metricValues[0].value);
  }
  return out;
}

/* ─── Date ranges ────────────────────────────────────────────────────────── */

const RANGE_PRESETS = {
  today:     { startDate: 'today',     endDate: 'today' },
  yesterday: { startDate: 'yesterday', endDate: 'yesterday' },
  '7days':   { startDate: '7daysAgo',  endDate: 'today' },
  '30days':  { startDate: '30daysAgo', endDate: 'today' },
  '90days':  { startDate: '90daysAgo', endDate: 'today' },
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Resolves the query into a GA4 date range, or null when it is unusable. */
function resolveRange(range, startDate, endDate) {
  if (range === 'custom' || (startDate && endDate)) {
    if (!ISO_DATE.test(String(startDate)) || !ISO_DATE.test(String(endDate))) return null;
    if (startDate > endDate) return null;
    return { startDate, endDate };
  }
  return RANGE_PRESETS[range] || null;
}

/* ==========================================================================
   Controllers
   ========================================================================== */

/**
 * GET /api/admin/analytics/realtime
 *
 * GA4's realtime report is aggregated — a row is "this many people are on this
 * page from this city", not one identified visitor. So this returns exactly
 * that. The old per-visitor IDs and durations had no source in the API and were
 * invented locally.
 */
exports.getRealTimeStats = async (_req, res) => {
  const cached = cacheGet('realtime');
  if (cached) return res.json(cached);

  if (!gaClient) return notConfigured(res);

  try {
    const [report] = await gaClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [
        { name: 'unifiedScreenName' },
        { name: 'country' },
        { name: 'city' },
      ],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 50,
    });

    const activePages = rowsOf(report).map((row) => ({
      page:        row.dimensionValues[0].value || '(not set)',
      country:     row.dimensionValues[1].value || '(unknown)',
      city:        row.dimensionValues[2].value || '(unknown)',
      activeUsers: num(row.metricValues[0].value),
    }));

    /* Summed from the per-page rows rather than requested separately: one call
       instead of two, and the total always agrees with the table beneath it. */
    const result = {
      activeUsers: activePages.reduce((sum, p) => sum + p.activeUsers, 0),
      activePages,
      lastUpdated: new Date().toISOString(),
    };

    return res.json(cacheSet('realtime', result, CACHE_REALTIME_MS));
  } catch (err) {
    return apiFailed(res, err, 'live');
  }
};

/**
 * GET /api/admin/analytics/historical?range=&startDate=&endDate=
 *
 * Every card and chart below maps to a GA4 dimension. Nothing is estimated from
 * another figure, which the previous version did in several places — today's
 * visitors as 5% of the range total, operating systems and traffic sources as
 * fixed percentages, landing pages as 85% of page views.
 */
exports.getHistoricalStats = async (req, res) => {
  const { range = '30days', startDate, endDate } = req.query;

  const dateRange = resolveRange(range, startDate, endDate);
  if (!dateRange) {
    return res.status(400).json({
      code: 'ANALYTICS_BAD_RANGE',
      error: 'Pick one of today, yesterday, 7days, 30days, 90days, or supply startDate and endDate as YYYY-MM-DD.',
    });
  }

  const cacheKey = `historical:${dateRange.startDate}:${dateRange.endDate}`;
  const cached = cacheGet(cacheKey);
  if (cached) return res.json(cached);

  if (!gaClient) return notConfigured(res);

  const property = `properties/${propertyId}`;
  const dateRanges = [dateRange];

  /* One report per breakdown, all in flight together — GA4 bills a token per
     request either way, and serially they would take ten round trips. */
  const breakdown = (dimension, metric, limit) =>
    gaClient.runReport({
      property,
      dateRanges,
      dimensions: [{ name: dimension }],
      metrics: [{ name: metric }],
      orderBys: [{ metric: { metricName: metric }, desc: true }],
      limit,
    });

  try {
    const [
      [totals],
      [dailyReport],
      [cardCounts],
      [deviceReport],
      [browserReport],
      [osReport],
      [countryReport],
      [pagesReport],
      [landingReport],
      [sourceReport],
      [visitorTypeReport],
      [weekdayReport],
      [monthlyReport],
    ] = await Promise.all([
      /* Range totals with no dimension. Bounce rate and session duration have
         to come from here: averaging the per-day values, as this used to, is
         not the same number as the range's own rate. */
      gaClient.runReport({
        property,
        dateRanges,
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
      }),
      gaClient.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
        limit: 400,
      }),
      /* The four fixed-window cards, as named ranges in a single request. */
      gaClient.runReport({
        property,
        dateRanges: [
          { startDate: 'today',      endDate: 'today',     name: 'today' },
          { startDate: 'yesterday',  endDate: 'yesterday', name: 'yesterday' },
          { startDate: '6daysAgo',   endDate: 'today',     name: 'week' },
          { startDate: '29daysAgo',  endDate: 'today',     name: 'month' },
        ],
        metrics: [{ name: 'activeUsers' }],
      }),
      breakdown('deviceCategory', 'activeUsers', 10),
      breakdown('browser', 'activeUsers', 5),
      breakdown('operatingSystem', 'activeUsers', 5),
      breakdown('country', 'activeUsers', 6),
      breakdown('pagePath', 'screenPageViews', 8),
      breakdown('landingPagePlusQueryString', 'sessions', 5),
      breakdown('sessionDefaultChannelGroup', 'sessions', 6),
      breakdown('newVsReturning', 'activeUsers', 5),
      gaClient.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'dayOfWeek' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'dayOfWeek' } }],
      }),
      gaClient.runReport({
        property,
        dateRanges: [{ startDate: '365daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'yearMonth' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'yearMonth' } }],
        limit: 13,
      }),
    ]);

    const totalRow = rowsOf(totals)[0];
    const metric = (idx) => (totalRow ? num(totalRow.metricValues[idx].value) : 0);

    const counts = byDateRange(cardCounts);

    /* GA4 reports dayOfWeek as "0" for Sunday; the chart runs Mon–Sun. */
    const weekdayTotals = new Array(7).fill(0);
    for (const row of rowsOf(weekdayReport)) {
      const ga = num(row.dimensionValues[0].value);          // 0 = Sunday
      weekdayTotals[(ga + 6) % 7] += num(row.metricValues[0].value);
    }

    const visitorTypes = shares(visitorTypeReport, 'type', 'visitors');
    const findType = (name) =>
      visitorTypes.find((t) => t.type.toLowerCase() === name)?.percentage ?? 0;

    const result = {
      range,
      dateRange,
      cards: {
        totalVisitors:      metric(0),
        todayVisitors:      counts.today     || 0,
        yesterdayVisitors:  counts.yesterday || 0,
        weekVisitors:       counts.week      || 0,
        monthVisitors:      counts.month     || 0,
        totalPageViews:     metric(1),
        sessions:           metric(2),
        avgSessionDuration: duration(metric(4)),
        /* GA4 returns bounceRate as a ratio (0.4251), not a percentage. */
        bounceRate:         `${(metric(3) * 100).toFixed(1)}%`,
        newVsReturning:     { new: findType('new'), returning: findType('returning') },
      },
      charts: {
        dailyVisitors: rowsOf(dailyReport).map((row) => ({
          date:     shortDate(row.dimensionValues[0].value),
          visitors: num(row.metricValues[0].value),
        })),
        weekdayVisitors: WEEKDAYS.map((day, i) => ({ day, visitors: weekdayTotals[i] })),
        monthlyVisitors: rowsOf(monthlyReport).map((row) => ({
          month:    shortMonth(row.dimensionValues[0].value),
          visitors: num(row.metricValues[0].value),
        })),
        countries: rowsOf(countryReport).map((row) => ({
          name:     row.dimensionValues[0].value || '(unknown)',
          visitors: num(row.metricValues[0].value),
        })),
        devices:          shares(deviceReport, 'type', 'visitors'),
        browsers:         shares(browserReport, 'name', 'visitors'),
        operatingSystems: shares(osReport, 'name', 'visitors'),
        trafficSources:   shares(sourceReport, 'source', 'sessions'),
        visitorTypes,
        topPages: rowsOf(pagesReport).map((row) => ({
          path:  row.dimensionValues[0].value,
          views: num(row.metricValues[0].value),
        })),
        topLandingPages: rowsOf(landingReport).map((row) => ({
          path:     row.dimensionValues[0].value,
          sessions: num(row.metricValues[0].value),
        })),
      },
      lastUpdated: new Date().toISOString(),
    };

    return res.json(cacheSet(cacheKey, result, CACHE_HISTORICAL_MS));
  } catch (err) {
    return apiFailed(res, err, 'reporting');
  }
};
