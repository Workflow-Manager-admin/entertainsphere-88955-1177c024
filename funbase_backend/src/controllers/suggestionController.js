//
// suggestionController.js
//
// Controllers for Movie and Song suggestions in FunBase backend.
//

const { getPool } = require('../db');

// ---------------- MOVIE SUGGESTIONS ----------------

// PUBLIC_INTERFACE
/**
 * Get movie suggestions (optionally by mood, genre, or random)
 * Query params: mood, genre, random (boolean), limit (default 10)
 */
exports.getMovies = async (req, res) => {
  const { mood, genre, random, limit } = req.query;
  let sql = "SELECT * FROM movies";
  const params = [];
  const where = [];
  if (mood) {
    where.push("mood = ?");
    params.push(mood);
  }
  if (genre) {
    where.push("genre = ?");
    params.push(genre);
  }
  if (where.length > 0) {
    sql += ' WHERE ' + where.join(' AND ');
  }
  if (random === "true" || random === true) {
    sql += " ORDER BY RAND()";
  } else {
    sql += " ORDER BY created_at DESC";
  }
  const n = (Number(limit) && Number(limit) >= 1 && Number(limit) <= 40) ? Number(limit) : 10;
  sql += " LIMIT ?";
  params.push(n);

  try {
    const pool = getPool();
    const [movies] = await pool.query(sql, params);
    res.json(movies);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Get a movie by ID
 */
exports.getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM movies WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Movie not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ---------------- SONG SUGGESTIONS ----------------

// PUBLIC_INTERFACE
/**
 * Get song suggestions (optionally by mood, genre, or random)
 * Query params: mood, genre, random (boolean), limit (default 10)
 */
exports.getSongs = async (req, res) => {
  const { mood, genre, random, limit } = req.query;
  let sql = "SELECT * FROM songs";
  const params = [];
  const where = [];
  if (mood) {
    where.push("mood = ?");
    params.push(mood);
  }
  if (genre) {
    where.push("genre = ?");
    params.push(genre);
  }
  if (where.length > 0) {
    sql += ' WHERE ' + where.join(' AND ');
  }
  if (random === "true" || random === true) {
    sql += " ORDER BY RAND()";
  } else {
    sql += " ORDER BY created_at DESC";
  }
  const n = (Number(limit) && Number(limit) >= 1 && Number(limit) <= 40) ? Number(limit) : 10;
  sql += " LIMIT ?";
  params.push(n);

  try {
    const pool = getPool();
    const [songs] = await pool.query(sql, params);
    res.json(songs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Get a song by ID
 */
exports.getSongById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM songs WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Song not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
