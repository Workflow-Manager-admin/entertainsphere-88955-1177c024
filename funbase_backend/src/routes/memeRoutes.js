/**
 * Memes REST API routes for FunBase backend.
 * Handles memes CRUD, like/save actions, and feed retrieval.
 */
const express = require('express');
const router = express.Router();
const memeController = require('../controllers/memeController');

// Swagger/OpenAPI tag: Memes

// PUBLIC_INTERFACE
/**
 * Create a new meme entry (POST /api/memes)
 */
router.post('/', memeController.createMeme);

// PUBLIC_INTERFACE
/**
 * Get all memes (feed) or by query (GET /api/memes?user_id=...)
 */
router.get('/', memeController.getMemes);

// PUBLIC_INTERFACE
/**
 * Get a meme by ID (GET /api/memes/:id)
 */
router.get('/:id', memeController.getMemeById);

// PUBLIC_INTERFACE
/**
 * Update meme (PUT /api/memes/:id) -- Only meme owner
 */
router.put('/:id', memeController.updateMeme);

// PUBLIC_INTERFACE
/**
 * Delete meme (DELETE /api/memes/:id) -- Only meme owner
 */
router.delete('/:id', memeController.deleteMeme);

// PUBLIC_INTERFACE
/**
 * Like a meme (POST /api/memes/:id/like)
 */
router.post('/:id/like', memeController.likeMeme);

// PUBLIC_INTERFACE
/**
 * Remove like (POST /api/memes/:id/unlike)
 */
router.post('/:id/unlike', memeController.unlikeMeme);

// PUBLIC_INTERFACE
/**
 * Save a meme (POST /api/memes/:id/save)
 */
router.post('/:id/save', memeController.saveMeme);

// PUBLIC_INTERFACE
/**
 * Remove save (POST /api/memes/:id/unsave)
 */
router.post('/:id/unsave', memeController.unsaveMeme);

module.exports = router;
