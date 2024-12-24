import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseVideosPage from './components/course_videos/course_videos_page';
import Home from './components/home/home';
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
import CreateQuizTeacher from './components/teacher/quizzes/create_quiz';
import { useEffect } from 'react';
import CheckEmail from './components/auth/CheckEmail';
import EmailVerification from './components/auth/EmailVerification';
import EnrolledCourses from './components/enrolled_courses/enrolled_courses';
import CourseInfo from './components/course_info/course_info';
import TeacherEnrollmentDetails from './components/teacher/enrollment_details/TeacherEnrollmentDetails';
import SearchResults from './components/search/SearchResults';


function App() {
  useEffect(() => {
    const handleLoginSuccess = () => {
      const role = localStorage.getItem('role');
      console.log('Login success event, role:', role);
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    return () => window.removeEventListener('loginSuccess', handleLoginSuccess);
  }, []);

  return (
    <Router>
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
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/courses/:courseId/videos" element={<VideoManagement />} />
        <Route path="/admin/quizzes/create" element={<CreateQuiz />} />
        <Route path="/admin/quizzes/edit/:id" element={<CreateQuiz />} />
        <Route path="/admin/quizzes/:quizId/questions" element={<QuestionManagement />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/*" element={
          <PrivateRouteTeacher>
            <TeacherPage />
          </PrivateRouteTeacher>
        } />
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
        {/* Add new teacher quiz routes */}
        <Route
          path="/teacher/quizzes/create"
          element={
            <PrivateRouteTeacher>
              <CreateQuizTeacher />
            </PrivateRouteTeacher>
          }
        />
        <Route
          path="/teacher/quizzes/edit/:id"
          element={
            <PrivateRouteTeacher>
              <CreateQuizTeacher />
            </PrivateRouteTeacher>
          }
        />
        <Route
          path="/teacher/quizzes/:quizId/questions"
          element={
            <PrivateRouteTeacher>
              <QuestionManagement />
            </PrivateRouteTeacher>
          }
        />
        <Route 
          path="/teacher/enrollments" 
          element={
            <PrivateRouteTeacher>
              <TeacherEnrollmentDetails />
            </PrivateRouteTeacher>
          }
        />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route 
          path="/enrolled-courses" 
          element={
            <PrivateRoute>
              <EnrolledCourses />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/course-info/:courseId" 
          element={
            <PrivateRoute>
              <CourseInfo />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/search" 
          element={<SearchResults />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
