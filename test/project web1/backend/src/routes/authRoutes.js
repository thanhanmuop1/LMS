const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const authMiddleware = require('../middleware/auth');

router.post('/auth/register', authControllers.register);
router.post('/auth/login', authControllers.login);
router.get('/users', authMiddleware, authControllers.getAllUsers);

module.exports = router;