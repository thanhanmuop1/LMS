import React from 'react';
import { Form, Input, Button, message } from 'antd';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await authService.login(values);
            const { user } = response;
            console.log('Login response:', response); // Debug log
            console.log('User role:', user.role); // Debug log
            
            // Dispatch event để cập nhật UI
            window.dispatchEvent(new Event('loginSuccess'));
            
            message.success('Đăng nhập thành công');
            
            navigate('/');
        } catch (error) {
            console.error('Login error:', error); // Debug log
            message.error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="auth-container">
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
                    <Button type="primary" htmlType="submit" block>
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login; 