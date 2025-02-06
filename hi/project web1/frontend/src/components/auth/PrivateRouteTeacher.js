import { Navigate } from 'react-router-dom';

const PrivateRouteTeacher = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Chỉ cho phép teacher truy cập
  if (role !== 'teacher' && role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRouteTeacher; 