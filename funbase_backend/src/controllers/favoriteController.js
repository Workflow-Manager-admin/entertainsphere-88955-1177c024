//
// favoriteController.js
//
// Controller for managing user favorites in FunBase backend.
//

const { getPool } = require('../db');

/**
 * Helper: validate item_type ('meme', 'movie', 'song')
 */
function validItemType(type) {
  return ["meme", "movie", "song"].includes(type);
}

// PUBLIC_INTERFACE
/**
 * Add an item to user favorites
 * POST /api/favorites
 * Body: { user_id, item_type, item_id }
 */
exports.addFavorite = async (req, res) => {
  const { user_id, item_type, item_id } = req.body;
  if (!user_id || !item_type || !item_id) {
    return res.status(400).json({ error: "user_id, item_type, and item_id are required" });
  }
  if (!validItemType(item_type)) {
    return res.status(400).json({ error: "Invalid item_type" });
  }
  // Optionally check if the item actually exists (in matching table)
  const table = item_type + "s";
  try {
    const pool = getPool();
    // Check user exists
    const [userRows] = await pool.query("SELECT id FROM users WHERE id=?", [user_id]);
    if (!userRows.length) return res.status(404).json({ error: "User not found" });
    // Check item exists
    const [itemRows] = await pool.query(`SELECT id FROM ${table} WHERE id=?`, [item_id]);
    if (!itemRows.length) return res.status(404).json({ error: `${item_type} not found` });

    // Add favorite if not already favorited (UNIQUE constraint)
    await pool.query(
      "INSERT IGNORE INTO favorites (user_id, item_type, item_id) VALUES (?, ?, ?)",
      [user_id, item_type, item_id]
    );
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Remove an item from user favorites
 * DELETE /api/favorites
 * Body: { user_id, item_type, item_id }
 */
exports.removeFavorite = async (req, res) => {
  const { user_id, item_type, item_id } = req.body;
  if (!user_id || !item_type || !item_id) {
    return res.status(400).json({ error: "user_id, item_type, and item_id are required" });
  }
  if (!validItemType(item_type)) {
    return res.status(400).json({ error: "Invalid item_type" });
  }
  try {
    const pool = getPool();
    await pool.query(
      "DELETE FROM favorites WHERE user_id=? AND item_type=? AND item_id=?",
      [user_id, item_type, item_id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Get a user's favorites (optionally filtered by type)
 * GET /api/favorites?user_id=...&item_type=...
 */
exports.getFavorites = async (req, res) => {
  const { user_id, item_type } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }
  const params = [user_id];
  let sql = "SELECT * FROM favorites WHERE user_id = ?";
  if (item_type && validItemType(item_type)) {
    sql += " AND item_type = ?";
    params.push(item_type);
  }
  sql += " ORDER BY created_at DESC";
  try {
    const pool = getPool();
    const [rows] = await pool.query(sql, params);
    // Enrich results with joined details if requested
    const itemMap = {};
    for (const row of rows) {
      itemMap[row.id] = row;
    }
    // (Optional) Future: join with movies/songs/memes for more info
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
