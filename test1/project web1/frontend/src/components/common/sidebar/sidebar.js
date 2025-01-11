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
    },
    {
        name: 'Lớp học của tôi',
        path: '/enrolled-classes',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    }
  ];

  // Menu items cho admin
  const adminMenuItems = [
    { 
      name: 'Trang chủ', 
      path: '/',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
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
      name: 'Trang chủ', 
      path: '/',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
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
    {
      name: 'Quản lý lớp học',
      path: '/teacher/classes',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
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
          <div className="logoandslogan">
          <img src="/logo1.png" alt="App logo" />
          {/* <span>Học không biết chán - Dạy người không biết mỏi</span> */}
           </div>
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
      <div className="logo">
  
          <div className="logoandslogan">
          <img src="/image5.png" alt="App logo" />
           </div>
      </div>
    </div>
  );
};

export default Sidebar; 