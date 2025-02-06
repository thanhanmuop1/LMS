import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import CardComponent from './card';
import Sidebar from '../common/sidebar/sidebar';
import Navbar from '../common/navbar/navbar';
import schoolService from '../../services/schoolService';
import '../layout/layout.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDomainChecked, setDomainChecked] = useState(false);

  useEffect(() => {
    const checkSchoolDomain = async () => {
      try {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');

        // Chỉ kiểm tra nếu có subdomain
        if (parts.length > 1 && parts[0] !== 'www') {
          const response = await schoolService.checkDomain();
          if (!response.success) {
            navigate('/not-found');
            return;
          }
        }
        setDomainChecked(true); // Đánh dấu đã kiểm tra domain
      } catch (error) {
        console.error('Error checking domain:', error);
        if (error.response?.data?.notFound) {
          navigate('/not-found');
        }
      } finally {
        setLoading(false);
      }
    };

    // Xử lý verifyStatus trước
    const params = new URLSearchParams(location.search);
    const verifyStatus = params.get('verifyStatus');
    if (verifyStatus) {
      handleVerifyStatus(verifyStatus);
      navigate('/', { replace: true });
    } else if (!isDomainChecked) {
      // Chỉ check domain khi không có verifyStatus và chưa kiểm tra domain
      checkSchoolDomain();
    }
  }, [location.search, navigate, isDomainChecked]);

  const handleVerifyStatus = (status) => {
    switch (status) {
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
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
