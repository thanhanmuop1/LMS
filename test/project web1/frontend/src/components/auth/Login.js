import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import authService from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await authService.login(values);
      const { user } = response;
      
      window.dispatchEvent(new Event('loginSuccess'));
      message.success('Đăng nhập thành công');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.needsVerification) {
        message.warning('Vui lòng xác thực email trước khi đăng nhập');
      } else {
        message.error(error.response?.data?.message || 'Đăng nhập thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        className="auth-form"
      >
        <h2>Đăng nhập</h2>
        <Form.Item
          label="Email hoặc tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập email hoặc username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form.Item>

        <div className="auth-links">
          <Link to="/register">Chưa có tài khoản? Đăng ký ngay</Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login; 