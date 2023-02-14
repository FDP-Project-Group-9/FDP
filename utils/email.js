const nodemailer = require('nodemailer');
require('dotenv').config();

exports.emailGenerator = (adminEmails, subject, content, attachments) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_SENDER_EMAILID,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const message = {
        to: adminEmails,
        from: process.env.MAIL_SENDER_EMAILID,
        subject: subject,
        html: content, 
        attachments: attachments
    };
    console.log("Sending email...");
    transporter.sendMail(message)
    .then(res => {
        console.log('email sent successfully!!');
    })
    .catch(err => {
        console.log(err);
        console.log("Couldn't send email!");
    });
};