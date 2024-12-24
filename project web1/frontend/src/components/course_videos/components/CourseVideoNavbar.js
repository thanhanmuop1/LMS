import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown } from 'antd';
import { ArrowLeftOutlined, UserOutlined, BookOutlined, LogoutOutlined, CaretDownOutlined } from '@ant-design/icons';
import './CourseVideoNavbar.css';

const CourseVideoNavbar = ({ courseTitle }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const userString = localStorage.getItem('user');
  let userFullName = '';
  
  try {
    const userObj = JSON.parse(userString);
    userFullName = userObj.full_name || userObj.username;
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  const menuItems = [
    {
      key: 'profile',
      label: 'Hồ sơ',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'courses',
      label: 'Khóa học của tôi',
      icon: <BookOutlined />,
      onClick: () => navigate('/enrolled-courses')
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  ];

  return (
    <div className="course-video-navbar">
      <div className="navbar-left">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="back-button"
        >
          Trang chủ
        </Button>
        <div className="course-title">
          <h2>{courseTitle || 'Khóa học'}</h2>
        </div>
      </div>

      <div className="navbar-right">
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div className="user-menu">
            <div className="user-avatar">
              {userFullName?.[0]?.toUpperCase() || userRole?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="user-name">{userFullName}</span>
            <CaretDownOutlined className="dropdown-icon" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default CourseVideoNavbar; 