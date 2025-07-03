const express = require('express');
const router = express.Router();
const funEventController = require('../controllers/funEventController');

// PUBLIC_INTERFACE
/**
 * @swagger
 * tags:
 *   name: FunEvents
 *   description: Curated fun events and time-travel content
 */

/**
 * @swagger
 * /fun-events:
 *   get:
 *     summary: Get fun events for a specific date
 *     description: Returns array of fun events for the given date (YYYY-MM-DD).
 *     tags: [FunEvents]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *         required: true
 *     responses:
 *       200:
 *         description: Array of fun events for date.
 *       400:
 *         description: Missing or invalid date
 *       500:
 *         description: Server error
 */
router.get('/', funEventController.getFunEventsByDate);

/**
 * @swagger
 * /fun-events/random:
 *   get:
 *     summary: Get a random fun event
 *     description: Returns a single random fun event.
 *     tags: [FunEvents]
 *     responses:
 *       200:
 *         description: A random fun event.
 *       404:
 *         description: No fun events found.
 *       500:
 *         description: Server error.
 */
router.get('/random', funEventController.getRandomFunEvent);

/**
 * @swagger
 * /fun-events/today:
 *   get:
 *     summary: Get today's fun events
 *     description: Returns array of fun events for today.
 *     tags: [FunEvents]
 *     responses:
 *       200:
 *         description: Array of fun events for today.
 *       500:
 *         description: Server error.
 */
router.get('/today', funEventController.getTodayFunEvents);

/**
 * @swagger
 * /fun-events:
 *   post:
 *     summary: Add a new fun event
 *     tags: [FunEvents]
 *     description: Creates a new fun event entry for a date.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_date
 *               - title
 *               - type
 *               - content
 *             properties:
 *               event_date:
 *                 type: string
 *                 format: date
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *               content:
 *                 type: string
 *               url:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Fun event created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server/database error
 */
router.post('/', funEventController.createFunEvent);

module.exports = router;
