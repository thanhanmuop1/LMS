import React, { useState } from 'react';
import { Form, Input, Button, message, Radio } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import AuthLayout from '../layout/AuthLayout';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/register', values);
            message.success(response.data.message || 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.');
            navigate('/check-email', { 
                state: { 
                    email: values.email 
                } 
            });
        } catch (error) {
            message.error(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Form
                name="register"
                onFinish={onFinish}
                layout="vertical"
                className="auth-form"
            >
                <h2>Đăng ký</h2>
                <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Họ và tên"
                    name="full_name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
                             message: 'Mật khẩu phải có ít nhất 6 ký tự, 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số!' }
                    ]}
                >
                    <Input.Password onChange={() => {
                        form.validateFields(['confirm_password']);
                    }} />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirm_password"
                    dependencies={['password']}
                    rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            }
                        })
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Bạn là"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                    <Radio.Group>
                        <Radio value="student">Học viên</Radio>
                        <Radio value="teacher">Giảng viên</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Đăng ký
                    </Button>
                </Form.Item>

                <div className="auth-links">
                    <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
                </div>
            </Form>
        </AuthLayout>
    );
};

export default Register; 