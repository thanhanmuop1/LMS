const courseEnroll = require('../models/courseEnroll');

// Thêm hàm mới để lấy khóa học đã đăng ký
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrolledCourses = await courseEnroll.getEnrolledCourses(userId);
    res.json(enrolledCourses);
  } catch (error) {
    console.error('Error getting enrolled courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const enrollInCourse = (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  courseEnroll.checkEnrollment(userId, courseId, (error, isEnrolled) => {
    if (error) {
      console.error('Error checking enrollment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (isEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    courseEnroll.enrollUserInCourse(userId, courseId, (error, result) => {
      if (error) {
        console.error('Error enrolling in course:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json({ message: 'Enrolled successfully' });
    });
  });
};

const checkEnrollmentStatus = (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.courseId;

  courseEnroll.checkEnrollment(userId, courseId, (error, isEnrolled) => {
    if (error) {
      console.error('Error checking enrollment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ isEnrolled });
  });
};

const getTeacherStats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const stats = await courseEnroll.getTeacherStats(teacherId);
    res.json(stats);
  } catch (error) {
    console.error('Error getting teacher stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { 
  enrollInCourse, 
  checkEnrollmentStatus, 
  getTeacherStats,
  getEnrolledCourses 
}; 