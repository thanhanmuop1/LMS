import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import CourseManagement from './courses/course_management';
import TeacherDashboard from './dashboard/dashboard';
import QuizManagement from './quizzes/quiz_management';
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';
import './teacher_page.css';

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