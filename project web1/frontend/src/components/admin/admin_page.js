import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Dashboard from './dashboard/dashboard';
import CourseManagement from './courses/course_management';
import './admin_page.css';

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAdded = () => {
    fetchCourses();
  };

  const items = [
    {
      key: '1',
      label: 'Tổng quan',
      children: <Dashboard courses={courses} />,
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
