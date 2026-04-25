"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApplicationSubmittedEmail = sendApplicationSubmittedEmail;
exports.sendApplicationAcceptedEmail = sendApplicationAcceptedEmail;
exports.sendApplicationRejectedEmail = sendApplicationRejectedEmail;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendEnrollmentBatchEmail = sendEnrollmentBatchEmail;
exports.sendCertificateIssuedEmail = sendCertificateIssuedEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || 'TREVOROS LABS <admissions@trevoros.com>';
async function dispatch(to, subject, text, html) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[EMAIL] RESEND_API_KEY not set — email not sent: ' + subject);
        return;
    }
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_ADDRESS,
            to: [to],
            subject,
            text,
            html: wrapEmail(html),
        });
        if (error) {
            console.error('[EMAIL] Resend error: ' + subject, error);
        }
        else {
            console.log('[EMAIL] Sent via Resend: ' + subject + ' -> ' + to + ' (id: ' + data?.id + ')');
        }
    }
    catch (error) {
        console.error('[EMAIL] Failed: ' + subject, error);
    }
}
function getCertPreviewUrl(performance) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    if (performance === 'EXCEPTIONAL')
        return frontendUrl + '/Certificate_Exceptional.png';
    if (performance === 'STRONG')
        return frontendUrl + '/Certificate_strong.png';
    return frontendUrl + '/Certificate_Satisfactory.png';
}
function wrapEmail(body) {
    const year = new Date().getFullYear();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const logoUrl = frontendUrl + '/logo_.png';
    return '<div style="font-family: Segoe UI, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">'
        + '<div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 28px 24px; text-align: center;">'
        + '<img src="' + logoUrl + '" alt="TREVORORS LABS" style="height: 48px; width: auto; display: inline-block;" />'
        + '</div>'
        + '<div style="padding: 32px 24px; color: #334155; line-height: 1.6;">'
        + body
        + '</div>'
        + '<div style="background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">'
        + '<p style="margin: 0;">&copy; ' + year + ' TREVORORS LABS &mdash; Performance-Based Developer Training</p>'
        + '<p style="margin: 4px 0 0;">This is an automated email. Please do not reply.</p>'
        + '</div>'
        + '</div>';
}
function stepsBlock(steps) {
    const items = steps.map(s => '<li style="margin-bottom: 8px;">' + s + '</li>').join('');
    return '<div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">'
        + '<p style="margin: 0 0 12px; font-weight: 600; color: #0f172a;">Next Steps</p>'
        + '<ol style="margin: 0; padding-left: 20px; color: #334155;">' + items + '</ol>'
        + '</div>';
}
function btn(label, href, color = '#0ea5e9') {
    return '<div style="text-align: center; margin: 24px 0;">'
        + '<a href="' + href + '" style="display: inline-block; background: ' + color + '; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">' + label + '</a>'
        + '</div>';
}
// --- 2. Application Submitted ---
async function sendApplicationSubmittedEmail(to, name, track) {
    const trackLabel = track === 'BUILDER' ? 'Builder' : 'Foundation';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const subject = 'Application Received - ' + trackLabel + ' Track';
    const text = 'Hello ' + name + ', we have received your application for the ' + trackLabel + ' Track. We will review it within 48 hours.';
    const html = '<h2 style="color: #0f172a; margin-top: 0;">Application Received</h2>'
        + '<p>Hello <strong>' + name + '</strong>,</p>'
        + '<p>Thank you for applying to TREVORORS LABS! We have received your application for the <strong>' + trackLabel + ' Track</strong>.</p>'
        + '<div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">'
        + '<p style="margin: 0; font-weight: 600; color: #92400e;">Status: <span style="color: #d97706;">PENDING REVIEW</span></p>'
        + '<p style="margin: 8px 0 0; color: #78716c; font-size: 13px;">We review all applications within 48 hours. You will receive an email once a decision is made.</p>'
        + '</div>'
        + stepsBlock([
            'Sit tight - our team is reviewing your application.',
            'You can check your application status anytime on your <strong>Dashboard</strong>.',
            'Once accepted, you will receive a payment link to secure your seat.',
        ])
        + btn('Check Application Status', frontendUrl + '/dashboard');
    await dispatch(to, subject, text, html);
}
// --- 3. Application Accepted ---
async function sendApplicationAcceptedEmail(to, name, track) {
    const trackLabel = track === 'BUILDER' ? 'Builder' : 'Foundation';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const subject = 'Congratulations! You Have Been Accepted - ' + trackLabel + ' Track';
    const text = 'Hello ' + name + ', your application to the ' + trackLabel + ' Track has been accepted. Complete payment to secure your spot.';
    const html = '<h2 style="color: #0f172a; margin-top: 0;">You Are In!</h2>'
        + '<p>Hello <strong>' + name + '</strong>,</p>'
        + '<p>Great news - your application to the <strong>' + trackLabel + ' Track</strong> has been <strong style="color: #16a34a;">ACCEPTED</strong>!</p>'
        + '<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">'
        + '<p style="margin: 0; font-weight: 600; color: #166534;">Status: <span style="color: #16a34a;">ACCEPTED</span></p>'
        + '<p style="margin: 8px 0 0; color: #4b5563; font-size: 13px;">Your seat is reserved! Complete payment to officially enroll.</p>'
        + '</div>'
        + stepsBlock([
            '<strong>Complete your payment</strong> - click the button below or the Pay Now button on your dashboard.',
            'Once payment is confirmed, you will be automatically enrolled in the program.',
            'You will receive a welcome email with your <strong>WhatsApp group link</strong> and onboarding details.',
        ])
        + btn('Complete Payment', frontendUrl + '/payment?track=' + track, '#16a34a')
        + '<p style="color: #64748b; font-size: 13px;">Seats are limited. Please complete your payment as soon as possible.</p>';
    await dispatch(to, subject, text, html);
}
// --- 4. Application Rejected ---
async function sendApplicationRejectedEmail(to, name, track, adminNotes) {
    const trackLabel = track === 'BUILDER' ? 'Builder' : 'Foundation';
    const subject = 'Application Update - ' + trackLabel + ' Track';
    const text = 'Hello ' + name + ', we regret to inform you that your application to the ' + trackLabel + ' Track was not accepted at this time.';
    let notesHtml = '';
    if (adminNotes) {
        notesHtml = '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">'
            + '<p style="margin: 0; font-weight: 600; color: #0f172a;">Reviewer Notes</p>'
            + '<p style="margin: 8px 0 0; color: #475569;">' + adminNotes + '</p>'
            + '</div>';
    }
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const html = '<h2 style="color: #0f172a; margin-top: 0;">Application Update</h2>'
        + '<p>Hello <strong>' + name + '</strong>,</p>'
        + '<p>Thank you for your interest in TREVORORS LABS. After careful review, we were unable to accept your application to the <strong>' + trackLabel + ' Track</strong> at this time.</p>'
        + notesHtml
        + stepsBlock([
            'Do not be discouraged - competition is strong and this does not reflect your potential.',
            'Work on building projects and contributing to open source to strengthen your portfolio.',
            'You are welcome to <strong>re-apply for future cohorts</strong>.',
            'Follow us for announcements on upcoming cohorts and opportunities.',
        ])
        + btn('Back to Dashboard', frontendUrl + '/dashboard')
        + '<p style="color: #64748b; font-size: 13px;">We appreciate your time and interest. Keep building!</p>';
    await dispatch(to, subject, text, html);
}
// --- 5. Payment Confirmation + Welcome ---
async function sendWelcomeEmail(to, name, track) {
    const whatsappLink = track === 'BUILDER'
        ? (process.env.WHATSAPP_BUILDER_URL || 'https://chat.whatsapp.com/invite/BUILDER_DEMO_URL')
        : (process.env.WHATSAPP_FOUNDATION_URL || 'https://chat.whatsapp.com/invite/FOUNDATION_DEMO_URL');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const subject = 'Payment Confirmed - Welcome to TREVORORS LABS!';
    const text = 'Hello ' + name + ', your payment is confirmed and your enrollment is now active. Join our WhatsApp group: ' + whatsappLink;
    const html = '<h2 style="color: #0f172a; margin-top: 0;">Payment Confirmed!</h2>'
        + '<p>Hello <strong>' + name + '</strong>,</p>'
        + '<p>Your payment has been successfully processed and your <strong>enrollment is now active</strong>. Welcome to the TREVORORS LABS family!</p>'
        + '<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">'
        + '<p style="margin: 0; font-weight: 600; color: #166534;">Payment: <span style="color: #16a34a;">COMPLETED</span></p>'
        + '<p style="margin: 4px 0 0; font-weight: 600; color: #166534;">Enrollment: <span style="color: #16a34a;">ACTIVE</span></p>'
        + '</div>'
        + stepsBlock([
            '<strong>Join the WhatsApp group</strong> - connect with your cohort and instructors.',
            'Explore your <strong>Student Dashboard</strong> for program details and progress tracking.',
            'Get ready for <strong>Week 1</strong> - projects, code reviews, and mentorship begin soon.',
            'Your performance will be tracked on the <strong>live leaderboard</strong>.',
        ])
        + '<div style="text-align: center; margin: 24px 0;">'
        + '<a href="' + whatsappLink + '" style="display: inline-block; background: #25D366; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Join WhatsApp Group</a>'
        + '</div>'
        + btn('Open Dashboard', frontendUrl + '/dashboard')
        + '<p>We are excited to see what you build!</p>';
    await dispatch(to, subject, text, html);
}
// --- 6. Enrollment Batch Notification ---
async function sendEnrollmentBatchEmail(to, name, track, batch) {
    const trackLabel = track === 'BUILDER' ? 'Builder' : 'Foundation';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const subject = 'Welcome to TREVORORS LABS — Your Batch Details';
    const formatDate = (d) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(d));
    const batchBlock = batch
        ? '<div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 20px; margin: 20px 0;">'
            + '<p style="margin: 0 0 14px; font-weight: 700; font-size: 15px; color: #0f172a;">📋 Your Batch Details</p>'
            + '<table style="width: 100%; border-collapse: collapse;">'
            + '<tr><td style="padding: 6px 0; color: #475569; font-size: 13px; width: 130px;">Batch Name</td>'
            + '<td style="padding: 6px 0; font-weight: 600; color: #0f172a;">'
            + batch.name + '</td></tr>'
            + '<tr><td style="padding: 6px 0; color: #475569; font-size: 13px;">Track</td>'
            + '<td style="padding: 6px 0; font-weight: 600; color: #0f172a;">'
            + trackLabel + '</td></tr>'
            + '<tr><td style="padding: 6px 0; color: #475569; font-size: 13px;">Start Date</td>'
            + '<td style="padding: 6px 0; font-weight: 600; color: #0f172a;">'
            + formatDate(batch.startDate) + '</td></tr>'
            + '<tr><td style="padding: 6px 0; color: #475569; font-size: 13px;">End Date</td>'
            + '<td style="padding: 6px 0; font-weight: 600; color: #0f172a;">'
            + formatDate(batch.endDate) + '</td></tr>'
            + '</table>'
            + '</div>'
            + '<div style="text-align: center; margin: 24px 0;">'
            + '<a href="' + batch.whatsappLink + '" style="display: inline-block; background: #25D366; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">📱 Join WhatsApp Group</a>'
            + '</div>'
        : '<div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">'
            + '<p style="margin: 0; font-weight: 600; color: #92400e;">Batch Not Yet Assigned</p>'
            + '<p style="margin: 8px 0 0; color: #78716c; font-size: 13px;">Your batch details including the WhatsApp group link will be shared with you shortly by the team.</p>'
            + '</div>';
    const text = batch
        ? 'Hello ' + name + ', you are enrolled in the ' + trackLabel + ' Track. Batch: ' + batch.name + ', Start: ' + formatDate(batch.startDate) + ', End: ' + formatDate(batch.endDate) + '. Join WhatsApp: ' + batch.whatsappLink
        : 'Hello ' + name + ', you are enrolled in the ' + trackLabel + ' Track. Batch details will be shared soon.';
    const html = '<h2 style="color: #0f172a; margin-top: 0;">Enrollment Confirmed! 🎉</h2>'
        + '<p>Hello <strong>' + name + '</strong>,</p>'
        + '<p>You are now enrolled in the <strong>' + trackLabel + ' Track</strong> at TREVORORS LABS. Here are your batch details:</p>'
        + batchBlock
        + stepsBlock([
            'Join the WhatsApp group above to connect with your cohort and instructors.',
            'Visit your <strong>Student Dashboard</strong> to track your progress.',
            'Get ready — <strong>Week 1</strong> begins on your batch start date!',
        ])
        + btn('Open Dashboard', frontendUrl + '/dashboard');
    await dispatch(to, subject, text, html);
}
// --- 7. Certificate Issued ---
async function sendCertificateIssuedEmail(to, name, programName, performance, code) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const previewUrl = getCertPreviewUrl(performance);
    const verifyUrl = frontendUrl + '/verify?code=' + code;
    const performanceLabel = performance.charAt(0) + performance.slice(1).toLowerCase();
    const subject = 'Your TREVORORS LABS Certificate is Ready!';
    const text = 'Hello ' + name + ', congratulations! Your certificate for ' + programName + ' has been issued. Certificate code: ' + code + '. Verify at: ' + verifyUrl;
    const html = '<h2 style="color: #0f172a; margin-top: 0;">Your Certificate is Ready! 🎓</h2>'
        + '<p>Hello <strong>' + name + '</strong>,</p>'
        + '<p>Congratulations on completing the <strong>' + programName + '</strong>! Your performance has been rated <strong>' + performanceLabel + '</strong> by our team.</p>'
        + '<div style="text-align: center; margin: 28px 0;">'
        + '<img src="' + previewUrl + '" alt="' + performanceLabel + ' Certificate Preview" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.15);" />'
        + '</div>'
        + '<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">'
        + '<p style="margin: 0; font-size: 13px; color: #166534;">Certificate Code</p>'
        + '<p style="margin: 6px 0 0; font-family: monospace; font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: 1px;">' + code + '</p>'
        + '</div>'
        + stepsBlock([
            'Click <strong>Verify Certificate</strong> below to view your shareable certificate page.',
            'Share your certificate code on LinkedIn and GitHub to showcase your achievement.',
            'Your certificate is permanently verifiable by employers and recruiters.',
        ])
        + btn('Verify Certificate', verifyUrl, '#0ea5e9')
        + '<p style="color: #64748b; font-size: 13px;">Thank you for your hard work and dedication. We are proud of you!</p>';
    await dispatch(to, subject, text, html);
}
async function sendPasswordResetEmail(to, name, resetUrl) {
    const subject = 'Reset your TREVORORS LABS password';
    const text = `Hi ${name},\n\nYou requested a password reset. Click the link below to set a new password (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.\n\nTREVORORS LABS Team`;
    const html = '<h2>Password Reset</h2>'
        + `<p>Hi <strong>${name}</strong>,</p>`
        + '<p>We received a request to reset your TREVORORS LABS password. Click the button below to choose a new password:</p>'
        + '<p style="color: #64748b; font-size: 0.85rem;">This link is valid for <strong>1 hour</strong> and can only be used once.</p>'
        + btn('Reset My Password', resetUrl)
        + '<p style="color:#94a3b8; font-size:0.8rem; margin-top:24px;">If you did not request this, you can safely ignore this email. Your password will not change.</p>';
    await dispatch(to, subject, text, html);
}
//# sourceMappingURL=email.js.map