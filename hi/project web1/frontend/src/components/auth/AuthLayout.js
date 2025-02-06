import React from 'react';
import AuthNavbar from './AuthNavbar';
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