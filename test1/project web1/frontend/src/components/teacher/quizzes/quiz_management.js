import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QuizManagementBase from '../../common/quiz/QuizManagementBase';

const QuizManagement = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/teacher/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Có lỗi xảy ra khi tải danh sách khóa học');
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/teacher/quizzes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      message.error('Có lỗi xảy ra khi tải danh sách quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/teacher/quizzes/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success('Xóa quiz thành công');
      fetchQuizzes();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa quiz');
    }
  };

  const handleAdd = () => {
    navigate('/teacher/quizzes/create');
  };

  const handleEdit = (quiz) => {
    navigate(`/teacher/quizzes/edit/${quiz.id}`, { state: { quizData: quiz } });
  };

  const handleQuestionClick = (quiz) => {
    navigate(`/teacher/quizzes/${quiz.id}/questions`, { state: { quizData: quiz } });
  };

  return (
    <QuizManagementBase
      quizzes={quizzes}
      courses={courses}
      loading={loading}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onQuestionClick={handleQuestionClick}
      role="teacher"
    />
  );
};

export default QuizManagement; 