import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';
import { TeamOutlined } from '@ant-design/icons';

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem('role');
  
  // Menu items chung cho mọi người
  const studentMenuItems = [
    { 
      name: 'Trang chủ', 
      path: '/',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    {
      name: 'Khóa học của tôi',
      path: '/enrolled-courses',
      icon: 'M12 14l9-5-9-5-9 5 9 5z'
    }
  ];

  // Menu items cho admin
  const adminMenuItems = [
    {
        name: 'Thống kê',
        path: '/admin',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    { 
      name: 'Quản lý khóa học', 
      path: '/admin/courses',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' 
    },
    {
        name: 'Quản lý bài tập',
        path: '/admin/quiz',
        icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  // Menu items cho giáo viên
  const teacherMenuItems = [
    { 
      name: 'Thống kê', 
      path: '/teacher/',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' 
    },
    {
      name: 'Quản lý khóa học', 
      path: '/teacher/courses',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' 
    },
    {
        name: 'Quản lý bài tập',
        path: '/teacher/quiz',
        icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      name: 'Quản lý học viên',
      path: '/teacher/enrollments',
      icon: ''
    },
  ];

  // Kết hợp menu items dựa trên role
  const menuItems = [
    ...(userRole === 'student' ? studentMenuItems : []),
    ...(userRole === 'admin' ? adminMenuItems : []),
    ...(userRole === 'teacher' ? teacherMenuItems : []),
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>Learning App</span>
        </Link>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 