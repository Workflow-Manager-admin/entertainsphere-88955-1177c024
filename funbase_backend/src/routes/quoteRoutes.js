/**
 * quoteRoutes.js - REST API for Quotes in FunBase backend.
 * Handles random, filter, search, like/save, my quotes, submission.
 */

const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");

// Swagger/OpenAPI tag: Quotes

// Note: Aliases for required endpoints
// GET /quotes/random            (get 6 random quotes)
router.get("/random", (req, res) => {
  // Force limit=6 for random
  req.query.limit = 6;
  let { mood, tag, author } = req.query;
  // Prefer mood->tag for compatibility
  if (mood && !tag) req.query.tag = mood;
  // Use existing controller but override limit + random order
  // Reuse getQuotes: add ORDER BY RAND() LIMIT 6 by proxy
  quoteController.getQuotes(
    { ...req, query: { ...req.query, random: '1', limit: 6 } },
    res
  );
});

// GET /quotes?mood=...
router.get("/", (req, res, next) => {
  // Alias mood to tag for compatibility
  if (req.query.mood && !req.query.tag) req.query.tag = req.query.mood;
  if (req.query.random) delete req.query.random; // Defensive: filtered comes here
  quoteController.getQuotes(req, res, next);
});

// GET /quotes/search?text=my+search
router.get("/search", (req, res, next) => {
  // Search by free text (in text or author)
  req.query.search = req.query.text || req.query.q || req.query.search || "";
  quoteController.getQuotes(req, res, next);
});

// POST /quotes/like, /quotes/save   { user_id, quote_id }
router.post("/like", (req, res) => {
  const id = req.body.quote_id || req.body.id; // support both keys
  if (!id) return res.status(400).json({ error: "quote_id required" });
  // Proxy to controller using param
  req.params = { id: id };
  quoteController.likeQuote(req, res);
});
router.post("/save", (req, res) => {
  // alias for like
  const id = req.body.quote_id || req.body.id;
  if (!id) return res.status(400).json({ error: "quote_id required" });
  req.params = { id: id };
  quoteController.likeQuote(req, res);
});

// POST /quotes (user submission)
router.post("/", quoteController.submitQuote);

// GET /user/saved?user_id=123
router.get(/^\/user\/saved$/, (req, res) => {
  // Pass through
  quoteController.getUserSavedQuotes(req, res);
});

// Retain legacy endpoints for full API:
router.get("/saved", quoteController.getUserSavedQuotes);
router.post("/:id/like", quoteController.likeQuote);
router.post("/:id/unlike", quoteController.unlikeQuote);
router.get("/by", quoteController.getQuotesByAuthor);

module.exports = router;
