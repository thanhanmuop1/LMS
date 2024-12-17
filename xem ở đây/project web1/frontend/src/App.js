import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseVideosPage from './components/course_videos/course_videos_page';
import Home from './components/home/home';
import ResponsiveAppBar from './components/navbar/navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import PrivateRouteTeacher from './components/auth/PrivateRouteTeacher';
import AdminPage from './components/admin/admin_page';
import AdminRoute from './components/auth/AdminRoute';
import VideoManagement from './components/admin/courses/video_management';
import CreateQuiz from './components/admin/quizzes/create_quiz';
import QuestionManagement from './components/admin/quizzes/questions/question_management';
import TeacherPage from './components/teacher/teacher_page';
import TeacherVideoManagement from './components/teacher/courses/video_management';
import TeacherDocumentManagement from './components/teacher/courses/manage_document/document_management';
import { useEffect } from 'react';


function App() {
  useEffect(() => {
    const handleLoginSuccess = () => {
      const role = localStorage.getItem('role');
      console.log('Login success event, role:', role); // Debug log
      // Có thể thêm logic cập nhật UI ở đây
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    return () => window.removeEventListener('loginSuccess', handleLoginSuccess);
  }, []);

  return (
    <Router>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/course/:courseId" 
          element={
            <PrivateRoute>
              <CourseVideosPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/courses/:courseId/videos" element={<VideoManagement />} />
        <Route path="/admin/quizzes/create" element={<CreateQuiz />} />
        <Route path="/admin/quizzes/edit/:id" element={<CreateQuiz />} />
        <Route path="/admin/quizzes/:quizId/questions" element={<QuestionManagement />} />
        <Route 
          path="/teacher" 
          element={
            <PrivateRouteTeacher>
              <TeacherPage />
            </PrivateRouteTeacher>
          } 
        />
        <Route 
          path="/teacher/courses/:courseId/videos" 
          element={
            <PrivateRouteTeacher>
              <TeacherVideoManagement />
            </PrivateRouteTeacher>
          } 
        />
        <Route 
          path="/teacher/courses/:courseId/documents" 
          element={
            <PrivateRouteTeacher>
              <TeacherDocumentManagement />
            </PrivateRouteTeacher>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
