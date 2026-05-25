import nodemailer from 'nodemailer';

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function mailFrom(): string {
  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim();
  return `"ACLP" <${from ?? 'noreply@localhost'}>`;
}

export async function sendPasswordResetEmail(
  to: string,
  displayName: string,
  resetUrl: string
): Promise<boolean> {
  if (!isSmtpConfigured()) {
    console.info('[auth] SMTP not configured — password reset link (dev only):', resetUrl);
    return false;
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: mailFrom(),
    to,
    subject: 'Reset your ACLP password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
        <h2 style="margin-bottom: 8px;">Hi ${displayName},</h2>
        <p style="line-height: 1.5;">We received a request to reset your password. This link expires in one hour.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}"
             style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Reset password
          </a>
        </p>
        <p style="font-size: 13px; color: #666; line-height: 1.5;">
          If you did not request this, you can ignore this email. Your password will not change.
        </p>
        <p style="font-size: 12px; color: #999; word-break: break-all;">${resetUrl}</p>
      </div>
    `,
    text: `Reset your ACLP password\n\nOpen this link (expires in 1 hour):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
  });
  return true;
}
