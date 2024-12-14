import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/auth/register', values);
            message.success('Đăng ký thành công');
            navigate('/login');
        } catch (error) {
            message.error(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Form
                form={form}
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
                    hasFeedback
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

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register; 