/**
 * User controller for FunBase backend.
 * Handles user creation/lookup for the purpose of meme endpoints.
 */
const { getPool } = require('../db');

// PUBLIC_INTERFACE
/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, username, email, avatar_url, created_at FROM users WHERE id=?",
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PUBLIC_INTERFACE
/**
 * Create/register a new user (no password hashing here, for demo ONLY!)
 */
exports.createUser = async (req, res) => {
  const { username, email, password_hash, avatar_url } = req.body;
  if (!username || !email || !password_hash) {
    return res.status(400).json({ error: "Missing required parameter" });
  }
  try {
    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)",
      [username, email, password_hash, avatar_url || null]
    );
    res.status(201).json({ id: result.insertId, username, email, avatar_url });
  } catch (e) {
    res.status(500).json({ error: e.code === 'ER_DUP_ENTRY' ? "User/email already exists" : e.message });
  }
};
