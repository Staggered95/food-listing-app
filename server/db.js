// server/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Check if the environment is production (Render sets NODE_ENV to 'production')
const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  // Add SSL configuration ONLY when in production
  ssl: isProduction ? { rejectUnauthorized: false } : false
};

const pool = new Pool(connectionConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};