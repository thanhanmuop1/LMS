import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown } from 'antd';
import axios from 'axios';
import { ArrowLeftOutlined, UserOutlined, BookOutlined, LogoutOutlined, CaretDownOutlined } from '@ant-design/icons';
import './CourseVideoNavbar.css';

const CourseVideoNavbar = ({ courseTitle }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUserData(null);
    navigate('/login');
  };

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
      onClick: handleLogout
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
              {userData?.avatar ? (
                <img 
                  src={`${process.env.REACT_APP_API_URL}${userData.avatar}`} 
                  alt="Avatar" 
                  className="avatar-image"
                />
              ) : (
                userData?.full_name?.[0]?.toUpperCase() || userData?.role?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <span className="user-name">{userData?.full_name || userData?.username}</span>
            <CaretDownOutlined className="dropdown-icon" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default CourseVideoNavbar; 