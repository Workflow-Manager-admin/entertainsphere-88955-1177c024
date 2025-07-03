const db = require('../db');
const moment = require('moment');

/**
 * Controller for fun_events table - provides CRUD and custom fetch logic.
 */

// PUBLIC_INTERFACE
exports.getFunEventsByDate = async (req, res) => {
  /**
   * Fetch fun events for a specific date (YYYY-MM-DD).
   * Query param: date=YYYY-MM-DD
   * Returns: array of fun event objects for the date.
   */
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Query parameter 'date' is required in format YYYY-MM-DD." });
    }
    const [rows] = await db.query(
      'SELECT * FROM fun_events WHERE event_date = ?', [date]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching fun events by date:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};

// PUBLIC_INTERFACE
exports.getRandomFunEvent = async (req, res) => {
  /**
   * Fetch a single random fun event.
   * Returns: a single fun event object.
   */
  try {
    const [rows] = await db.query(
      'SELECT * FROM fun_events ORDER BY RAND() LIMIT 1'
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No fun events found.' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching random fun event:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};

// PUBLIC_INTERFACE
exports.getTodayFunEvents = async (req, res) => {
  /**
   * Fetch fun events for today's date (server time).
   * Returns: array of fun event objects.
   */
  try {
    const today = moment().format('YYYY-MM-DD');
    const [rows] = await db.query(
      'SELECT * FROM fun_events WHERE event_date = ?', [today]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Error fetching today fun events:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};

// PUBLIC_INTERFACE
exports.createFunEvent = async (req, res) => {
  /**
   * Create a new fun event.
   * Body: { event_date: 'YYYY-MM-DD', title: string, type: string, content: string, url?: string, metadata?: object }
   * Returns: the created fun event object.
   */
  try {
    const { event_date, title, type, content, url, metadata } = req.body;
    if (!event_date || !title || !type || !content) {
      return res.status(400).json({ error: 'event_date, title, type, and content fields are required.' });
    }
    const [result] = await db.query(
      'INSERT INTO fun_events (event_date, title, type, content, url, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      [
        event_date,
        title,
        type,
        content,
        url || null,
        metadata ? JSON.stringify(metadata) : null
      ]
    );
    // Retrieve the inserted record:
    const [rows] = await db.query('SELECT * FROM fun_events WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating fun event:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};
