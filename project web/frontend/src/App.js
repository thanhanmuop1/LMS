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
      </Routes>
    </Router>
  );
}

export default App;
