import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import axios from 'axios';
import './CourseCard.css';

const { Meta } = Card;

const CourseCard = ({
  course,
  onEnroll,
  onCardClick,
  isEnrolled: propIsEnrolled,
  className = '',
  showEnrollmentStatus = true
}) => {
  const [isEnrolled, setIsEnrolled] = useState(propIsEnrolled);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && showEnrollmentStatus && !propIsEnrolled) {
      checkEnrollmentStatus();
    }
  }, [course?.id, token, showEnrollmentStatus]);

  const checkEnrollmentStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/courseEnroll/check/${course.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  // if (isNewCourseCard) {
  //   return (
  //     <Card
  //       hoverable
  //       onClick={onCardClick}
  //       className={`course-card new-course-card ${className}`}
  //       cover={
  //         <div className="course-image-container new-course-container">
  //           <PlusOutlined className="new-course-icon" />
  //           <div className="new-course-text">Tạo khóa học mới</div>
  //         </div>
  //       }
  //     >
  //       <Meta 
  //         title="Tạo khóa học mới"
  //         description="Nhấn để bắt đầu tạo khóa học của bạn" 
  //       />
  //     </Card>
  //   );
  // }

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    onEnroll?.(course.id);
  };

  return (
    <Card
      hoverable
      onClick={() => onCardClick?.(course.id)}
      className={`course-card ${!isEnrolled ? 'not-enrolled' : ''} ${className}`}
      cover={
        <div className="course-image-container">
          <img
            alt={course.title}
            src={`${process.env.REACT_APP_API_URL}${course.thumbnail}`}
            className="course-image"
          />
        </div>
      }
    >
      <Meta 
        title={course.title} 
        description={
          <div>
            <p className="course-description">Giảng viên: {course.teacher_name || 'Chưa có giảng viên'}</p>
            <div className="course-info">
              {course.total_students && <span>{course.total_students} học viên</span>}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default CourseCard;