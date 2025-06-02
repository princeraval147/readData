const transporter = require('./mailer');
require('dotenv').config();

const ShareAPI = async ({ name, email, token }) => {

    const apiUrl = `${process.env.API_URL}`

    const mailOptions = {
        from: '"Platinum Tech" <your-email@example.com>',
        to: email,
        subject: 'Welcome to Platinum Tech – Your API Access Info',
        html: `
                <p>Hello, ${name}!</p>
                <p>Thank you for choosing <strong>Platinum Tech</strong>.</p>

                <h3>🔐 API Access Instructions</h3>
                <p>You can now access your shared diamond stock data via our secure API.</p>

                <ul>
                    <li><strong>API Endpoint:</strong> <code>${apiUrl}</code></li>
                    <li><strong>Authorization:</strong> <code>Bearer ${token}</code></li>
                </ul>

                 <h4>📘 How to Use:</h4>
                <p>Send a GET request to the endpoint above with the following header:</p>

                        <pre><code>
                    GET ${apiUrl}
                    Authorization: Bearer ${token}
                        </code></pre>

                <p>Make sure to include the <code>Authorization</code> header exactly as shown above.</p>

                <hr/>

                <p>If you have any questions, feel free to Contact.</p>
                <p>Visit our website: https://platinumsofttech.com/</p>

                <p>Thanks,<br/>Team Platinum Tech</p>
            `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = ShareAPI;