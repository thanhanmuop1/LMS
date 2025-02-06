import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../../../utils/axiosConfig';
import CourseCard from '../../common/card/CourseCard';
import Navbar from '../../common/navbar/navbar';
import Sidebar from '../../common/sidebar/sidebar';
import '../../../styles/CourseLayout.css';

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosConfig.get(`/courseEnroll/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      message.error('Không thể tải danh sách khóa học đã đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleStartLearning = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content">
          <div className="enrolled-courses-container">
            <h2 className="section-title">Khóa học đã đăng ký</h2>
            <div className="courses-grid">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={true}
                  onCardClick={handleCardClick}
                  onStartLearning={handleStartLearning}
                  showEnrollmentStatus={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourses;