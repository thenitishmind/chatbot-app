const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to all chat routes
router.use(rateLimiter);

// Public routes
router.post('/message', chatController.sendMessage);
router.get('/history/:sessionId', chatController.getChatHistory);
router.post('/calculate-loan', chatController.calculateLoan);

// Protected routes (require authentication)
router.use(authenticate);
router.post('/session/end/:sessionId', chatController.endChatSession);

module.exports = router; 