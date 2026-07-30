/* ==========================================================================
   Thin fetch wrapper. Requests are same-origin in production and proxied by
   Vite in dev, so the httpOnly session cookie rides along either way.
   ========================================================================== */
const BASE = import.meta.env.VITE_API_URL || '';

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

  const res  = await fetch(`${BASE}${path}`, options);
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
