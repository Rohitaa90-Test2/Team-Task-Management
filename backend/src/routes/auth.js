const express = require('express');
const { signup, login, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validate, authValidation } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/signup', validate(authValidation.signup), signup);
router.post('/login', validate(authValidation.login), login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
