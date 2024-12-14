import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseVideosPage from './components/course_videos/course_videos_page';
import Home from './components/home/home';
import ResponsiveAppBar from './components/navbar/navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminPage from './components/admin/admin_page';
import AdminRoute from './components/auth/AdminRoute';
import VideoManagement from './components/admin/courses/video_management';
import CreateQuiz from './components/admin/quizzes/create_quiz';
import QuestionManagement from './components/admin/quizzes/questions/question_management';

function App() {
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
      </Routes>
    </Router>
  );
}

export default App;
