import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import CardComponent from './card';
import Sidebar from '../common/sidebar/sidebar';
import Navbar from '../common/navbar/navbar';
import '../layout/layout.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verifyStatus = params.get('verifyStatus');
    
    if (verifyStatus) {
      switch (verifyStatus) {
        case 'success':
          message.success('Xác thực email thành công! Vui lòng đăng nhập để tiếp tục.');
          setTimeout(() => navigate('/login'), 2000);
          break;
        case 'already-verified':
          message.info('Email đã được xác thực trước đó.');
          setTimeout(() => navigate('/login'), 2000);
          break;
        case 'invalid':
          message.error('Link xác thực không hợp lệ hoặc đã hết hạn.');
          break;
        case 'error':
          message.error('Có lỗi xảy ra trong quá trình xác thực.');
          break;
        default:
          break;
      }
      // Xóa query parameter sau khi đã xử lý
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content">
          <CardComponent />
        </main>
      </div>
    </div>
  );
};

export default Home; 