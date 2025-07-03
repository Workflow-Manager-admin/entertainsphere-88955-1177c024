/**
 * DB connector for FunBase backend.
 * Uses mysql2 and environment variables for connection info.
 */
const mysql = require('mysql2/promise');

// Use process.env to read actual connection details
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL, // Preferred, but fallback to individual params if absent
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// PUBLIC_INTERFACE
/**
 * Get a pool connection
 */
function getPool() {
  return pool;
}

module.exports = { getPool };
