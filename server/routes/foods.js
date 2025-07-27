// server/routes/foods.js
const express = require('express');
const db = require('../db');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Use the Cloudinary SDK
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// --- Cloudinary Configuration ---
// The SDK will automatically use the environment variables we set
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer Configuration ---
// We still use memoryStorage to handle the file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// --- End Configurations ---

// Get all food items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM foods');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single food item with its sub-images
router.get('/:id', async (req, res) => {
    try {
        // Use Promise.all to fetch main food data and sub-images in parallel
        const [foodPromise, subImagesPromise] = await Promise.all([
            db.query('SELECT * FROM foods WHERE id = ?', [req.params.id]),
            db.query('SELECT * FROM subImages WHERE food_id = ?', [req.params.id])
        ]);

        const foodRows = foodPromise[0];
        const subImagesRows = subImagesPromise[0];

        if (foodRows.length > 0) {
            const foodItem = foodRows[0];
            foodItem.subImages = subImagesRows; // Attach sub-images to the food item object
            res.json(foodItem);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


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



// Admin: Add a new food item with main image and sub-images
router.post('/', protect, admin, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
]), async (req, res) => {
    
    if (!req.files || !req.files.mainImage) {
        return res.status(400).json({ message: 'Main image is required' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const mainImageResult = await uploadToCloudinary(req.files.mainImage[0].buffer);
        const mainImageUrl = mainImageResult.secure_url;

        // --- CHANGED: Get the new field from the request body ---
        const { name, category, type, price, description, hindiDescription } = req.body;
        
        const [result] = await connection.query(
            // --- CHANGED: Add the new column to the INSERT statement ---
            'INSERT INTO foods (name, category, type, price, description, description_hindi, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
            // --- CHANGED: Add the new variable to the parameters array ---
            [name, category, type, price, description, hindiDescription, mainImageUrl]
        );
        const foodId = result.insertId;

        if (req.files.subImages) {
            for (const file of req.files.subImages) {
                const subImageResult = await uploadToCloudinary(file.buffer);
                await connection.query(
                    'INSERT INTO subImages (food_id, image_url) VALUES (?, ?)',
                    [foodId, subImageResult.secure_url]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ message: 'Food item and images created successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('Error creating food item:', error);
        res.status(500).json({ message: 'Failed to create item' });
    } finally {
        connection.release();
    }
});


router.put('/:id', protect, admin, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
]), async (req, res) => {
    const foodId = req.params.id;
    let mainImageUrl = req.body.imageUrl;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        if (req.files && req.files.mainImage) {
            const mainImageResult = await uploadToCloudinary(req.files.mainImage[0].buffer);
            mainImageUrl = mainImageResult.secure_url;
        }

        if (req.files && req.files.subImages) {
            for (const file of req.files.subImages) {
                const subImageResult = await uploadToCloudinary(file.buffer);
                await connection.query(
                    'INSERT INTO subImages (food_id, image_url) VALUES (?, ?)',
                    [foodId, subImageResult.secure_url]
                );
            }
        }

        // --- CHANGED: Get the new field from the request body ---
        const { name, category, type, price, description, hindiDescription } = req.body;
        
        await connection.query(
            // --- CHANGED: Add the new column to the UPDATE statement ---
            'UPDATE foods SET name = ?, category = ?, type = ?, price = ?, description = ?, description_hindi = ?, imageUrl = ? WHERE id = ?',
            // --- CHANGED: Add the new variable to the parameters array ---
            [name, category, type, price, description, hindiDescription, mainImageUrl, foodId]
        );

        await connection.commit();
        res.json({ message: 'Food item updated successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('Error updating food item:', error);
        res.status(500).json({ message: 'Failed to update item' });
    } finally {
        connection.release();
    }
});


// Admin: Delete a food item
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await db.query('DELETE FROM foods WHERE id = ?', [req.params.id]);
        res.json({ message: 'Food item removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;