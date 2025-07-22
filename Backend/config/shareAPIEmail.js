const transporter = require('./mailer');
require('dotenv').config();

const ShareAPI = async ({ name, email, token, username }) => {

  const apiUrl = `${process.env.API_URL}`
  const apiDocsUrl = "https://documenter.getpostman.com/view/46220805/2sB2xECUnL";
  const senderName = username || 'Platinum Tech Team';

  const mailOptions = {
    from: `${senderName} <your-email@example.com>`,
    to: email,
    subject: `Your API Access to Shared Diamond Stock – ${senderName}`,
    html: `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; color: #222; max-width: 600px; margin: auto; line-height: 1.6;">
        <p>Dear ${name},</p>

        <p>We are pleased to inform you that secure API access to the diamond stock platform has been granted by ${senderName}.</p>

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

        <h3 style="color: #0077cc;">For Non-Developers</h3>
        <p>
          Not a developer? No problem. You can still access the shared diamond stock data using your API token — no technical setup required.
        </p>
        <p>
          Simply follow this link and paste the token in the input box:
        </p>
        <p>
          <a href="https://platinumdiam.com/view-stock" target="_blank">https://platinumdiam.com/view-stock</a>
        </p>
        <p>
          When prompted, paste the token below:
        </p>
        <code style="background: #f2f2f2; padding: 6px 10px; display: inline-block; border-radius: 4px; margin: 8px 0;">${token}</code>
        <p>
          You will instantly see the live stock data that has been shared with you.
        </p>
        <br/><br/><br/>


        <p>If you have any questions or require technical support, feel free to contact our team.</p>

        <p>Best regards,<br/>
        <strong>${senderName}</strong><br/>
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