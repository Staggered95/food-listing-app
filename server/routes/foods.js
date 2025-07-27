// server/routes/foods.js
const express = require('express');
const db = require('../db'); // This is your pg pool
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer Configuration ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload a file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "yumyard" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

// Get all food items
router.get('/', async (req, res) => {
    try {
        // CORRECTED: Use { rows }
        const { rows } = await db.query('SELECT id, name, category, type, price, description, description_hindi, imageurl AS "imageUrl" FROM foods');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single food item with its sub-images
router.get('/:id', async (req, res) => {
    try {
        // CORRECTED: Use result.rows for each promise
        const foodPromise = db.query('SELECT id, name, category, type, price, description, description_hindi, imageurl AS "imageUrl" FROM foods WHERE id = $1', [req.params.id]);
        const subImagesPromise = db.query('SELECT * FROM subImages WHERE food_id = $1', [req.params.id]);

        const [foodResult, subImagesResult] = await Promise.all([foodPromise, subImagesPromise]);

        if (foodResult.rows.length > 0) {
            const foodItem = foodResult.rows[0];
            foodItem.subImages = subImagesResult.rows;
            res.json(foodItem);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Add a new food item with main image and sub-images
router.post('/', protect, admin, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
]), async (req, res) => {
    if (!req.files || !req.files.mainImage) {
        return res.status(400).json({ message: 'Main image is required' });
    }

    // CORRECTED: PostgreSQL transaction logic
    const client = await db.query('BEGIN');

    try {
        const mainImageResult = await uploadToCloudinary(req.files.mainImage[0].buffer);
        const mainImageUrl = mainImageResult.secure_url;

        const { name, category, type, price, description, hindiDescription } = req.body;
        
        const insertFoodQuery = 'INSERT INTO foods (name, category, type, price, description, description_hindi, imageurl) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
        const foodValues = [name, category, type, price, description, hindiDescription, mainImageUrl];
        const newFood = await db.query(insertFoodQuery, foodValues);
        const foodId = newFood.rows[0].id; // CORRECTED: Get new ID from result.rows[0].id

        if (req.files.subImages) {
            for (const file of req.files.subImages) {
                const subImageResult = await uploadToCloudinary(file.buffer);
                await db.query(
                    'INSERT INTO subImages (food_id, image_url) VALUES ($1, $2)',
                    [foodId, subImageResult.secure_url]
                );
            }
        }

        await db.query('COMMIT');
        res.status(201).json({ message: 'Food item and images created successfully' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error creating food item:', error);
        res.status(500).json({ message: 'Failed to create item' });
    }
});

// Admin: Update a food item
router.put('/:id', protect, admin, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
]), async (req, res) => {
    const foodId = req.params.id;
    let mainImageUrl = req.body.imageUrl;

    // CORRECTED: PostgreSQL transaction logic
    const client = await db.query('BEGIN');
    try {
        if (req.files && req.files.mainImage) {
            const mainImageResult = await uploadToCloudinary(req.files.mainImage[0].buffer);
            mainImageUrl = mainImageResult.secure_url;
        }

        if (req.files && req.files.subImages) {
            for (const file of req.files.subImages) {
                const subImageResult = await uploadToCloudinary(file.buffer);
                await db.query(
                    'INSERT INTO subImages (food_id, image_url) VALUES ($1, $2)',
                    [foodId, subImageResult.secure_url]
                );
            }
        }

        const { name, category, type, price, description, hindiDescription } = req.body;
        await db.query(
            'UPDATE foods SET name = $1, category = $2, type = $3, price = $4, description = $5, description_hindi = $6, imageurl = $7 WHERE id = $8',
            [name, category, type, price, description, hindiDescription, mainImageUrl, foodId]
        );

        await db.query('COMMIT');
        res.json({ message: 'Food item updated successfully' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error updating food item:', error);
        res.status(500).json({ message: 'Failed to update item' });
    }
});

// Admin: Delete a food item
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await db.query('DELETE FROM foods WHERE id = $1', [req.params.id]);
        res.json({ message: 'Food item removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;