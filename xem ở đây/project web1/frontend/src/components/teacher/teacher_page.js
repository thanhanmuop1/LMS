import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseManagement from './courses/course_management';
import TeacherDashboard from './dashboard/dashboard';
import ManagementPageBase from '../common/management/ManagementPageBase';
import QuizManagement from './quizzes/quiz_management';

const TeacherPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: 'Tổng quan',
      children: <TeacherDashboard courses={courses} />,
    },
    {
      key: '2',
      label: 'Khóa học của tôi',
      children: <CourseManagement 
        courses={courses} 
        loading={loading} 
        onCourseAdded={fetchCourses}
      />,
    },
    {
      key: '3',
      label: 'Quiz',
      children: <QuizManagement />,
    }
  ];

  return <ManagementPageBase items={items} />;
};

export default TeacherPage; 