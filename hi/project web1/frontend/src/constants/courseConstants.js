export const COURSE_TYPES = {
  ALL: 'all',
  ENROLLED: 'enrolled',
  TEACHING: 'teaching'
};

export const API_ENDPOINTS = {
  ALL_COURSES: '/courses',
  ENROLLED_COURSES: '/courseEnroll/enrolled-courses',
  TEACHER_COURSES: '/teacher/courses'
};

export const ERROR_MESSAGES = {
  FETCH_ERROR: 'Không thể tải danh sách khóa học',
  ENROLL_ERROR: 'Lỗi khi đăng ký khóa học',
  LOGIN_REQUIRED: 'Vui lòng đăng nhập để xem khóa học'
}; 