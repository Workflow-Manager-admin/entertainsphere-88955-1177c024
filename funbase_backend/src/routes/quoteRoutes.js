/**
 * quoteRoutes.js - REST API for Quotes in FunBase backend.
 * Handles random, filter, search, like/save, my quotes, submission.
 */

const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");

// Swagger/OpenAPI tag: Quotes

// PUBLIC_INTERFACE
/** Get a random quote (optionally filtered)
 * GET /api/quotes/random?tag=...&author=...
 */
router.get("/random", quoteController.getRandomQuote);

// PUBLIC_INTERFACE
/** Get quotes by filter/search
 * GET /api/quotes?tag=...&author=...&search=...
 */
router.get("/", quoteController.getQuotes);

// PUBLIC_INTERFACE
/** Like (save) a quote for current user
 * POST /api/quotes/:id/like
 * Body: { user_id }
 */
router.post("/:id/like", quoteController.likeQuote);

// PUBLIC_INTERFACE
/** Unlike (unsave) a quote for user
 * POST /api/quotes/:id/unlike
 * Body: { user_id }
 */
router.post("/:id/unlike", quoteController.unlikeQuote);

// PUBLIC_INTERFACE
/** Get user's saved (liked) quotes
 * GET /api/quotes/saved?user_id=...
 */
router.get("/saved", quoteController.getUserSavedQuotes);

// PUBLIC_INTERFACE
/** Submit a new quote
 * POST /api/quotes
 * Body: { text, author, tags }
 */
router.post("/", quoteController.submitQuote);

// PUBLIC_INTERFACE
/** Get all quotes by an author
 * GET /api/quotes/by?author=...
 */
router.get("/by", quoteController.getQuotesByAuthor);

module.exports = router;
