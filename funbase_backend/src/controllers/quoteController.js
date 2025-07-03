//
// quoteController.js
//
// Controller for managing Quotes in FunBase backend
// Includes endpoints for random, filtered, searched quotes, like/save, my quotes, and user submissions.
//

const { getPool } = require("../db");

// Helper: parse JSON tags safely
function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    return typeof tags === "string" ? JSON.parse(tags) : tags;
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
/**
 * Get a random quote (optionally filtered by tag or author)
 * GET /api/quotes/random?tag=motivation&author=Yoda
 */
exports.getRandomQuote = async (req, res) => {
  const { tag, author } = req.query;
  let sql = "SELECT * FROM quotes";
  const where = [];
  const params = [];
  if (tag) {
    where.push("JSON_CONTAINS(tags, '\"" + tag + "\"')");
  }
  if (author) {
    where.push("author LIKE ?");
    params.push(`%${author}%`);
  }
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY RAND() LIMIT 1";
  try {
    const pool = getPool();
    const [rows] = await pool.query(sql, params);
    if (!rows.length) return res.status(404).json({ error: "No quote found" });
    const row = rows[0];
    row.tags = parseTags(row.tags);
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Get filtered/searched quotes (by tag, author, text)
 * GET /api/quotes?tag=motivation&author=John&search=life&limit=10
 */
exports.getQuotes = async (req, res) => {
  const { tag, author, search, limit = 12 } = req.query;
  let sql = "SELECT * FROM quotes";
  const where = [];
  const params = [];
  if (tag) {
    where.push("JSON_CONTAINS(tags, '\"" + tag + "\"')");
  }
  if (author) {
    where.push("author LIKE ?");
    params.push(`%${author}%`);
  }
  if (search) {
    where.push("text LIKE ?");
    params.push(`%${search}%`);
  }
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY created_at DESC LIMIT ?";
  params.push(Number(limit) >= 1 && Number(limit) <= 50 ? Number(limit) : 12);
  try {
    const pool = getPool();
    const [rows] = await pool.query(sql, params);
    rows.forEach((row) => (row.tags = parseTags(row.tags)));
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Like/Save a quote (add to user favorites)
 * POST /api/quotes/:id/like
 * Body: { user_id }
 */
exports.likeQuote = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const pool = getPool();
    // Validate user and quote exist
    const [[user]] = await pool.query("SELECT id FROM users WHERE id=?", [user_id]);
    if (!user) return res.status(404).json({ error: "User not found" });
    const [[quote]] = await pool.query("SELECT id FROM quotes WHERE id=?", [id]);
    if (!quote) return res.status(404).json({ error: "Quote not found" });
    // Add favorite if not already
    await pool.query(
      "INSERT IGNORE INTO favorites (user_id, item_type, item_id) VALUES (?, 'quote', ?)",
      [user_id, id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Remove like/save from user favorites
 * POST /api/quotes/:id/unlike
 * Body: { user_id }
 */
exports.unlikeQuote = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const pool = getPool();
    await pool.query(
      "DELETE FROM favorites WHERE user_id=? AND item_type='quote' AND item_id=?",
      [user_id, id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Get all quotes liked/saved by a user
 * GET /api/quotes/saved?user_id=123
 */
exports.getUserSavedQuotes = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const pool = getPool();
    // Join favorites (type 'quote') with quote details
    const [rows] = await pool.query(
      `SELECT q.* FROM favorites f
       JOIN quotes q ON f.item_id = q.id
       WHERE f.user_id=? AND f.item_type='quote'
       ORDER BY f.created_at DESC`, [user_id]
    );
    rows.forEach(row => row.tags = parseTags(row.tags));
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Submit (create) a new quote
 * POST /api/quotes
 * Body: { text, author, tags (array or comma string) }
 */
exports.submitQuote = async (req, res) => {
  const { text, author, tags } = req.body;
  if (!text || !author)
    return res.status(400).json({ error: "Both text and author are required" });
  let tagsJson = null;
  if (tags) {
    if (Array.isArray(tags)) tagsJson = JSON.stringify(tags);
    else if (typeof tags === "string") {
      tagsJson = JSON.stringify(
        tags.split(",").map((t) => t.trim()).filter((t) => !!t)
      );
    }
  }
  try {
    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO quotes (text, author, tags) VALUES (?, ?, ?)",
      [text, author, tagsJson]
    );
    res.status(201).json({ id: result.insertId, text, author, tags: parseTags(tagsJson) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Get quotes submitted by a particular author
 * GET /api/quotes/by?author=John
 */
exports.getQuotesByAuthor = async (req, res) => {
  const { author } = req.query;
  if (!author)
    return res.status(400).json({ error: "author parameter required" });
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM quotes WHERE author LIKE ? ORDER BY created_at DESC",
      [`%${author}%`]
    );
    rows.forEach(row => row.tags = parseTags(row.tags));
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
