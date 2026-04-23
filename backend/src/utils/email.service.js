import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const transportConfig = env.smtpService
    ? {
        service: env.smtpService,
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass,
        },
      }
    : {
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass,
        },
      };

  transporter = nodemailer.createTransport(transportConfig);

  return transporter;
}

/**
 * Send a 6-digit OTP email.
 * @param {string} to — recipient email
 * @param {string} otp — the plaintext OTP (6 digits)
 * @param {"email_verify"|"password_reset"} purpose
 */
export async function sendOtpEmail(to, otp, purpose) {
  const isVerify = purpose === "email_verify";
  const subject = isVerify
    ? "Verify your email — Alumni Sangham"
    : "Reset your password — Alumni Sangham";

  const heading = isVerify ? "Email Verification" : "Password Reset";
  const instruction = isVerify
    ? "Use the code below to verify your email address and complete your registration."
    : "Use the code below to reset your password. This code expires in 10 minutes.";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background-color:#0f0e17;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0e17;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1925;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
              <tr>
                <td style="padding:40px 36px 24px;">
                  <div style="font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#6C63FF;margin-bottom:16px;">
                    Alumni Sangham
                  </div>
                  <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#E8E6F0;">
                    ${heading}
                  </h1>
                  <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:#9694A8;">
                    ${instruction}
                  </p>
                  <div style="background-color:#0f0e17;border:1px solid #2A2940;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
                    <span style="font-size:32px;font-weight:800;letter-spacing:12px;color:#E8E6F0;font-family:monospace;">
                      ${otp}
                    </span>
                  </div>
                  <p style="margin:0 0 8px;font-size:13px;color:#5D5B71;">
                    This code expires in <strong style="color:#9694A8;">10 minutes</strong>.
                  </p>
                  <p style="margin:0;font-size:13px;color:#5D5B71;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 36px;border-top:1px solid #2A2940;">
                  <p style="margin:0;font-size:11px;color:#5D5B71;">
                    © ${new Date().getFullYear()} Alumni Sangham · IIT Patna
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

  const mailOptions = {
    from: env.smtpFrom
      ? `"${env.smtpFromName}" <${env.smtpFrom}>`
      : `"${env.smtpFromName}" <${env.smtpUser}>`,
    to,
    subject,
    html,
  };

  await getTransporter().sendMail(mailOptions);
}

/**
 * Send a referral-accepted notification email.
 * @param {string} to — recipient (requester) email
 * @param {string} requesterName
 * @param {string} alumniName
 * @param {string} alumniCompany
 * @param {string} targetRole
 * @param {string|null} responseNote — optional alumni message (may contain referral code)
 */
export async function sendReferralAcceptedEmail(to, requesterName, alumniName, alumniCompany, targetRole, responseNote) {
  const subject = "Your referral request was accepted! — Alumni Sangham";
  const firstName = (requesterName || "there").split(/\s+/)[0];

  const noteBlock = responseNote
    ? `
      <div style="margin-top:20px;background-color:#0f0e17;border:1px solid #2A2940;border-radius:12px;padding:16px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6C63FF;margin-bottom:8px;">
          Note from ${alumniName.split(/\s+/)[0]}
        </div>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#E8E6F0;">${responseNote.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}</p>
      </div>
    `
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background-color:#0f0e17;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0e17;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1925;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
              <tr>
                <td style="padding:40px 36px 24px;">
                  <div style="font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#6C63FF;margin-bottom:16px;">
                    Alumni Sangham
                  </div>
                  <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#E8E6F0;">
                    Referral Accepted 🎉
                  </h1>
                  <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#9694A8;">
                    Hi ${firstName}, great news! Your referral request has been accepted.
                  </p>
                  <div style="background-color:#0f0e17;border:1px solid #2A2940;border-radius:12px;padding:20px;margin-bottom:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#5D5B71;">Alumni</td>
                        <td style="padding:4px 0;font-size:13px;font-weight:600;color:#E8E6F0;text-align:right;">${alumniName}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#5D5B71;">Company</td>
                        <td style="padding:4px 0;font-size:13px;font-weight:600;color:#E8E6F0;text-align:right;">${alumniCompany}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#5D5B71;">Target Role</td>
                        <td style="padding:4px 0;font-size:13px;font-weight:600;color:#E8E6F0;text-align:right;">${targetRole}</td>
                      </tr>
                    </table>
                  </div>
                  ${noteBlock}
                  <p style="margin:24px 0 8px;font-size:13px;color:#5D5B71;">
                    The alumni may reach out to you directly. Keep your profile and resume up to date.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 36px;border-top:1px solid #2A2940;">
                  <p style="margin:0;font-size:11px;color:#5D5B71;">
                    © ${new Date().getFullYear()} Alumni Sangham · IIT Patna
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

  const mailOptions = {
    from: env.smtpFrom
      ? `"${env.smtpFromName}" <${env.smtpFrom}>`
      : `"${env.smtpFromName}" <${env.smtpUser}>`,
    to,
    subject,
    html,
  };

  await getTransporter().sendMail(mailOptions);
}
