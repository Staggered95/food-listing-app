// server/routes/wishlist.js
const express = require('express');
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get user's wishlist
router.get('/', protect, async (req, res) => {
    try {
        // --- THIS IS THE FIX ---
        // Change `const [rows]` to `const { rows }`
        const { rows } = await db.query('SELECT food_id FROM wishlists WHERE user_id = $1', [req.user.id]);
        
        res.json(rows.map(row => row.food_id));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to wishlist (This route was already correct)
router.post('/', protect, async (req, res) => {
    const { foodId } = req.body;
    try {
        await db.query('INSERT INTO wishlists (user_id, food_id) VALUES ($1, $2)', [req.user.id, foodId]);
        res.status(201).json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Remove from wishlist (This route was already correct)
router.delete('/:foodId', protect, async (req, res) => {
    try {
        await db.query('DELETE FROM wishlists WHERE user_id = $1 AND food_id = $2', [req.user.id, req.params.foodId]);
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;