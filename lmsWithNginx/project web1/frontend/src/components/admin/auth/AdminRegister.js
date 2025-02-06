import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Row, Col, Divider } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axiosConfig from '../../../utils/axiosConfig';
import './AdminAuth.css';

const { Title, Text } = Typography;

const AdminRegister = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const response = await axiosConfig.post('/admin/register', values);

      if (response.data.success) {
        message.success('Đăng ký thành công!');
        navigate('/check-email', { 
          state: { email: values.email }
        });
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại');
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
              <Title level={3} className="auth-title">Đăng ký</Title>
              <Text type="secondary" className="auth-subtitle">Điền thông tin để tạo tài khoản</Text>
            </div>

            <Form 
              form={form}
              onFinish={handleRegister} 
              layout="vertical" 
              size="large"
              requiredMark={false}
            >
              <Form.Item 
                name="full_name" 
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Nhập họ và tên đầy đủ" />
              </Form.Item>

              <Form.Item 
                name="username" 
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                  { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
                ]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>

              <Form.Item 
                name="email" 
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập địa chỉ email" />
              </Form.Item>

              <Form.Item 
                name="password" 
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                  { 
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message: 'Mật khẩu phải có chữ hoa, chữ thường và số' 
                  }
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block
                  className="auth-button"
                >
                  Đăng ký
                </Button>
              </Form.Item>

              <Divider plain>
                <Text type="secondary">Hoặc</Text>
              </Divider>

              <div className="auth-links">
                <Text type="secondary">Đã có tài khoản? </Text>
                <Link to="/admin/login">Đăng nhập ngay</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminRegister; 