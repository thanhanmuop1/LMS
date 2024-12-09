const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');

router.get('/chapters/:chapterId/quizzes', quizController.getQuizzesByChapter);
router.post('/quizzes/:quizId/submit', authMiddleware, quizController.submitQuiz);
router.get('/courses/:courseId/quizzes', quizController.getQuizzesByCourse);
router.get('/quizzes/:quizId/result', authMiddleware, quizController.getQuizResult);

module.exports = router; 