import React, { useState, useEffect } from 'react';
import { Card, message, Button, Tag } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './card.css';

const { Meta } = Card;

const CardComponent = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (userRole === 'teacher' && token) {
          const myCoursesResponse = await axios.get('http://localhost:5000/teacher/courses', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyCourses(myCoursesResponse.data);
        } else {
          const allCoursesResponse = await axios.get('http://localhost:5000/courses');
          const publicCourses = allCoursesResponse.data.filter(course => 
            course.is_public
          );
          setAllCourses(publicCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [userRole, token]);

  const checkEnrollmentStatus = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:5000/courseEnroll/check/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollmentStatus(prev => ({
        ...prev,
        [courseId]: response.data.isEnrolled
      }));
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  useEffect(() => {
    // Check enrollment status for each course when courses are loaded
    allCourses.forEach(course => {
      checkEnrollmentStatus(course.id);
    });
  }, [allCourses]);

  const isTeacherCourse = (courseId) => {
    return myCourses.some(course => course.id === courseId);
  };

  const handleCardClick = async (courseId) => {
    const isAuthenticated = !!token;
    
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để xem khóa học');
      navigate('/login');
      return;
    }

    if (userRole === 'teacher' && isTeacherCourse(courseId)) {
      navigate(`/course/${courseId}`);
      return;
    }

    if (!enrollmentStatus[courseId]) {
      navigate(`/course-info/${courseId}`);
      return;
    }
    
    navigate(`/course/${courseId}`);
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('http://localhost:5000/courseEnroll/enroll', { courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Đăng ký khóa học thành công');
      
      // Cập nhật trạng thái đăng ký
      setEnrollmentStatus(prev => ({
        ...prev,
        [courseId]: true
      }));

      // Chuyển hướng đến trang khóa học sau khi đăng ký thành công
      navigate(`/course/${courseId}`);
    } catch (error) {
      message.error('Lỗi khi đăng ký khóa học');
    }
  };

  const CourseList = ({ courses }) => (
    <div className="courses-grid">
      {courses.map((course) => (
        <Card
          key={course.id}
          hoverable
          onClick={() => handleCardClick(course.id)}
          className={`course-card ${userRole !== 'teacher' && !enrollmentStatus[course.id] ? 'not-enrolled' : ''}`}
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
          <Meta 
            title={course.title} 
            description={course.description || 'No description available'} 
          />
          
          {userRole === 'teacher' ? (
            <Button 
              className="enroll-button"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/teacher/courses/${course.id}/videos`);
              }}
            >
              Chỉnh sửa
            </Button>
          ) : (
            !enrollmentStatus[course.id] ? (
              <Button 
                className="enroll-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnroll(course.id);
                }}
              >
                Đăng ký
              </Button>
            ) : (
              <Tag color="green" className="enrolled-tag">
                Đã đăng ký
              </Tag>
            )
          )}
        </Card>
      ))}
    </div>
  );

  return (
    <div className="courses-container">
      {userRole === 'teacher' ? (
        <div className="course-section">
          <h2 className="section-title">Tạo khóa học mới</h2>
          <Card
            hoverable
            onClick={() => navigate('/teacher/courses')}
            className="course-card new-course-card"
            cover={
              <div className="course-image-container new-course-container">
                <PlusOutlined className="new-course-icon" />
                <div className="new-course-text">Tạo khóa học mới</div>
              </div>
            }
          >
            <Meta 
              title="Tạo khóa học mới"
              description="Nhấn để bắt đầu tạo khóa học của bạn" 
            />
          </Card>
          
          <h2 className="section-title" style={{ marginTop: '2rem' }}>Khóa học của tôi</h2>
          <CourseList courses={myCourses} />
        </div>
      ) : (
        <div className="course-section">
          <h2 className="section-title">Tất cả khóa học</h2>
          <CourseList courses={allCourses} />
        </div>
      )}
    </div>
  );
};

export default CardComponent;