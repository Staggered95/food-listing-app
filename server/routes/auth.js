// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const db = require('../db');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();
require('dotenv').config();

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: { api_key: process.env.SENDGRID_API_KEY }
}));

// Register a new user (This part was already correct)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExistsCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExistsCheck.rows.length > 0) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // --- THIS IS THE CHANGE (Part 1) ---
        // We now ask the database to return the new user's full details
        const text = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, email, hashedPassword];
        const { rows } = await db.query(text, values);
        const newUser = rows[0];
        
        // --- THIS IS THE CHANGE (Part 2) ---
        // Create a JWT token for the new user immediately
        const token = jwt.sign(
            { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send the token back to the frontend
        res.status(201).json({ token });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // --- THIS IS THE FIX ---
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/google', async (req, res) => {
    const { credential } = req.body;
    try {
        // Verify the token from Google
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { name, email } = payload;

        // Check if user already exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = userCheck.rows[0];

        // If user doesn't exist, create a new one
        if (!user) {
            // For Google sign-ups, we can generate a random secure password
            // as they won't use it to log in directly.
            const randomPassword = require('crypto').randomBytes(16).toString('hex');
            const hashedPassword = await require('bcryptjs').hash(randomPassword, 12);

            const newUserQuery = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
            const newUser = await db.query(newUserQuery, [name, email, hashedPassword, 'user']);
            user = newUser.rows[0];
        }

        // Create your own JWT token to send back to the frontend
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });

    } catch (error) {
        console.error("Google Sign-In Error:", error);
        res.status(400).json({ message: 'Google Sign-In failed.' });
    }
});




router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return res.json({ message: "If an account with that email exists, a reset link has been sent." });
        }
        const user = rows[0];

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(token, 12);
        const expirationDate = new Date(Date.now() + 3600000); // 1 hour from now

        await db.query(
            'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
            [hashedToken, expirationDate, user.id]
        );

        const frontendUrl = process.env.NODE_ENV === 'production' 
            ? 'https://afcfood.in' 
            : 'http://localhost:5173'; // Make sure this is your correct local IP if testing on phone
        const resetUrl = `${frontendUrl}/reset-password/${token}`;
        
        // --- THIS IS THE UPDATED EMAIL TEMPLATE ---
        await transporter.sendMail({
            to: user.email,
            from: process.env.SENDGRID_SENDER_EMAIL,
            subject: 'Password Reset for Allahabadia Food Court',
            html: `
              <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
                  <img src="https://res.cloudinary.com/dezym308g/image/upload/v1754992586/logo_jfcnej.png" alt="Allahabadia Food Court Logo" style="height: 50px; width: auto;"/>
                </div>
                <div style="padding: 20px 0;">
                  <h2 style="color: #4A2A14; text-align: center;">Password Reset Request</h2>
                  <p style="color: #8B6A50;">Hi ${user.name},</p>
                  <p style="color: #8B6A50;">We received a request to reset the password for your account. Please click the button below to set a new password. This link will be valid for one hour.</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #6B3B1B; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
                  </div>
                  <p style="color: #8B6A50;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                </div>
                <div style="text-align: center; font-size: 12px; color: #aaa; padding-top: 20px; border-top: 1px solid #ddd;">
                  <p>Allahabadia Food Court</p>
                  <p>123 Food Street, Prayagraj, Uttar Pradesh</p>
                </div>
              </div>
            `,
        });

        res.json({ message: 'If an account with that email exists, a reset link has been sent. Valid for 1 hour' });
    } catch (error) {
        console.error('Error in forgot password route:', error);
        res.status(500).json({ message: 'Error processing request.' });
    }
});


router.post('/reset-password/:token', async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;

        const { rows } = await db.query('SELECT * FROM users WHERE password_reset_expires > NOW()');
        
        let userToUpdate = null;
        for (const user of rows) {
            if (user.password_reset_token) {
                 const isValid = await bcrypt.compare(token, user.password_reset_token);
                 if (isValid) {
                     userToUpdate = user;
                     break;
                 }
            }
        }
        
        if (!userToUpdate) {
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        await db.query(
            'UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
            [hashedNewPassword, userToUpdate.id]
        );

        res.json({ message: 'Password has been updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
});

module.exports = router;