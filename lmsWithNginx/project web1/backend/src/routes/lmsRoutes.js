const express = require('express');
const router = express.Router();
const lmsControllers = require('../controllers/lmsControllers');
const {authMiddleware, isTeacher} = require('../middleware/authMiddleware');
const subdomainMiddleware = require('../middleware/subdomainMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

router.get('/courses', subdomainMiddleware, lmsControllers.getAllCourses);
router.get('/videos', lmsControllers.getAllVideos);
router.get('/videos/completed', authMiddleware, lmsControllers.getCompletedVideos);
router.get('/videos/:videoId', lmsControllers.getVideoById);
router.get('/courses/:courseId/chapters', lmsControllers.getChaptersByCourseId);
router.get('/courses/:courseId/videos', lmsControllers.getVideosByCourseId);
router.get('/chapters/:chapterId/videos', lmsControllers.getVideosByChapterId);
router.post('/courses', [authMiddleware, isTeacher, subdomainMiddleware], lmsControllers.createCourse);
router.delete('/courses/:courseId', [authMiddleware, subdomainMiddleware], lmsControllers.deleteCourse);
router.put('/courses/:courseId', [authMiddleware, subdomainMiddleware], lmsControllers.updateCourse);
router.get('/courses/:courseId', [authMiddleware, subdomainMiddleware], lmsControllers.getCourseById);
router.post('/courses/:courseId/chapters', authMiddleware, lmsControllers.createChapter);
router.put('/chapters/:chapterId', [authMiddleware, subdomainMiddleware], lmsControllers.updateChapter);
router.delete('/chapters/:chapterId', authMiddleware, lmsControllers.deleteChapter);
router.post('/chapters/:chapterId/videos', [authMiddleware, subdomainMiddleware], lmsControllers.createVideo);
router.put('/videos/:videoId', [authMiddleware, subdomainMiddleware], lmsControllers.updateVideo);
router.delete('/videos/:videoId', authMiddleware, lmsControllers.deleteVideo);
router.post('/videos/:videoId/mark-watched', authMiddleware, lmsControllers.markVideoAsWatched);

const uploadDir = 'uploads/thumbnails';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer cho upload thumbnail
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
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
router.post('/courses/upload-thumbnail', authMiddleware, thumbnailUpload.single('thumbnail'), lmsControllers.uploadThumbnail);

// Cập nhật trạng thái public của khóa học (cho cả admin và teacher)
router.put('/courses/:courseId/visibility', authMiddleware, lmsControllers.updateCourseVisibility);

// Thêm route để lấy danh sách học sinh theo khóa học
router.get('/courses/:courseId/students',[authMiddleware,subdomainMiddleware],lmsControllers.getStudentsByCourse);

// Thêm route để xóa học sinh khỏi khóa học
router.delete('/courses/:courseId/students/:userId', authMiddleware, lmsControllers.removeStudentFromCourse);

module.exports = router;