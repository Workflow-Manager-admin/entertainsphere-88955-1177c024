/**
 * Meme controller - handles meme CRUD, like/save, and feed endpoints.
 */
const { getPool } = require('../db');

// PUBLIC_INTERFACE
/**
 * Create a meme
 */
exports.createMeme = async (req, res) => {
  const { user_id, image_url, caption, tags } = req.body;
  if (!user_id || !image_url) {
    return res.status(400).json({ error: "user_id and image_url are required" });
  }
  try {
    const pool = getPool();
    const [result] = await pool.execute(
      "INSERT INTO memes (user_id, image_url, caption, tags) VALUES (?, ?, ?, ?)",
      [user_id, image_url, caption || null, tags || null]
    );
    res.status(201).json({ id: result.insertId, user_id, image_url, caption, tags });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Get memes feed (optionally by user_id, tag, search)
 */
exports.getMemes = async (req, res) => {
  const { user_id, tag, search } = req.query;
  let sql = "SELECT memes.*, users.username, users.avatar_url, " +
    "IFNULL(likes.like_count,0) AS like_count, IFNULL(saves.save_count,0) AS save_count " +
    "FROM memes " +
    "JOIN users ON memes.user_id=users.id " +
    "LEFT JOIN (SELECT meme_id, COUNT(*) as like_count FROM meme_likes GROUP BY meme_id) likes ON memes.id=likes.meme_id " +
    "LEFT JOIN (SELECT meme_id, COUNT(*) as save_count FROM meme_saves GROUP BY meme_id) saves ON memes.id=saves.meme_id ";
  const params = [];
  const where = [];
  if (user_id) {
    where.push("memes.user_id = ?");
    params.push(user_id);
  }
  if (tag) {
    where.push("memes.tags LIKE ?");
    params.push(`%${tag}%`);
  }
  if (search) {
    where.push("memes.caption LIKE ?");
    params.push(`%${search}%`);
  }
  if (where.length) {
    sql += " WHERE " + where.join(' AND ');
  }
  sql += " ORDER BY memes.created_at DESC LIMIT 100";
  try {
    const pool = getPool();
    const [memes] = await pool.query(sql, params);
    res.json(memes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Get meme by ID
 */
exports.getMemeById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT memes.*, users.username, users.avatar_url,
         IFNULL(likes.like_count,0) AS like_count, IFNULL(saves.save_count,0) AS save_count
       FROM memes
       JOIN users ON memes.user_id = users.id
       LEFT JOIN (SELECT meme_id, COUNT(*) as like_count FROM meme_likes GROUP BY meme_id) likes ON memes.id=likes.meme_id
       LEFT JOIN (SELECT meme_id, COUNT(*) as save_count FROM meme_saves GROUP BY meme_id) saves ON memes.id=saves.meme_id
       WHERE memes.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Meme not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Update a meme (only by owner)
 */
exports.updateMeme = async (req, res) => {
  const { id } = req.params;
  const { user_id, caption, tags } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required for update" });
  try {
    const pool = getPool();
    // Check ownership
    const [rows] = await pool.query("SELECT * FROM memes WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Meme not found" });
    if (rows[0].user_id != user_id) return res.status(403).json({ error: "Not owner" });
    await pool.query(
      "UPDATE memes SET caption=?, tags=?, updated_at=NOW() WHERE id=?",
      [caption || null, tags || null, id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Delete meme (only by owner)
 */
exports.deleteMeme = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM memes WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Meme not found" });
    if (rows[0].user_id != user_id) return res.status(403).json({ error: "Not owner" });
    await pool.query("DELETE FROM memes WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Like meme (only once per user)
 */
exports.likeMeme = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const pool = getPool();
    await pool.query("INSERT IGNORE INTO meme_likes (meme_id, user_id) VALUES (?, ?)", [id, user_id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Unlike meme
 */
exports.unlikeMeme = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const pool = getPool();
    await pool.query("DELETE FROM meme_likes WHERE meme_id=? AND user_id=?", [id, user_id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Save meme
 */
exports.saveMeme = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const pool = getPool();
    await pool.query("INSERT IGNORE INTO meme_saves (meme_id, user_id) VALUES (?, ?)", [id, user_id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Unsave meme
 */
exports.unsaveMeme = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const pool = getPool();
    await pool.query("DELETE FROM meme_saves WHERE meme_id=? AND user_id=?", [id, user_id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
