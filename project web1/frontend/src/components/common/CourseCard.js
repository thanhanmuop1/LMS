import React, { useEffect, useState } from 'react';
import { Card, Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import './CourseCard.css';

const { Meta } = Card;

const CourseCard = ({
  course,
  userRole,
  onEnroll,
  onCardClick,
  onEditClick,
  className = ''
}) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      checkEnrollmentStatus();
    }
  }, [course.id]);

  const checkEnrollmentStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/courseEnroll/check/${course.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  const handleEnrollClick = async (e) => {
    e.stopPropagation();
    if (onEnroll) {
      await onEnroll(course.id);
      // Sau khi đăng ký thành công, cập nhật lại trạng thái
      checkEnrollmentStatus();
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEditClick?.(course.id);
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
            src={course.thumbnail}
            className="course-image"
          />
        </div>
      }
    >
      <Meta 
        title={course.title} 
        description={
          <div>
            <p className="course-description">{course.description || 'No description available'}</p>
            {course.teacher_name && (
              <div className="course-info">
                <span>Giảng viên: {course.teacher_name}</span>
                {course.total_students && <span>{course.total_students} học viên</span>}
              </div>
            )}
          </div>
        }
      />
      
      {userRole === 'teacher' ? (
        <Button 
          className="enroll-button"
          icon={<EditOutlined />}
          onClick={handleEditClick}
        >
          Chỉnh sửa
        </Button>
      ) : (
        !isEnrolled ? (
          <Button 
            className="enroll-button"
            onClick={handleEnrollClick}
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
  );
};

export default CourseCard;