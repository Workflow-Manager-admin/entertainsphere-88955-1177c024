/**
 * suggestionRoutes.js - REST API for Movie and Song Suggestions in FunBase backend.
 * Handles GET endpoints for movies and songs (by mood/genre/random/id).
 */

const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');

// Swagger/OpenAPI tag: Suggestions

// PUBLIC_INTERFACE
/** 
 * Get movie suggestions
 * GET /api/suggestions/movies?mood=&genre=&random=&limit=
 */
router.get('/movies', suggestionController.getMovies);

// PUBLIC_INTERFACE
/**
 * Get a movie by ID
 * GET /api/suggestions/movies/:id
 */
router.get('/movies/:id', suggestionController.getMovieById);

// PUBLIC_INTERFACE
/** 
 * Get song suggestions
 * GET /api/suggestions/songs?mood=&genre=&random=&limit=
 */
router.get('/songs', suggestionController.getSongs);

// PUBLIC_INTERFACE
/**
 * Get a song by ID
 * GET /api/suggestions/songs/:id
 */
router.get('/songs/:id', suggestionController.getSongById);

module.exports = router;
