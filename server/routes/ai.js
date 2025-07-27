// server/routes/ai.js
const express = require('express');
const axios = require('axios');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

router.post('/generate-description', protect, admin, async (req, res) => {
    const { name, category, type, description } = req.body;

    if (!name || !category || !type) {
        return res.status(400).json({ message: 'Name, category, and type are required' });
    }

    try {
        // --- Step 1: Generate English Description ---
        const generationPrompt = `Generate an appealing menu description for a food item. Be creative and appetizing. Give only one result, no options. Mind the Notes if given

        Item Details:
        - Name: ${name}
        - Category: ${category}
        - Type: ${type}
        
        Note: ${description || 'No note provided'}`;
        
        const genResponse = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: generationPrompt }] }],
        });
        const englishDescription = genResponse.data.candidates[0].content.parts[0].text.trim();

        // --- Step 2: Translate English Description to Hindi ---
        const translationPrompt = `Translate the following English text to Hindi. There should not be even one word in english, not even your suggestions:\n\n${englishDescription}`;
        
        const transResponse = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: translationPrompt }] }],
        });
        const hindiDescription = transResponse.data.candidates[0].content.parts[0].text.trim();
        
        // --- Step 3: Send Both Descriptions Back to the Frontend ---
        res.json({ englishDescription, hindiDescription });

    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to generate AI description' });
    }
});

module.exports = router;