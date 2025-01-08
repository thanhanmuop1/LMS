import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../common/card/CourseCard';
import '../../styles/CourseLayout.css';

const CardComponent = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, [userRole, token]);

  const fetchCourses = async () => {
    try {
      if (userRole === 'teacher' && token) {
        const myCoursesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/teacher/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyCourses(myCoursesResponse.data);
      } else {
        const allCoursesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/courses`);
        const publicCourses = allCoursesResponse.data.filter(course => course.is_public);
        setAllCourses(publicCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCardClick = (courseId) => {
    const isAuthenticated = !!token;
    
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để xem khóa học');
      navigate('/login');
      return;
    }

    if (userRole === 'teacher' && myCourses.some(course => course.id === courseId)) {
      navigate(`/course/${courseId}`);
      return;
    }

    navigate(`/course-info/${courseId}`);
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/courseEnroll/enroll`, 
        { courseId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Đăng ký khóa học thành công');
      navigate(`/course/${courseId}`);
    } catch (error) {
      message.error('Lỗi khi đăng ký khóa học');
    }
  };

  const handleEditClick = (courseId) => {
    navigate(`/teacher/courses/${courseId}/videos`);
  };

  return (
    <div className="courses-container">
      {userRole === 'teacher' ? (
        <div className="course-section">
          {/* <h2 className="section-title">Tạo khóa học mới</h2>
          <CourseCard
            isNewCourseCard={true}
            onCardClick={() => navigate('/teacher/courses')}
            className="new-course-card"
          /> */}
          
          <h2 className="section-title" style={{ marginTop: '2rem' }}>Khóa học của tôi</h2>
          <div className="courses-grid">
            {myCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                userRole={userRole}
                onCardClick={handleCardClick}
                onEditClick={handleEditClick}
                showEnrollmentStatus={false}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="course-section">
          <h2 className="section-title">Tất cả khóa học</h2>
          <div className="courses-grid">
            {allCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                userRole={userRole}
                onCardClick={handleCardClick}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardComponent;