// index.js
const express = require('express');
const app = express();
const corsOptions = {
    origin: 'https://food-listing-app-eta.vercel.app/', // IMPORTANT: Use your actual Vercel URL here
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
require('dotenv').config();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const wishlistRoutes = require('./routes/wishlist');
const subImageRoutes = require('./routes/subImages');
const aiRoutes = require('./routes/ai');



// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // To parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/subimages', subImageRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));