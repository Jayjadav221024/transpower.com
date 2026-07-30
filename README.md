# Transpower Technologies — MERN Application

Company website, technical blog, and an admin panel for publishing posts,
managing images and handling RFQ inquiries.

**MongoDB · Express · React · Node** — split into two independent apps:

```
Transpower/
├── backend/     Express API + MongoDB (Mongoose)   → port 5000
└── frontend/    React + Vite SPA                   → port 5173 (dev)
```

Each folder has its own `package.json`, dependencies and README. They talk over
HTTP only, so either can be deployed on its own.

---

## Quick start

You need **Node 18+** and a **MongoDB** instance (local `mongod`, Docker, or a
free MongoDB Atlas cluster).

**1 — Backend**

```powershell
cd backend
npm install
copy .env.example .env      # set MONGODB_URI and JWT_SECRET
npm run create-admin -- <username> <password> "Display Name"
npm run seed                # optional: one sample article
npm run dev
```

**2 — Frontend** (second terminal)

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the site, the blog at `/blog`, and the admin
panel at `/admin`.

### No MongoDB installed?

```powershell
cd backend
npm run dev:memory
```

Boots a throwaway in-memory MongoDB and creates `admin / Transpower@2026`.
Everything is discarded when you stop the process — good for a look around, not
for real content.

---

## Routes

| Route | Page |
|---|---|
| `/` | Marketing site — hero carousel, catalogue, load calculator, comparison, applications, RFQ form |
| `/blog` | Blog listing with tag filters, search and pagination |
| `/blog/:slug` | Article page with related posts |
| `/admin/login` | Admin sign-in |
| `/admin/posts` | Post list, stats, status filters |
| `/admin/posts/new`, `/admin/posts/:id` | Post editor |
| `/admin/media` | Image library — drag & drop upload |
| `/admin/inquiries` | RFQ submissions from the site's contact form |
| `/admin/settings` | Change password |

---

## Deploying

```powershell
cd frontend && npm run build      # emits frontend/dist
cd ../backend && npm start
```

When `frontend/dist` exists, the Express server serves it directly with an SPA
fallback, so the whole application runs from **one origin on one port** — no CORS
config, no separate static host. Set on the server:

```
NODE_ENV=production
MONGODB_URI=<your connection string>
JWT_SECRET=<long random string>
PORT=5000
```

`NODE_ENV=production` makes the session cookie HTTPS-only, so terminate TLS in
front of the app (nginx, Caddy, or a PaaS). `trust proxy` is already configured.

Keep `backend/uploads/` on a persistent disk — on hosts with ephemeral
filesystems it is wiped on every redeploy. Your content lives in MongoDB and in
that folder; back up both.

---

## What changed from the static site

The original static `index.html` / `app.js` / `styles.css` were replaced by React
components; nothing else about the design changed. Notable functional gains:

- **RFQ form actually submits.** It used to fake a delay and reset itself.
  Submissions now persist to MongoDB and appear under `/admin/inquiries`.
- **Client-side routing** — no full page reloads between the site, blog and admin.
- **The blog and admin panel are data-driven**, served from the API rather than
  hard-coded markup.

See [backend/README.md](backend/README.md) for the API reference and
[frontend/README.md](frontend/README.md) for the component layout.
