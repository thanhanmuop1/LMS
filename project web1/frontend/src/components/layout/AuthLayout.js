import React from 'react';
import AuthNavbar from '../auth/AuthNavbar';
import './auth-layout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <AuthNavbar />
      <div className="auth-content">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout; 