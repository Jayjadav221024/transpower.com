/* ==========================================================================
   Verify SMTP config and send a real test email.

     node src/scripts/testEmail.js                 -> sends to EMAIL_TO
     node src/scripts/testEmail.js you@gmail.com   -> sends to that address
   ========================================================================== */
require('dotenv').config();

const { sendEmail, verifyEmail, isConfigured } = require('../utils/email');

(async () => {
  const to = process.argv[2] || process.env.EMAIL_TO;

  console.log('SMTP_HOST :', process.env.SMTP_HOST || '(empty)');
  console.log('SMTP_PORT :', process.env.SMTP_PORT || '(empty)');
  console.log('SMTP_USER :', process.env.SMTP_USER || '(empty)');
  console.log('SMTP_PASS :', process.env.SMTP_PASS ? '(set)' : '(empty)');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '(falls back to SMTP_USER)');
  console.log('Sending to:', to || '(none)');
  console.log('');

  if (!isConfigured()) {
    console.error('❌ SMTP is not configured. Fill SMTP_HOST / SMTP_USER / SMTP_PASS in backend/.env');
    process.exit(1);
  }
  if (!to) {
    console.error('❌ No recipient. Pass one as an argument or set EMAIL_TO in backend/.env');
    process.exit(1);
  }

  try {
    await verifyEmail();
    console.log('✅ SMTP connection + login OK');
  } catch (err) {
    console.error('❌ SMTP login failed:', err.message);
    process.exit(1);
  }

  try {
    await sendEmail({
      to,
      subject: 'Transpower — SMTP test',
      html: '<h3>SMTP is working</h3><p>This test email was sent from the Transpower backend.</p>',
      text: 'SMTP is working. This test email was sent from the Transpower backend.',
    });
    console.log(`✅ Test email sent. Check the inbox for ${to} (and the spam folder).`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Send failed:', err.message);
    process.exit(1);
  }
})();
