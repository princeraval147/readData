const transporter = require('./mailer');
require('dotenv').config();

const ShareAPI = async ({ name, email, token }) => {

  const apiUrl = `${process.env.API_URL}`
  const apiDocsUrl = "https://documenter.getpostman.com/view/46220805/2sB2xECUnL";

  const mailOptions = {
    from: '"Platinum Tech" <your-email@example.com>',
    to: email,
    subject: 'Your API Access to Shared Diamond Stock – Platinum Tech',
    html: `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; color: #222; max-width: 600px; margin: auto; line-height: 1.6;">
        <div style="border-bottom: 3px solid #0077cc; padding-bottom: 12px; margin-bottom: 24px;">
          <h2 style="color: #0077cc;">Platinum Tech</h2>
        </div>

        <p>Dear ${name},</p>

        <p>We are pleased to inform you that secure API access to the diamond stock platform has been granted.</p>

        <h3 style="color: #0077cc;">API Credentials</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Base URL:</strong> <a href="${apiUrl}" target="_blank" style="color: #0077cc;">${apiUrl}</a></li>
          <li><strong>Access Token:</strong> <code style="background: #f2f2f2; padding: 4px 8px; border-radius: 4px;">Bearer ${token}</code></li>
        </ul>

        <p>For detailed endpoint references, authentication guidelines, and request structure, please refer to the API documentation below:</p>

        <p><a href="${apiDocsUrl}" target="_blank" style="display: inline-block; background: #0077cc; color: #fff; padding: 10px 18px; border-radius: 4px; text-decoration: none;">View API Documentation</a></p>

        <p style="margin-top: 24px; font-size: 0.95rem;">
          Please keep your API credentials confidential. Unauthorized sharing or misuse of the token is strictly prohibited.
        </p>

        <p>If you have any questions or require technical support, feel free to contact our team.</p>

        <p>Best regards,<br/>
        <strong>Platinum Tech Team</strong><br/>
        <a href="https://platinumsofttech.com" style="color: #0077cc;" target="_blank">www.platinumsofttech.com</a></p>

        <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 0.8rem; color: #777;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = ShareAPI;