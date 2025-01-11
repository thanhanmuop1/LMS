import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CourseManagement from './courses/course_management';
import TeacherDashboard from './dashboard/dashboard';
import QuizManagement from './quizzes/quiz_management';
import Navbar from '../common/navbar/navbar';
import Sidebar from '../common/sidebar/sidebar';
import './teacher_page.css';

const TeacherPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    fetchCourses();

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/teacher/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Error fetching courses:', error);
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
              <Route path="/" element={<TeacherDashboard courses={courses} />} />
              <Route path="/courses" element={
                <CourseManagement 
                  courses={courses} 
                  loading={loading} 
                  onCourseAdded={fetchCourses}
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

export default TeacherPage; 