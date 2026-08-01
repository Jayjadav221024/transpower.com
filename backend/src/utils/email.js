const nodemailer = require('nodemailer');

const getTransporter = () => {
  // If SMTP details are not configured, fallback to a console logger mock
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials not fully configured. Email sending will fall back to console logging.');
    return {
      sendMail: async (options) => {
        console.log('📬 [Mock Email Sent]');
        console.log(`To:      ${options.to}`);
        console.log(`From:    ${options.from}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body (HTML/Text):\n${options.text || options.html}`);
        return { messageId: 'mock-id-' + Date.now() };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 * @param {Array} [options.attachments] - Array of email attachments
 */
const sendEmail = async ({ to, subject, text, html, attachments }) => {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || 'Transpower <no-reply@transpower.com>';

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
