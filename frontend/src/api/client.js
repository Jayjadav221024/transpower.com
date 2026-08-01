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
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, formData, signal } = {}) {
  const options = { method, credentials: 'include', headers: {}, signal };

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
    /* fetch() rejects with a bare "Failed to fetch" for DNS failures, refused
       connections and — most often in this app — a blocked CORS preflight.
       Name the target so the cause is visible instead of guessed at. */
    throw new ApiError(
      `Could not reach the API at ${url}. Check the server is running and that CLIENT_ORIGIN on the backend lists this site's origin (${window.location.origin}) exactly, with no trailing slash.`,
      0,
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
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
  login:  (username, password) => api.post('/api/admin/login', { username, password }),
  logout: ()                   => api.post('/api/admin/logout'),
  me:     ()                   => api.get('/api/admin/me'),
  changePassword: (currentPassword, newPassword) =>
    api.post('/api/admin/change-password', { currentPassword, newPassword }),

  listPosts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    );
    return api.get(`/api/admin/posts?${qs}`);
  },
  getPost:    (id)          => api.get(`/api/admin/posts/${id}`),
  createPost: (payload)     => api.post('/api/admin/posts', payload),
  updatePost: (id, payload) => api.put(`/api/admin/posts/${id}`, payload),
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
};
