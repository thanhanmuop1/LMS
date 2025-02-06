const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const {authMiddleware, isAdmin} = require('../middleware/authMiddleware');

router.post('/register', adminAuthController.register);
router.post('/login', adminAuthController.login);

module.exports = router; 