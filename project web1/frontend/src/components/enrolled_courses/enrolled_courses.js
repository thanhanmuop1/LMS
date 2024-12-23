import React, { useState, useEffect } from 'react';
import { Card, message, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';
import './enrolled_courses.css';

const { Meta } = Card;

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
      const response = await axios.get('http://localhost:5000/courseEnroll/enrolled-courses', {
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

  const handleStartLearning = (e, courseId) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra card
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
                <Card
                  key={course.id}
                  hoverable
                  onClick={() => handleCardClick(course.id)}
                  className="course-card"
                  cover={
                    <div className="course-image-container">
                      <img
                        alt={course.title}
                        src={course.thumbnail}
                        className="course-image"
                      />
                    </div>
                  }
                >
                  <div className="card-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description || 'Chưa có mô tả'}</p>
                    <Button 
                      type="primary" 
                      icon={<PlayCircleOutlined />}
                      onClick={(e) => handleStartLearning(e, course.id)}
                      className="start-learning-button"
                    >
                      Vào học
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourses; 