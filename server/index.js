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
const contactRoutes = require('./routes/contact');

const app = express();

// Use this simplified CORS block
const corsOptions = {
  origin: ['https://food-listing-app-eta.vercel.app', 'http://localhost:5173', 'http://10.18.79.226:5173', 'https://afcfood.in'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// This is the only other middleware needed
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/subimages', subImageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
