/* ==========================================================================
   Route table
     /api/posts        public blog reads
     /api/inquiries    public RFQ submissions
     /api/admin/*      everything behind the login cookie
   ========================================================================== */
const express   = require('express');
const rateLimit = require('express-rate-limit');
const multer    = require('multer');

const { protect } = require('../middleware/auth');
const { upload }  = require('../middleware/upload');

const auth    = require('../controllers/auth.controller');
const posts   = require('../controllers/post.controller');
const media   = require('../controllers/media.controller');
const inquiry = require('../controllers/inquiry.controller');
const pages   = require('../controllers/page.controller');

const router = express.Router();
const xmlUpload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

/* ─── Throttles ──────────────────────────────────────────────────────────── */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many inquiries sent from this address. Please try again later.' },
});

/* ─── Public ─────────────────────────────────────────────────────────────── */
router.get('/posts',       posts.listPublished);
router.get('/posts/tags',  posts.listTags);      // must precede /posts/:slug
router.get('/posts/:slug', posts.getBySlug);
router.get('/pages/:key',  pages.getPage);

router.post('/inquiries', inquiryLimiter, inquiry.create);

router.get('/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

/* ─── Auth ───────────────────────────────────────────────────────────────── */
router.post('/admin/login',  loginLimiter, auth.login);
router.post('/admin/logout', auth.logout);
router.get('/admin/me',      protect, auth.me);
router.post('/admin/change-password', protect, auth.changePassword);

/* Raising and polling an access request happens while the requester has no
   session yet, so these three sit outside `protect`. The request endpoint
   re-checks the password and shares the login throttle; polling and cancelling
   are guarded by an unguessable single-use ticket. */
router.post('/admin/access-request', loginLimiter, auth.requestAccess);
router.get('/admin/access-request/:ticket', auth.pollAccessRequest);
router.delete('/admin/access-request/:ticket', auth.cancelAccessRequest);

/* ─── Admin (every route below requires a session) ───────────────────────── */
const admin = express.Router();
admin.use(protect);

admin.post('/posts/upload-xml', xmlUpload.single('file'), posts.uploadXml);
admin.route('/posts').get(posts.listAll).post(posts.create);
admin.route('/posts/:id').get(posts.getById).put(posts.update).delete(posts.remove);

admin.route('/media').get(media.listMedia).post(upload.array('images', 10), media.uploadImages);
admin.route('/media/:id').patch(media.updateAlt).delete(media.removeMedia);

admin.get('/inquiries', inquiry.list);
admin.route('/inquiries/:id').patch(inquiry.setStatus).delete(inquiry.remove);

admin.route('/pages/:key').put(pages.updatePage);

/* Approving or denying another admin's request to join, and seeing who else
   is currently in the panel. */
admin.get('/access-requests', auth.listAccessRequests);
admin.post('/access-requests/:id/approve', auth.approveAccessRequest);
admin.post('/access-requests/:id/deny',    auth.denyAccessRequest);
admin.get('/sessions', auth.listSessions);

router.use('/admin', admin);

module.exports = router;
