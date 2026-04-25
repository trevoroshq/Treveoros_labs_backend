import 'dotenv/config';
import { Resend } from 'resend';

const TO = 'satyamtripathi038@gmail.com';

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.RESEND_FROM_EMAIL || 'TREVOROS LABS <admissions@trevoros.com>';

  if (!apiKey) {
    console.error('❌  RESEND_API_KEY is not set in .env');
    process.exit(1);
  }

  console.log('🔑  API Key :', apiKey.slice(0, 10) + '...');
  console.log('📤  From    :', from);
  console.log('📬  To      :', TO);
  console.log('Sending...\n');

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: [TO],
    subject: '✅ Resend Test — TREVOROS LABS Email is Working!',
    text: 'This is a test email from TREVOROS LABS to confirm that Resend is configured correctly.',
    html: `
      <div style="font-family: Segoe UI, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f172a, #1e3a5f); padding: 32px 28px; text-align: center;">
          <h1 style="color: #38bdf8; margin: 0; font-size: 22px; letter-spacing: 1px;">TREVOROS LABS</h1>
          <p style="color: #94a3b8; margin: 6px 0 0; font-size: 13px;">Email Delivery Test</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px; color: #334155; line-height: 1.7;">
          <h2 style="color: #0f172a; margin-top: 0;">✅ Resend is Working!</h2>
          <p>This test email confirms that the <strong>Resend API</strong> is correctly configured for TREVOROS LABS.</p>

          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 18px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="color: #475569; padding: 5px 0; width: 100px;">Status</td>
                <td style="font-weight: 700; color: #16a34a;">DELIVERED ✓</td>
              </tr>
              <tr>
                <td style="color: #475569; padding: 5px 0;">Provider</td>
                <td style="font-weight: 600; color: #0f172a;">Resend</td>
              </tr>
              <tr>
                <td style="color: #475569; padding: 5px 0;">Sent at</td>
                <td style="font-weight: 600; color: #0f172a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
              </tr>
            </table>
          </div>

          <p style="color: #64748b; font-size: 13px;">All transactional emails (application confirmations, admin decisions, payment receipts) will be delivered through this channel.</p>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 18px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">© ${new Date().getFullYear()} TREVOROS LABS — Performance-Based Developer Training</p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('❌  Resend error:', error);
    process.exit(1);
  }

  console.log('✅  Email sent successfully!');
  console.log('📨  Message ID :', data?.id);
  console.log('\nCheck inbox at:', TO);
}

main().catch((err) => {
  console.error('💥  Unexpected error:', err);
  process.exit(1);
});
