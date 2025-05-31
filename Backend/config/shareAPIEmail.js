const transporter = require('./mailer');
require('dotenv').config();

const ShareAPI = async ({ name, email, token }) => {

    const apiUrl = `${process.env.APP_URL}/get-diamondstock`

    const mailOptions = {
        from: '"Platinum Tech" <your-email@example.com>',
        to: email,
        subject: 'Welcome to Platinum Tech – Your API Access Info',
        html: `
                <p>Hello, ${name}!</p>

                <p>Thanks for trying <strong>Platinum Tech</strong>.</p>

                <h3>API Access Details</h3>
                <p>Here’s your API integration information:</p>

                <ul>
                    <li><strong>API Endpoint:</strong> <code>${apiUrl}</code></li>
                    <li><strong>API Key:</strong> <code>${token}</code></li>
                </ul>

                <p>If you have any questions, feel free to Contact.</p>
                <p>Visit our website: https://platinumsofttech.com/</p>

                <p>Thanks,<br/>Team Platinum Tech</p>
            `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = ShareAPI;