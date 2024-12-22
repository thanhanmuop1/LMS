const express = require('express');
const router = express.Router();
const lmsControllers = require('../controllers/lmsControllers');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

router.get('/courses', lmsControllers.getAllCourses);
router.get('/videos', lmsControllers.getAllVideos);
router.get('/videos/completed', authMiddleware.authMiddleware, lmsControllers.getCompletedVideos);
router.get('/videos/:videoId', lmsControllers.getVideoById);
router.get('/courses/:courseId/chapters', lmsControllers.getChaptersByCourseId);
router.get('/courses/:courseId/videos', lmsControllers.getVideosByCourseId);
router.get('/chapters/:chapterId/videos', lmsControllers.getVideosByChapterId);
router.post('/courses', authMiddleware.authMiddleware, lmsControllers.createCourse);
router.delete('/courses/:courseId', authMiddleware.authMiddleware, lmsControllers.deleteCourse);
router.put('/courses/:courseId', authMiddleware.authMiddleware, lmsControllers.updateCourse);
router.get('/courses/:courseId', lmsControllers.getCourseById);
router.post('/courses/:courseId/chapters', authMiddleware.authMiddleware, lmsControllers.createChapter);
router.put('/chapters/:chapterId', authMiddleware.authMiddleware, lmsControllers.updateChapter);
router.delete('/chapters/:chapterId', authMiddleware.authMiddleware, lmsControllers.deleteChapter);
router.post('/chapters/:chapterId/videos', authMiddleware.authMiddleware, lmsControllers.createVideo);
router.put('/videos/:videoId', authMiddleware.authMiddleware, lmsControllers.updateVideo);
router.delete('/videos/:videoId', authMiddleware.authMiddleware, lmsControllers.deleteVideo);
router.post('/videos/:videoId/mark-watched', authMiddleware.authMiddleware, lmsControllers.markVideoAsWatched);

// Cấu hình multer cho upload thumbnail
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/thumbnails');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const thumbnailUpload = multer({ 
  storage: thumbnailStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'));
    }
  }
});

// Thêm route upload thumbnail
router.post('/courses/upload-thumbnail', authMiddleware.authMiddleware, thumbnailUpload.single('thumbnail'), lmsControllers.uploadThumbnail);

module.exports = router;