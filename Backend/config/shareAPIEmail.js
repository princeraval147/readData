const transporter = require('./mailer');
require('dotenv').config();

const ShareAPI = async ({ name, email, token }) => {

    const apiUrl = `${process.env.API_URL}`

    const mailOptions = {
        from: '"Platinum Tech" <your-email@example.com>',
        to: email,
        subject: 'Your API Access to Shared Diamond Stock – Platinum Tech',
        //         html: `
        // <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        //     <h2 style="color: #1e88e5;">💎 Shared Diamond Stock API Access</h2>

        //     <p>Hi ${name},</p>

        //     <p>You’ve been granted secure API access to shared diamond stock data via <strong>Platinum Tech</strong>.</p>

        //     <h3 style="margin-top: 24px; color: #1e88e5;">🔗 API Endpoint</h3>
        //     <code style="background: #f4f4f4; padding: 8px; display: block; border-radius: 6px;">
        //         GET ${apiUrl}
        //     </code>

        //     <h3 style="margin-top: 24px; color: #1e88e5;">🔐 Authentication</h3>
        //     <p>Use the following HTTP header for authentication:</p>
        //     <pre style="background: #f4f4f4; padding: 12px; border-radius: 6px;">
        // Authorization: Bearer ${token}
        //     </pre>

        //     <h3 style="margin-top: 24px; color: #1e88e5;">📥 Sample Request (using fetch)</h3>
        //     <pre style="background: #f4f4f4; padding: 12px; border-radius: 6px;">
        // fetch("${apiUrl}", {
        //     method: "GET",
        //     headers: {
        //         "Authorization": "Bearer ${token}"
        //     }
        // })
        // .then(res => res.json())
        // .then(data => console.log(data));
        //     </pre>

        //     <h3 style="margin-top: 24px; color: #1e88e5;">✅ Sample Response</h3>
        //     <pre style="background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto;">
        // {
        //     "success": true,
        //     "data": [
        //         {
        //             "stock_id": "D123456",
        //             "shape": "Round",
        //             "carat": 1.02,
        //             "color": "E",
        //             "clarity": "VS1",
        //             ...
        //         }
        //     ]
        // }
        //     </pre>

        //     <h3 style="margin-top: 24px; color: #1e88e5;">❌ Error Response</h3>
        //     <pre style="background: #f4f4f4; padding: 12px; border-radius: 6px;">
        // {
        //     "success": false,
        //     "error": "Invalid or expired token"
        // }
        //     </pre>

        //     <p style="margin-top: 24px;"><strong>🔒 Keep your token safe and do not share it.</strong></p>

        //     <hr style="margin: 30px 0;" />

        //     <p>If you need help integrating this API or have questions, please reach out.</p>
        //     <p>🌐 <a href="https://platinumsofttech.com" target="_blank">Visit Platinum Tech</a></p>

        //     <p>Best regards,<br/>
        //     <strong>Team Platinum Tech</strong></p>
        // </div>
        // `

        html: `
         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <p>Hi ${name},</p>

                <p>You've been granted secure access to diamond stock shared via <strong>Platinum Tech</strong>.</p>

                <h3 style="color: #1e88e5;">🔐 API Access Details</h3>
                <ul>
                    <li><strong>API Endpoint:</strong> <code>${apiUrl}</code></li>
                    <li><strong>Authorization Header:</strong> <code>Bearer ${token}</code></li>
                </ul>

                <h4 style="margin-top: 20px;">📘 How to Use:</h4>
                <p>To retrieve the stock data, send a <strong>GET</strong> request to the above endpoint using the following HTTP header:</p>

                <pre style="background: #f4f4f4; padding: 12px; border-radius: 6px;">
                        GET ${apiUrl}
                        Authorization: Bearer ${token}
                </pre>

                <p><strong>Please keep your token confidential.</strong> This token provides direct access to the shared data.</p>

                <hr style="margin: 30px 0;" />

                <p>If you need help integrating this API or have any questions, feel free to reach out.</p>
                <p>🔗 <a href="https://platinumsofttech.com" target="_blank">Visit our website</a></p>

                <p>Best regards,<br/>
                <strong>Team Platinum Tech</strong><br/>
                </p>
            </div>
            `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = ShareAPI;