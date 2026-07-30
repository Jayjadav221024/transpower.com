# Backend — Express + MongoDB

REST API for the Transpower blog, image library and RFQ inquiries.

```powershell
npm install
copy .env.example .env               # set MONGODB_URI + JWT_SECRET
npm run create-admin -- admin S3cretPass "Transpower Admin"
npm run dev                          # http://localhost:5000
```

| Script | What it does |
|---|---|
| `npm start` | Production server |
| `npm run dev` | Restarts on file changes (`node --watch`) |
| `npm run dev:memory` | Throwaway in-memory MongoDB + seeded admin, no setup needed |
| `npm run create-admin -- <user> <pass> "Name"` | Creates an admin, or resets that admin's password |
| `npm run seed` | Inserts one sample published article |

---

## API

### Public

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/posts?page=&limit=&tag=&q=` | Published posts, paginated |
| GET | `/api/posts/tags` | Tag cloud with counts |
| GET | `/api/posts/:slug` | One article + 3 related; increments views |
| POST | `/api/inquiries` | RFQ form submission — max 20/hour per IP |
| GET | `/api/health` | Uptime probe |

### Admin — all require the session cookie, all return `401` without it

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/admin/login` | `{username, password}` — max 8 attempts / 15 min per IP |
| POST | `/api/admin/logout` | |
| GET | `/api/admin/me` | Current user |
| POST | `/api/admin/change-password` | `{currentPassword, newPassword}` |
| GET | `/api/admin/posts?status=&q=` | All posts incl. drafts, plus stats |
| POST | `/api/admin/posts` | Create |
| GET/PUT/DELETE | `/api/admin/posts/:id` | Read / update / delete |
| POST | `/api/admin/media` | Multipart, field `images` (up to 10) |
| GET | `/api/admin/media` | Library listing |
| PATCH | `/api/admin/media/:id` | Edit alt text |
| DELETE | `/api/admin/media/:id` | Removes the document **and** the file |
| GET | `/api/admin/inquiries?status=` | RFQ submissions |
| PATCH | `/api/admin/inquiries/:id` | `{status: "new" \| "read"}` |
| DELETE | `/api/admin/inquiries/:id` | |

---

## Layout

```
src/
  server.js                 Entry point — connects to Mongo, then listens
  app.js                    Express app (exported without listen, for tests)
  config/db.js              Mongoose connection
  models/                   User · Post · Media · Inquiry
  controllers/              Request handling per resource
  routes/index.js           Route table + rate limits
  middleware/
    auth.js                 JWT cookie, loadUser, protect
    upload.js               Multer config + extension whitelist
    error.js                404, error handler, asyncHandler
  utils/slugify.js
  scripts/
    createAdmin.js          Create / reset an admin account
    seed.js                 Sample article
    devMemoryServer.js      In-memory MongoDB dev runner
uploads/                    Uploaded images (gitignored — back this up)
```

## Security notes

- **Passwords** are bcrypt-hashed at cost 12 by a Mongoose pre-save hook, so a
  plaintext password never reaches the database, including on password change.
- **Sessions** are a JWT in an httpOnly, SameSite=Lax cookie, valid 7 days.
  `secure` is set automatically when `NODE_ENV=production`.
- **Uploads** get server-generated filenames. The client's filename and MIME type
  are never trusted — only whitelisted extensions are accepted, and the recorded
  MIME comes from the server's own map. `/uploads` is served with `nosniff` and a
  locked-down CSP so an SVG cannot execute script on the site's origin.
- **Search input** is escaped before it reaches a RegExp, so a user can't inject
  a pattern into the query.
- **Post HTML is rendered as authored**, by design — the editor is a trusted
  admin tool. Keep admin credentials tight and only issue accounts to people
  you'd trust with the site's markup.
