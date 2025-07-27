// server/routes/subImages.js
const express = require('express');
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Delete a sub-image
// @route   DELETE /api/subimages/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM subImages WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sub-image not found' });
        }

        res.json({ message: 'Sub-image removed successfully' });
    } catch (error) {
        console.error('Error deleting sub-image:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;