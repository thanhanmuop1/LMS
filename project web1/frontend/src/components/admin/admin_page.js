import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import { message } from 'antd';
import Dashboard from './dashboard/dashboard';
import CourseManagement from './courses/course_management';
import QuizManagement from './quizzes/quiz_management';
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';
import './admin_page.css';

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [coursesResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5000/courses', { headers }),
        axios.get('http://localhost:5000/users', { headers })
      ]);

      setCourses(coursesResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 403) {
        message.error('Không có quyền truy cập');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Dashboard courses={courses} users={users} />} />
              <Route path="/courses" element={
                <CourseManagement 
                  courses={courses} 
                  loading={loading} 
                  onCourseAdded={fetchData}
                />
              } />
              <Route path="/quiz" element={<QuizManagement />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
