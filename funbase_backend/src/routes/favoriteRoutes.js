/**
 * favoriteRoutes.js - REST API for Favorites management in FunBase backend.
 * Handles add/remove/list favorites for memes/movies/songs per user.
 */

const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Swagger/OpenAPI tag: Favorites

// PUBLIC_INTERFACE
/**
 * Add item to favorites (POST /api/favorites)
 * Body: {user_id, item_type, item_id}
 */
router.post('/', favoriteController.addFavorite);

// PUBLIC_INTERFACE
/**
 * Remove item from favorites (DELETE /api/favorites)
 * Body: {user_id, item_type, item_id}
 */
router.delete('/', favoriteController.removeFavorite);

// PUBLIC_INTERFACE
/**
 * Get all favorites for a user (optionally filtered by item_type)
 * GET /api/favorites?user_id=...&item_type=...
 */
router.get('/', favoriteController.getFavorites);

module.exports = router;
