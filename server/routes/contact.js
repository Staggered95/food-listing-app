// server/routes/contact.js
const express = require('express');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const router = express.Router();
require('dotenv').config();

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: { api_key: process.env.SENDGRID_API_KEY }
}));

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        await transporter.sendMail({
            to: process.env.ADMIN_EMAIL, // The email you want to receive messages at
            from: process.env.SENDGRID_SENDER_EMAIL, // Your verified sender
            subject: `New Contact Message from ${name}`,
            replyTo: email, // Set the reply-to field to the user's email
            html: `
                <p>You have a new message from your website's contact form.</p>
                <h3>Details:</h3>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                </ul>
                <h3>Message:</h3>
                <p>${message}</p>
            `
        });
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ message: 'Failed to send message.' });
    }
});

module.exports = router;