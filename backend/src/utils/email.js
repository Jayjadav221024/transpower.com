const nodemailer = require('nodemailer');

let cachedTransporter = null;

/* True only when real SMTP credentials are present. */
const isConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const buildTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Port 465 is implicit TLS; 587 uses STARTTLS. Honour SMTP_SECURE if set,
    // otherwise infer from the port so a mismatched flag can't break sending.
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === 'true'
      : port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Nodemailer's defaults (2 min to connect, 10 min socket) leave the visitor
    // staring at "Sending..." when a port is filtered rather than refused.
    connectionTimeout: 10_000,
    greetingTimeout:   10_000,
    socketTimeout:     20_000,
  });
};

const getTransporter = () => {
  if (!isConfigured()) {
    // Explicit opt-in mock for local development without SMTP.
    if (process.env.EMAIL_MOCK === 'true') {
      return {
        sendMail: async (options) => {
          console.log('📬 [Mock Email — EMAIL_MOCK=true, nothing was actually sent]');
          console.log(`To:      ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          return { messageId: 'mock-id-' + Date.now(), mocked: true };
        },
      };
    }

    // Otherwise fail loudly — silently "sending" to the console is what made
    // brochure emails look successful while never reaching the recipient.
    throw new Error(
      'SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in backend/.env ' +
      '(or set EMAIL_MOCK=true to log emails to the console instead of sending them).'
    );
  }

  if (!cachedTransporter) cachedTransporter = buildTransporter();
  return cachedTransporter;
};

/**
 * Send an email.
 * @param {Object}   options
 * @param {string}   options.to           - Recipient email
 * @param {string}   options.subject      - Email subject
 * @param {string}   [options.text]       - Plain text body
 * @param {string}   [options.html]       - HTML body
 * @param {Array}    [options.attachments]- Array of email attachments
 * @param {string}   [options.replyTo]    - Reply-To address
 */
const sendEmail = async ({ to, subject, text, html, attachments, replyTo }) => {
  if (!to) throw new Error('sendEmail: "to" address is required');

  const transporter = getTransporter();

  // Gmail/most providers reject a From that doesn't match the authenticated
  // mailbox, so fall back to SMTP_USER rather than a bogus no-reply domain.
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments,
    replyTo,
  });

  console.log(`✉️  Email sent to ${to} — ${info.messageId}`);
  if (info.rejected?.length) console.warn('⚠️  Rejected recipients:', info.rejected);

  return info;
};

/* Opens a connection and authenticates, without sending anything. */
const verifyEmail = async () => {
  const transporter = getTransporter();
  if (typeof transporter.verify !== 'function') return { mocked: true };
  await transporter.verify();
  return { ok: true };
};

module.exports = { sendEmail, verifyEmail, isConfigured };
