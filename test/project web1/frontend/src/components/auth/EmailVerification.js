import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Result, Spin, Button, Layout } from 'antd';
import axios from 'axios';

const { Content } = Layout;

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/verify-email/${token}`);
                setStatus(response.data.status);
                setMessage(response.data.message);
                
                if (response.data.status === 'success' || response.data.status === 'already-verified') {
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi xác thực email');
            } finally {
                setVerifying(false);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    const getResultProps = () => {
        switch (status) {
            case 'success':
                return {
                    status: 'success',
                    title: 'Xác thực email thành công!',
                    subTitle: 'Bạn sẽ được chuyển đến trang đăng nhập trong vài giây...'
                };
            case 'already-verified':
                return {
                    status: 'info',
                    title: 'Email đã được xác thực',
                    subTitle: 'Bạn sẽ được chuyển đến trang đăng nhập trong vài giây...'
                };
            case 'invalid':
            case 'error':
                return {
                    status: 'error',
                    title: 'Xác thực thất bại',
                    subTitle: message,
                    extra: [
                        <Button type="primary" key="console" onClick={() => navigate('/register')}>
                            Đăng ký lại
                        </Button>
                    ]
                };
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {verifying ? (
                    <Result
                        icon={<Spin size="large" />}
                        title="Đang xác thực email..."
                        subTitle="Vui lòng đợi trong giây lát"
                    />
                ) : (
                    <Result {...getResultProps()} />
                )}
            </Content>
        </Layout>
    );
};

export default EmailVerification; 