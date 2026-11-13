// src/utils/emailTemplate.js

/**
 * A reusable, responsive HTML email wrapper.
 * Uses inline styles and tables (safe for Gmail, Outlook, Apple Mail).
 */
const wrapEmail = ({ title, preheader, content }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader text (shows in inbox preview) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(22,29,52,0.05);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #161d34; padding: 24px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">
                Actual IELTS Questions
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fbfaf8; padding: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} Actual IELTS Questions. All rights reserved.
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── Forgot Password Email ──
exports.getPasswordResetTemplate = (resetUrl, name) => {
  return wrapEmail({
    title: "Reset your password",
    preheader: "Here is the link you requested to reset your password.",
    content: `
      <h2 style="color: #111827; margin-top: 0; font-size: 22px;">Reset your password</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        We received a request to reset the password for your Actual IELTS Questions account. Click the button below to choose a new password.
      </p>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
        <tr>
          <td align="center">
            <a href="${resetUrl}" style="background-color: #d4af37; color: #161d34; padding: 14px 32px; border-radius: 999px; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-block;">
              Reset Password
            </a>
          </td>
        </tr>
      </table>

      <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
        This link will expire in 15 minutes. If you didn't request a password reset, no further action is required.
      </p>
    `,
  });
};

// ── Account Approved Email ──
exports.getAccountApprovedTemplate = (loginUrl, name) => {
  return wrapEmail({
    title: "Account Approved",
    preheader: "Your account is now approved. You can start practicing!",
    content: `
      <h2 style="color: #111827; margin-top: 0; font-size: 22px;">Welcome to the platform! 🎉</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        Great news! Your account has been successfully approved by our team. You can now log in and start practicing with our 100+ real IELTS reading passages and writing modules.
      </p>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
        <tr>
          <td align="center">
            <a href="${loginUrl}" style="background-color: #d4af37; color: #161d34; padding: 14px 32px; border-radius: 999px; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-block;">
              Start Practicing
            </a>
          </td>
        </tr>
      </table>
    `,
  });
};

// ── User Updated/Deleted Emails ──
exports.getUserStatusTemplate = (title, message, name) => {
  return wrapEmail({
    title,
    preheader: message,
    content: `
      <h2 style="color: #111827; margin-top: 0; font-size: 22px;">${title}</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">${message}</p>
    `,
  });
};