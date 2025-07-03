/**
 * FunBase Backend - Express.js entrypoint.
 * Provides REST API for memes (CRUD, like/save), feed, user operations, quotes, and more.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const memeRoutes = require('./routes/memeRoutes');
const userRoutes = require('./routes/userRoutes');
// Suggestions and Favorites
const suggestionRoutes = require('./routes/suggestionRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const funEventRoutes = require('./routes/funEventRoutes'); // <-- Added

const app = express();

app.use(cors());
app.use(express.json());

// PUBLIC_INTERFACE
/**
 * @api {get} /  Health check endpoint
 * @apiName HealthCheck
 * @apiGroup General
 * @apiSuccess {String} message A short status message
 */
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'FunBase API is running 🎉' });
});

// Register resource routes
app.use('/api/memes', memeRoutes);
app.use('/api/users', userRoutes);

// Quotes endpoints
app.use('/api/quotes', quoteRoutes);

// Movie/song suggestions endpoints
app.use('/api/suggestions', suggestionRoutes);
// Favorites endpoints
app.use('/api/favorites', favoriteRoutes);

// Add fun-events endpoints for "What Was Fun Today?/Fun Flashback"/Trending Fun Now (time-travel)
app.use('/fun-events', funEventRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`FunBase backend listening at http://localhost:${PORT}`);
});
