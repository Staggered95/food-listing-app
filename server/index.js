// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const wishlistRoutes = require('./routes/wishlist');
const subImageRoutes = require('./routes/subImages');
const aiRoutes = require('./routes/ai');

const app = express();

// --- Middleware Configuration ---
const corsOptions = {
  // Remove the trailing slash for an exact match
  origin: 'https://food-listing-app-eta.vercel.app', 
  optionsSuccessStatus: 200
};

// Use your specific CORS options here
app.use(cors(corsOptions));

// This is the only other middleware needed
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/subimages', subImageRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));