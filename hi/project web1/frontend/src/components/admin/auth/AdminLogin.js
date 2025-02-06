import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Row, Col, Divider } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axiosConfig from '../../../utils/axiosConfig';
import './AdminAuth.css';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axiosConfig.post('/admin/login', values);
      
      if (response.data.success) {
        localStorage.setItem('role', 'admin');
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        message.success('Đăng nhập thành công');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <Row justify="center" align="middle" className="auth-row">
        <Col xs={20} sm={16} md={10} lg={7}>
          <Card className="admin-auth-card">
            <div className="auth-header">
              <Title level={3} className="auth-title">Đăng nhập</Title>
              <Text type="secondary" className="auth-subtitle">
                Đăng nhập để quản lý hệ thống
              </Text>
            </div>

            <Form
              form={form}
              onFinish={handleLogin}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label="Email hoặc tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập' },
                ]}
              >
                <Input placeholder="Nhập email hoặc tên đăng nhập" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="auth-button"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <Divider plain>
                <Text type="secondary">Hoặc</Text>
              </Divider>

              <div className="auth-links">
                <Text type="secondary">Chưa có tài khoản? </Text>
                <Link to="/admin/register">Đăng ký ngay</Link>
              </div>

              <div className="auth-links forgot-password">
                <Link to="/admin/forgot-password">Quên mật khẩu?</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminLogin; 