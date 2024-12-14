const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');

router.get('/videos/:videoId/quizzes', authMiddleware, quizController.getQuizzesForVideo);
router.get('/chapters/:chapterId/quizzes', quizController.getQuizzesByChapter);
router.get('/courses/:courseId/quizzes', quizController.getQuizzesByCourse);
router.get('/quizzes/:quizId/result', authMiddleware, quizController.getQuizResult);
router.get('/quizzes/unassigned', authMiddleware, quizController.getUnassignedQuizzes);
router.get('/quizzes', quizController.getAllQuizzes);
router.get('/quizzes/:quizId', authMiddleware, quizController.getQuizById);

router.post('/quizzes/:quizId/submit', authMiddleware, quizController.submitQuiz);
router.post('/quizzes', authMiddleware, quizController.createQuiz);

router.put('/quizzes/:quizId/assign', authMiddleware, quizController.assignQuiz);
router.put('/quizzes/:quizId/unassign', authMiddleware, quizController.unassignQuiz);

router.delete('/quizzes/:quizId', authMiddleware, quizController.deleteQuiz);

router.post('/quizzes/:quizId/reset', authMiddleware, quizController.resetQuizAttempt);

router.put('/quizzes/:quizId', authMiddleware, quizController.updateQuiz);

router.put('/quizzes/:quizId/questions', authMiddleware, quizController.updateQuizQuestions);

module.exports = router; 