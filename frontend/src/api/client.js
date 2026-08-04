/* ==========================================================================
   Thin fetch wrapper. Requests are same-origin in production and proxied by
   Vite in dev, so the httpOnly session cookie rides along either way.
   ========================================================================== */
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const origin = window.location.origin;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return '';
  }
  if (origin.includes('-1.onrender.com')) {
    return origin.replace('-1.onrender.com', '.onrender.com');
  }
  return '';
};

const BASE = getApiBase();

/* Uploaded media is served by the API host, so a bare "/uploads/x.png" would
   resolve against the front end's own origin when the two are deployed apart.
   Bundled files under /assets are part of this build and must stay untouched. */
export const assetUrl = (path) => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  if (path.startsWith('/assets/')) return path;
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

export class ApiError extends Error {
  /* `data` carries the whole error body. A plain message is not enough for
     responses like the 409 from /admin/login, which names the admin holding
     the panel and whether a request can be raised. */
  constructor(message, status, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.code = data?.code;
  }
}

/* Nothing here should ever hang the UI. Uploads get a longer leash. */
const DEFAULT_TIMEOUT_MS = 30_000;

/* A session can end mid-visit — it goes idle, or another admin's approval
   flow revokes it. Every admin call funnels through request(), so one listener
   here catches it wherever it happens instead of each page checking for 401. */
let unauthorizedHandler = null;

/** Registers the callback fired when the server reports the session is gone. */
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
  return () => { if (unauthorizedHandler === handler) unauthorizedHandler = null; };
}

/* Sign-in and the access-request handshake legitimately return 401 while
   nobody is signed in — those must not trigger the "you were signed out" path.
   Anchored deliberately: a plain startsWith() also matches the protected
   /access-requests poll, which would swallow the 401 that tells an admin their
   session was revoked. */
const AUTH_HANDSHAKE = /^\/api\/admin\/(login|access-request)(\/|$|\?)/;
const isAuthHandshake = (path) => AUTH_HANDSHAKE.test(path);

async function request(path, { method = 'GET', body, formData, signal, timeout } = {}) {
  const limit = timeout ?? (formData ? 120_000 : DEFAULT_TIMEOUT_MS);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), limit);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });

  const options = { method, credentials: 'include', headers: {}, signal: controller.signal };

  if (formData) {
    options.body = formData;                       // browser sets the boundary
  } else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const url = `${BASE}${path}`;

  let res;
  try {
    res = await fetch(url, options);
  } catch (cause) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError(
        `The server did not respond within ${Math.round(limit / 1000)} seconds. Please try again.`,
        0,
      );
    }
    /* fetch() rejects with a bare "Failed to fetch" for DNS failures, refused
       connections and — most often in this app — a blocked CORS preflight.
       Name the target so the cause is visible instead of guessed at. */
    throw new ApiError(
      `Could not reach the API at ${url}. Check the server is running and that CLIENT_ORIGIN on the backend lists this site's origin (${window.location.origin}) exactly, with no trailing slash.`,
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && !isAuthHandshake(path)) {
      unauthorizedHandler?.(data.code || 'NO_SESSION', data.error);
    }
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data);
  }
  return data;
}

export const api = {
  get:    (path, opts)       => request(path, { ...opts }),
  post:   (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put:    (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch:  (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del:    (path, opts)       => request(path, { ...opts, method: 'DELETE' }),
  upload: (path, formData)   => request(path, { method: 'POST', formData }),
};

/* ─── Endpoints ──────────────────────────────────────────────────────────── */
export const publicApi = {
  listPosts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    );
    return api.get(`/api/posts?${qs}`);
  },
  getPost:   (slug) => api.get(`/api/posts/${encodeURIComponent(slug)}`),
  getTags:   ()     => api.get('/api/posts/tags'),
  sendInquiry: (payload) => api.post('/api/inquiries', payload),
  getPageContent: (key)  => api.get(`/api/pages/${key}`),
};

export const adminApi = {
  /* Password step only. Never returns a session — on success it resolves with
     { code: 'OTP_REQUIRED', challengeId, sentTo } and the code must be
     verified next. Throws with code 'SESSION_ACTIVE' if the panel is occupied,
     or 'OTP_SEND_FAILED' if the code could not be emailed. */
  login:  (username, password) => api.post('/api/admin/login', { username, password }),

  /* The call that actually signs you in. */
  verifyOtp: (challengeId, code) => api.post('/api/admin/login/verify', { challengeId, code }),
  resendOtp: (challengeId)       => api.post('/api/admin/login/resend', { challengeId }),
  logout: ()                   => api.post('/api/admin/logout'),
  me:     ()                   => api.get('/api/admin/me'),
  changePassword: (currentPassword, newPassword) =>
    api.post('/api/admin/change-password', { currentPassword, newPassword }),

  /* ─── Single-occupancy lock ──────────────────────────────────────────────
     login() throws ApiError with code 'SESSION_ACTIVE' when another admin
     holds the panel; err.data.holder names them. */
  requestAccess: (username, password) =>
    api.post('/api/admin/access-request', { username, password }),
  pollAccessRequest:   (ticket) => api.get(`/api/admin/access-request/${ticket}`),
  cancelAccessRequest: (ticket) => api.del(`/api/admin/access-request/${ticket}`),

  listAccessRequests: () => api.get('/api/admin/access-requests'),
  approveAccessRequest: (id) => api.post(`/api/admin/access-requests/${id}/approve`),
  denyAccessRequest:    (id) => api.post(`/api/admin/access-requests/${id}/deny`),

  listSessions: () => api.get('/api/admin/sessions'),

  listPosts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    );
    return api.get(`/api/admin/posts?${qs}`);
  },
  getPost:    (id)          => api.get(`/api/admin/posts/${id}`),
  createPost: (payload)     => api.post('/api/admin/posts', payload),
  updatePost: (id, payload) => api.put(`/api/admin/posts/${id}`, payload),
  duplicatePost: (id)       => api.post(`/api/admin/posts/${id}/duplicate`),
  deletePost: (id)          => api.del(`/api/admin/posts/${id}`),
  uploadXml: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.upload('/api/admin/posts/upload-xml', form);
  },

  listMedia:  ()          => api.get('/api/admin/media'),
  uploadMedia: (files) => {
    const form = new FormData();
    [...files].forEach((f) => form.append('images', f));
    return api.upload('/api/admin/media', form);
  },
  deleteMedia: (id)       => api.del(`/api/admin/media/${id}`),
  updateMediaAlt: (id, alt) => api.patch(`/api/admin/media/${id}`, { alt }),

  listInquiries:  (status) => api.get(`/api/admin/inquiries${status ? `?status=${status}` : ''}`),
  setInquiryStatus: (id, status) => api.patch(`/api/admin/inquiries/${id}`, { status }),
  deleteInquiry:  (id)     => api.del(`/api/admin/inquiries/${id}`),
  updatePageContent: (key, content) => api.put(`/api/admin/pages/${key}`, { content }),

  getAnalyticsRealtime: () => api.get('/api/admin/analytics/realtime'),
  getAnalyticsHistorical: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/api/admin/analytics/historical?${qs}`);
  },
};
