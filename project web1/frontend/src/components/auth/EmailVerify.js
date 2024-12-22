import React, { useEffect, useState } from 'react';
import { Result, Spin } from 'antd';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../layout/AuthLayout';

const EmailVerify = () => {
    const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const { token } = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/verify-email/${token}`);
                setVerificationStatus('success');
                setMessage(response.data.message);
            } catch (error) {
                setVerificationStatus('error');
                setMessage(error.response?.data?.message || 'Xác thực email thất bại');
            }
        };

        verifyEmail();
    }, [token]);

    const renderContent = () => {
        switch (verificationStatus) {
            case 'verifying':
                return (
                    <Result
                        icon={<Spin size="large" />}
                        title="Đang xác thực email..."
                    />
                );
            case 'success':
                return (
                    <Result
                        status="success"
                        title="Xác thực email thành công!"
                        subTitle={message}
                        extra={[
                            <Link 
                                key="login" 
                                to="/login"
                                className="auth-form ant-btn ant-btn-primary"
                                style={{ display: 'inline-block', marginTop: '16px' }}
                            >
                                Đăng nhập ngay
                            </Link>
                        ]}
                    />
                );
            case 'error':
                return (
                    <Result
                        status="error"
                        title="Xác thực email thất bại"
                        subTitle={message}
                        extra={[
                            <Link 
                                key="register" 
                                to="/register"
                                className="auth-form ant-btn ant-btn-primary"
                                style={{ display: 'inline-block', marginTop: '16px' }}
                            >
                                Đăng ký lại
                            </Link>
                        ]}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AuthLayout>
            <div className="auth-form">
                {renderContent()}
            </div>
        </AuthLayout>
    );
};

export default EmailVerify; 