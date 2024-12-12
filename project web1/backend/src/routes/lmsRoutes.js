const express = require('express');
const router = express.Router();
const lmsControllers = require('../controllers/lmsControllers');
const authMiddleware = require('../middleware/auth');

router.get('/courses', lmsControllers.getAllCourses);
router.get('/videos', lmsControllers.getAllVideos);
router.get('/videos/completed', authMiddleware, lmsControllers.getCompletedVideos);
router.get('/videos/:videoId', lmsControllers.getVideoById);
router.get('/courses/:courseId/chapters', lmsControllers.getChaptersByCourseId);
router.get('/courses/:courseId/videos', lmsControllers.getVideosByCourseId);
router.get('/chapters/:chapterId/videos', lmsControllers.getVideosByChapterId);
router.post('/courses', authMiddleware, lmsControllers.createCourse);
router.delete('/courses/:courseId', authMiddleware, lmsControllers.deleteCourse);
router.put('/courses/:courseId', authMiddleware, lmsControllers.updateCourse);
router.get('/courses/:courseId', lmsControllers.getCourseById);
router.post('/courses/:courseId/chapters', authMiddleware, lmsControllers.createChapter);
router.put('/chapters/:chapterId', authMiddleware, lmsControllers.updateChapter);
router.delete('/chapters/:chapterId', authMiddleware, lmsControllers.deleteChapter);
router.post('/chapters/:chapterId/videos', authMiddleware, lmsControllers.createVideo);
router.put('/videos/:videoId', authMiddleware, lmsControllers.updateVideo);
router.delete('/videos/:videoId', authMiddleware, lmsControllers.deleteVideo);
router.post('/videos/:videoId/mark-watched', authMiddleware, lmsControllers.markVideoAsWatched);

module.exports = router;