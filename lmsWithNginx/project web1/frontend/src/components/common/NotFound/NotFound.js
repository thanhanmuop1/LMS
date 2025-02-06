import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Result } from 'antd';
import './NotFound.css';

const { Title, Text } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <Result
        status="404"
        title={
          <Title level={2} className="not-found-title">
            Không tìm thấy trang
          </Title>
        }
        subTitle={
          <Text className="not-found-subtitle">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </Text>
        }
        extra={[
          <Button 
            type="primary" 
            onClick={goHome}
            className="not-found-button"
            key="home"
          >
            Về trang chủ
          </Button>,
          <Button 
            onClick={goBack}
            className="not-found-button"
            key="back"
          >
            Quay lại
          </Button>
        ]}
      />
    </div>
  );
};

export default NotFound; 