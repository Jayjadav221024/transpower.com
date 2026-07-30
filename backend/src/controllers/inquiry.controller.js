const Inquiry = require('../models/Inquiry');
const { asyncHandler } = require('../middleware/error');

const shape = (i) => ({
  id:        i._id,
  name:      i.name,
  email:     i.email,
  phone:     i.phone,
  product:   i.product,
  quantity:  i.quantity,
  message:   i.message,
  status:    i.status,
  createdAt: i.createdAt,
});

/* POST /api/inquiries — public RFQ form submission */
const create = asyncHandler(async (req, res) => {
  const b = req.body || {};
  const inquiry = await Inquiry.create({
    name:     String(b.name || '').trim(),
    email:    String(b.email || '').trim(),
    phone:    String(b.phone || '').trim(),
    product:  String(b.product || '').trim(),
    quantity: String(b.quantity || '').trim(),
    message:  String(b.message || '').trim(),
  });
  res.status(201).json({ ok: true, id: inquiry._id });
});

/* GET /api/admin/inquiries?status= */
const list = asyncHandler(async (req, res) => {
  const status = String(req.query.status || 'all').toLowerCase();
  const filter = ['new', 'read'].includes(status) ? { status } : {};

  const [docs, newCount] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).limit(300),
    Inquiry.countDocuments({ status: 'new' }),
  ]);

  res.json({ inquiries: docs.map(shape), newCount });
});

/* PATCH /api/admin/inquiries/:id — mark new / read */
const setStatus = asyncHandler(async (req, res) => {
  const status = req.body?.status === 'new' ? 'new' : 'read';
  const doc = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!doc) return res.status(404).json({ error: 'Inquiry not found' });
  res.json({ inquiry: shape(doc) });
});

/* DELETE /api/admin/inquiries/:id */
const remove = asyncHandler(async (req, res) => {
  const deleted = await Inquiry.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Inquiry not found' });
  res.json({ ok: true });
});

module.exports = { create, list, setStatus, remove };
