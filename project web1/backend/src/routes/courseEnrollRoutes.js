const express = require('express');
const { 
  enrollInCourse, 
  checkEnrollmentStatus, 
  getTeacherStats,
  getEnrolledCourses 
} = require('../controllers/courseEnrollController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Route để lấy danh sách khóa học đã đăng ký
router.get('/enrolled-courses', authMiddleware, getEnrolledCourses);

// Route to enroll in a course
router.post('/enroll', authMiddleware, enrollInCourse);

// Route to check enrollment status
router.get('/check/:courseId', authMiddleware, checkEnrollmentStatus);

// Route to get teacher stats
router.get('/stats', authMiddleware, getTeacherStats);

module.exports = router; 