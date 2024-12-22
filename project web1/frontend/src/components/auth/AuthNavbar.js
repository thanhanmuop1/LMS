import React from 'react';
import { Link } from 'react-router-dom';

const AuthNavbar = () => {
  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-container">
        <Link to="/" className="auth-navbar-logo">
          Learning App
        </Link>
      </div>
    </nav>
  );
};

export default AuthNavbar; 