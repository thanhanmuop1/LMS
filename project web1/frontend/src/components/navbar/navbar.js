import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role);

    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
      setUserRole(localStorage.getItem('role'));
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    setShowMenu(false);
    message.success('Đăng xuất thành công');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-auth">
        {isLoggedIn ? (
          <div className="user-menu" ref={menuRef}>
            <div 
              className="user-avatar"
              onClick={() => setShowMenu(!showMenu)}
            >
              {userRole?.[0]?.toUpperCase() || 'U'}
            </div>
            {showMenu && (
              <div className="dropdown-menu">
                <button
                  className="menu-item"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;