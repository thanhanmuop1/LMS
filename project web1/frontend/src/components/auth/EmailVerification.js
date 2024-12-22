import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Result, Spin, Button } from 'antd';
import axios from 'axios';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleVerification = async () => {
        if (verifying || success) return;

        try {
            setVerifying(true);
            const response = await axios.get(`http://localhost:5000/verify-email/${token}`);
            setSuccess(true);
            setVerifying(false);

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            if (error.response?.status === 400) {
                setError(error.response.data.message);
                if (error.response.data.alreadyVerified) {
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            } else {
                setError('Có lỗi xảy ra khi xác thực email');
            }
            setVerifying(false);
        }
    };

    if (verifying) {
        return (
            <div className="verification-container">
                <Spin size="large" tip="Đang xác thực email..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="verification-container">
                <Result
                    status={error.includes('đã được xác thực') ? 'info' : 'error'}
                    title={error.includes('đã được xác thực') ? 'Thông báo' : 'Xác thực email thất bại'}
                    subTitle={
                        <>
                            <p>{error}</p>
                            {error.includes('đã được xác thực') && 
                                <p>Bạn sẽ được chuyển đến trang đăng nhập trong vài giây...</p>
                            }
                        </>
                    }
                />
            </div>
        );
    }

    if (success) {
        return (
            <div className="verification-container">
                <Result
                    status="success"
                    title="Xác thực email thành công!"
                    subTitle="Bạn sẽ được chuyển đến trang đăng nhập trong vài giây..."
                />
            </div>
        );
    }

    return (
        <div className="verification-container">
            <Result
                title="Xác thực email của bạn"
                subTitle="Nhấn nút bên dưới để xác thực email của bạn"
                extra={[
                    <Button 
                        type="primary" 
                        key="verify" 
                        onClick={handleVerification}
                        loading={verifying}
                    >
                        Xác thực email
                    </Button>
                ]}
            />
        </div>
    );
};

export default EmailVerification; 