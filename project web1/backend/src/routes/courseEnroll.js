// Thêm route mới để lấy khóa học đã đăng ký
router.get('/enrolled-courses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const enrolledCourses = await courseEnrollModel.getEnrolledCourses(userId);
    res.json(enrolledCourses);
  } catch (error) {
    console.error('Error getting enrolled courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); 