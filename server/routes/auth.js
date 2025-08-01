// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
require('dotenv').config();

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
        const text = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
        const values = [name, email, hashedPassword];
        const { rows } = await db.query(text, values);
        res.status(201).json({ message: 'User registered successfully', userId: rows[0].id });
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
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;