const nodemailer = require('nodemailer');

function sendApprovalEmail(toEmail, username) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    });

    const mailOptions = {
        from: 'yourcompany@gmail.com',
        to: toEmail,
        subject: 'Your Account Has Been Approved!',
        html: `
            <p>Hi ${username},</p>
            <p>Your account has been approved by our team. You can now log in to the website using your email and password.</p>
            <a href="http://yourdomain.com/login">Click here to login</a>
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending approval email:', err);
        } else {
            console.log('Approval email sent:', info.response);
        }
    });
}
