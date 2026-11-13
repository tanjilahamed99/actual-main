// src/utils/emailTemplate.js

const WEBSITE_LINK = "https://actual-ielts.strixdevs.com"; // ✅ Your website
const WHATSAPP_NUMBER = "+8801625258542";                  // ✅ Your WhatsApp
const WHATSAPP_LINK = "https://wa.me/8801625258542";

const wrapEmail = ({ title, preheader, content }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(22,29,52,0.06); border: 1px solid #e5e7eb;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #161d34; padding: 30px 20px;">
              <a href="${WEBSITE_LINK}" style="text-decoration: none; color: #ffffff;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                  Actual IELTS Questions
                </h1>
              </a>
              <p style="color: #a0aec0; margin: 5px 0 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
                Premium IELTS Preparation
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <!-- WhatsApp Support Section -->
          <tr>
            <td align="center" style="padding: 0 30px 30px 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #4b5563;">
                      Need help? Have a question?
                    </p>
                    <a href="${WHATSAPP_LINK}" style="background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 999px; font-weight: 600; font-size: 14px; text-decoration: none; display: inline-block;">
                      💬 Message us on WhatsApp
                    </a>
                    <p style="margin: 10px 0 0 0; font-size: 13px; color: #6b7280;">
                      or call us at <a href="tel:${WHATSAPP_NUMBER}" style="color: #161d34; font-weight: 600; text-decoration: none;">${WHATSAPP_NUMBER}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fbfaf8; padding: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
                © ${new Date().getFullYear()} Actual IELTS Questions. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                <a href="${WEBSITE_LINK}" style="color: #6b7280; text-decoration: underline;">Visit our website</a> · 
                <a href="${WHATSAPP_LINK}" style="color: #6b7280; text-decoration: underline;">Contact Support</a>
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

// ── 1. Forgot Password ──
exports.getPasswordResetTemplate = (resetUrl, name) => {
  return wrapEmail({
    title: "Reset your password",
    preheader: "Click here to reset your Actual IELTS Questions password.",
    content: `
      <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 700;">Password Reset Request</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        We received a request to reset the password for your account. Click the secure button below to choose a new password.
      </p>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
        <tr>
          <td align="center">
            <a href="${resetUrl}" style="background-color: #d4af37; color: #161d34; padding: 16px 36px; border-radius: 999px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(212,175,55,0.3);">
              Reset My Password
            </a>
          </td>
        </tr>
      </table>

      <p style="color: #6b7280; font-size: 13px; line-height: 1.6; background-color: #fef9c3; padding: 12px; border-radius: 8px; border: 1px solid #fde68a;">
        <strong>Note:</strong> This link is valid for 15 minutes only. If you didn't request this, you can safely ignore this email.
      </p>
    `,
  });
};

// ── 2. Account Approved ──
exports.getAccountApprovedTemplate = (name) => {
  return wrapEmail({
    title: "Account Approved!",
    preheader: "Your account is ready. Start your IELTS practice today.",
    content: `
      <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 700;">Welcome Aboard! 🎉</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        Great news! Your account has been successfully verified and approved by our team. 
      </p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        You now have full access to our archive of <strong>100+ real IELTS reading passages</strong>, writing modules, and built-in Band 9 resources.
      </p>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
        <tr>
          <td align="center">
            <a href="${WEBSITE_LINK}/login" style="background-color: #d4af37; color: #161d34; padding: 16px 36px; border-radius: 999px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(212,175,55,0.3);">
              Start Practicing Now
            </a>
          </td>
        </tr>
      </table>
    `,
  });
};

// ── 3. Account Rejected ──
exports.getAccountRejectedTemplate = (name) => {
  return wrapEmail({
    title: "Account Update",
    preheader: "Update regarding your Actual IELTS Questions account.",
    content: `
      <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 700;">Account Application Update</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        Unfortunately, after reviewing your application, we are unable to approve your account at this time. 
      </p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        If you believe this is a mistake or if you need further clarification, please reach out to our support team directly on WhatsApp.
      </p>
    `,
  });
};

// ── 4. Account Deleted ──
exports.getAccountDeletedTemplate = (name) => {
  return wrapEmail({
    title: "Account Deleted",
    preheader: "Your account has been removed from our system.",
    content: `
      <h2 style="color: #111827; margin-top: 0; font-size: 24px; font-weight: 700;">Account Removed</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        This email is to confirm that your account on Actual IELTS Questions has been permanently deleted by an administrator. You will no longer have access to our platform.
      </p>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        If you have any questions, feel free to contact us on WhatsApp.
      </p>
    `,
  });
};