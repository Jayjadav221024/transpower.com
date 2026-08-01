const path = require('path');
const fs = require('fs');
const Inquiry = require('../models/Inquiry');
const { asyncHandler } = require('../middleware/error');
const { sendEmail } = require('../utils/email');

const BROCHURE_FILE = 'transpower_corporate_brochure.pdf';

/* The brochure lives in the frontend public folder in dev, but the deployed
   backend has its own copy. Try every layout instead of assuming one. */
const findBrochure = () => {
  const candidates = [
    path.join(__dirname, '../../../frontend/public/assets', BROCHURE_FILE),
    path.join(__dirname, '../../../frontend/dist/assets', BROCHURE_FILE),
    path.join(__dirname, '../../frontend/public/assets', BROCHURE_FILE),
    path.join(__dirname, '../../frontend/dist/assets', BROCHURE_FILE),
    path.join(__dirname, '../../uploads', BROCHURE_FILE),
    path.join(__dirname, '../../assets', BROCHURE_FILE),
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
};

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

  const originBase = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',')[0].trim();
  const isBrochure = inquiry.product === 'Brochure Request';
  const mailSubject = isBrochure 
    ? 'Transpower Technologies — Corporate Brochure & Catalog'
    : `Transpower Technologies — Inquiry Received: ${inquiry.product}`;

  const mailHtml = isBrochure
    ? `
      <h3>Your Brochure Download is Ready!</h3>
      <p>Dear ${inquiry.name.split(' (')[0]},</p>
      <p>Thank you for your interest in Transpower Technologies. We have received your request for our corporate brochure.</p>
      <p>For your convenience, we have attached the <strong>Transpower Corporate Brochure & Catalog PDF</strong> to this email.</p>
      <p>You can also download it directly from our website using this link: <a href="${originBase}/assets/transpower_corporate_brochure.pdf">Download Brochure PDF</a></p>
      <p>If you require B2B pricing, specific CAD drawings, or load calculations, please do not hesitate to contact our sales engineering office.</p>
      <p>Best regards,<br/>Transpower Technologies Team</p>
    `
    : `
      <h3>Thank you for contacting Transpower Technologies</h3>
      <p>Dear ${inquiry.name},</p>
      <p>We have received your inquiry regarding <strong>${inquiry.product}</strong> and will get back to you shortly.</p>
      <p><strong>Your Inquiry Details:</strong></p>
      <ul>
        <li><strong>Product:</strong> ${inquiry.product}</li>
        <li><strong>Quantity:</strong> ${inquiry.quantity}</li>
        <li><strong>Message:</strong> ${inquiry.message || 'N/A'}</li>
      </ul>
      <p>Best regards,<br/>Transpower Technologies Team</p>
    `;

  const attachments = [];
  if (isBrochure) {
    const brochurePath = findBrochure();
    if (brochurePath) {
      attachments.push({
        filename: 'Transpower_Corporate_Brochure.pdf',
        path: brochurePath,
        contentType: 'application/pdf',
      });
    } else {
      console.warn(`⚠️  ${BROCHURE_FILE} not found in any known location — sending email without the attachment.`);
    }
  }

  // Awaited so the response can tell the visitor the truth about delivery.
  let emailed = false;
  let emailError = null;
  try {
    await sendEmail({
      to: inquiry.email,
      subject: mailSubject,
      html: mailHtml,
      attachments,
      replyTo: process.env.EMAIL_TO || undefined,
    });
    emailed = true;
  } catch (err) {
    emailError = err.message;
    console.error('❌ Error sending confirmation email to user:', err);
  }

  // Send notification email to the admin if EMAIL_TO is set (non-blocking)
  if (process.env.EMAIL_TO) {
    sendEmail({
      to: process.env.EMAIL_TO,
      subject: `New Website Inquiry: ${inquiry.product}`,
      html: `
        <h3>New Website Inquiry Received</h3>
        <p>A new inquiry/RFQ has been submitted with the following details:</p>
        <ul>
          <li><strong>Name:</strong> ${inquiry.name}</li>
          <li><strong>Email:</strong> ${inquiry.email}</li>
          <li><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</li>
          <li><strong>Product:</strong> ${inquiry.product}</li>
          <li><strong>Quantity:</strong> ${inquiry.quantity}</li>
          <li><strong>Message:</strong> ${inquiry.message || 'N/A'}</li>
        </ul>
        <p><a href="${originBase}/admin/inquiries">Click here to view in the admin panel</a></p>
      `,
      replyTo: inquiry.email,
    }).catch(err => console.error('Error sending admin notification email:', err));
  }

  // The lead is always saved, so a mail failure must not fail the request.
  res.status(201).json({ ok: true, id: inquiry._id, emailed, emailError });
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
