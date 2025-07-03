/**
 * User REST API routes - for user lookup and registration.
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Swagger/OpenAPI tag: Users

// PUBLIC_INTERFACE
/**
 * Get user info
 */
router.get('/:id', userController.getUserById);

// PUBLIC_INTERFACE
/**
 * Create/register user
 */
router.post('/', userController.createUser);

module.exports = router;
