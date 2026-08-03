/* ==========================================================================
   One-time login codes emailed to the admin inbox.
   ========================================================================== */
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('./email');

const CODE_LENGTH = 6;

/**
 * A six-digit code from a cryptographic source.
 *
 * randomInt over the full range rather than randomBytes % 1000000: the modulo
 * version is biased towards low numbers, and padStart on a small number would
 * make leading zeros more likely than they should be.
 */
const generateCode = () =>
  String(crypto.randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0');

const hashCode    = (code) => bcrypt.hash(code, 10);
const compareCode = (code, hash) => bcrypt.compare(code, hash);

/** j••••••3@gmail.com — enough to recognise the inbox, not enough to harvest. */
function maskEmail(address = '') {
  const [local = '', domain = ''] = String(address).split('@');
  if (!domain) return '••••••';
  const head = local.slice(0, 1);
  const tail = local.length > 4 ? local.slice(-1) : '';
  return `${head}${'•'.repeat(Math.max(3, local.length - 2))}${tail}@${domain}`;
}

/** Which inbox receives admin login codes. */
function otpRecipient() {
  const to = process.env.ADMIN_OTP_EMAIL || process.env.EMAIL_TO || process.env.EMAIL_FROM;
  if (!to) {
    throw new Error(
      'No inbox configured for admin login codes. Set ADMIN_OTP_EMAIL (or EMAIL_TO) in backend/.env.'
    );
  }
  /* EMAIL_FROM is often "Name <addr@host>" — pull out the bare address. */
  const match = String(to).match(/<([^>]+)>/);
  return (match ? match[1] : to).trim();
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/**
 * Emails a login code. Rejects if the mail cannot be sent — the caller must
 * treat that as a failed login rather than letting anyone in without a code.
 */
async function sendOtpEmail({ code, username, name, minutes, ip, userAgent, purpose }) {
  const to = otpRecipient();

  const who = name && name !== username ? `${name} (${username})` : username;
  const reason = purpose === 'approval'
    ? 'Another admin approved this access request. The code below finishes the sign-in.'
    : 'Someone entered the correct password for this admin account.';

  const text = [
    `Transpower admin login code: ${code}`,
    '',
    `Account: ${who}`,
    reason,
    `The code expires in ${minutes} minutes.`,
    '',
    `Signed in from: ${ip || 'unknown IP'}`,
    `Device: ${userAgent || 'unknown'}`,
    '',
    'If this was not you, do not share this code. Change the admin password immediately.',
  ].join('\n');

  const html = `
  <div style="font-family:'Segoe UI',system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:28px;color:#0e1a2b">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#d9653b;font-weight:800">
      Transpower Admin Panel
    </p>
    <h1 style="margin:0 0 18px;font-size:20px">Your login code</h1>

    <div style="margin:0 0 20px;padding:18px;border:1px solid #dce3ec;border-radius:12px;background:#f4f6f9;text-align:center">
      <div style="font-size:34px;font-weight:800;letter-spacing:.34em;font-variant-numeric:tabular-nums">
        ${escapeHtml(code)}
      </div>
      <div style="margin-top:6px;font-size:12px;color:#56677e">Expires in ${minutes} minutes</div>
    </div>

    <p style="margin:0 0 6px;font-size:14px;color:#56677e">
      <strong style="color:#0e1a2b">Account:</strong> ${escapeHtml(who)}
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#56677e">${escapeHtml(reason)}</p>

    <table style="width:100%;font-size:12px;color:#7b8a9e;border-top:1px solid #dce3ec;padding-top:12px">
      <tr><td style="padding:6px 0">IP address</td><td style="text-align:right">${escapeHtml(ip || 'unknown')}</td></tr>
      <tr><td style="padding:6px 0">Device</td><td style="text-align:right">${escapeHtml((userAgent || 'unknown').slice(0, 80))}</td></tr>
    </table>

    <p style="margin:18px 0 0;font-size:12px;color:#d0342c">
      If this wasn't you, don't share this code — change the admin password immediately.
    </p>
  </div>`;

  await sendEmail({
    to,
    subject: `${code} is your Transpower admin login code`,
    text,
    html,
  });

  return { to, masked: maskEmail(to) };
}

module.exports = { generateCode, hashCode, compareCode, maskEmail, otpRecipient, sendOtpEmail, CODE_LENGTH };
