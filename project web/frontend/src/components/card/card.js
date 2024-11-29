import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './card.css';

const { Meta } = Card;

const CardComponent = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId) => {
    const isAuthenticated = !!localStorage.getItem('token');
    
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để xem khóa học');
      navigate('/login');
      return;
    }
    
    navigate(`/course/${courseId}`);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {courses.map((course) => (
        <Card
          key={course.id}
          hoverable
          onClick={() => handleCardClick(course.id)}
          cover={
            <img
              alt={course.title}
              src={course.thumbnail}
            />
          }
        >
          <Meta 
            title={course.title} 
            description={course.description || 'No description available'} 
          />
        </Card>
      ))}
    </div>
  );
};

export default CardComponent;