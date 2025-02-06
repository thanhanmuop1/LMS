import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Result, Button, Spin, message } from 'antd';
import axiosInstance from '../../../utils/axiosConfig';

const JoinClassPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const joinClass = async () => {
            try {
                const encodedData = searchParams.get('data');
                
                if (!encodedData) {
                    setError('Link không hợp lệ');
                    setLoading(false);
                    return;
                }

                // Giải mã Base64
                const decodedData = JSON.parse(atob(encodedData));

                // Kiểm tra thời hạn
                if (Date.now() > decodedData.expires) {
                    setError('Link đã hết hạn');
                    setLoading(false);
                    return;
                }

                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login', { 
                        state: { 
                            returnUrl: `/join-class?${searchParams.toString()}` 
                        } 
                    });
                    return;
                }

                const response = await axiosInstance.post(
                    '/student/join-class',
                    {
                        classCode: decodedData.code,
                        password: decodedData.password
                    }
                );

                if (response.data.success) {
                    message.success('Tham gia lớp học thành công');
                    navigate('/enrolled-classes');
                }
            } catch (error) {
                if (error.name === 'SyntaxError') {
                    setError('Link không hợp lệ');
                } else {
                    setError(error.response?.data?.message || 'Không thể tham gia lớp học');
                }
            } finally {
                setLoading(false);
            }
        };

        joinClass();
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <Spin size="large" />
                <div>Đang xử lý tham gia lớp học...</div>
            </div>
        );
    }

    if (error) {
        return (
            <Result
                status="error"
                title="Không thể tham gia lớp học"
                subTitle={error}
                extra={[
                    <Button 
                        type="primary" 
                        key="console"
                        onClick={() => navigate('/enrolled-classes')}
                    >
                        Về trang lớp học
                    </Button>
                ]}
            />
        );
    }

    return null;
};

export default JoinClassPage; 