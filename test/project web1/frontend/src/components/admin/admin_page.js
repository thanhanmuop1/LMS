import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Dashboard from './dashboard/dashboard';
import CourseManagement from './courses/course_management';
import QuizManagement from './quizzes/quiz_management';
import './admin_page.css';

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5000/courses'),
        axios.get('http://localhost:5000/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      setCourses(coursesResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAdded = () => {
    fetchData();
  };

  const items = [
    {
      key: '1',
      label: 'Tổng quan',
      children: <Dashboard courses={courses} users={users} />,
    },
    {
      key: '2',
      label: 'Quản lý khóa học',
      children: <CourseManagement 
        courses={courses} 
        loading={loading} 
        onCourseAdded={handleCourseAdded}
      />,
    },
    {
      key: '3',
      label: 'Quiz',
      children: <QuizManagement courseId={selectedCourseId} />,
    }
  ];

  return (
    <div className="admin-container">
      <Tabs 
        defaultActiveKey="1" 
        items={items}
        type="card"
        className="admin-tabs"
      />
    </div>
  );
};

export default AdminPage;
