import React from 'react';
import { Result } from 'antd';
import { useLocation } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';

const CheckEmail = () => {
    const location = useLocation();
    const email = location.state?.email;

    return (
        <AuthLayout>
            <div className="auth-form">
                <Result
                    status="success"
                    title="Đăng ký thành công!"
                    subTitle={
                        <>
                            <p>Vui lòng kiểm tra email {email} để xác thực tài khoản.</p>
                            <p>Nếu không nhận được email, vui lòng kiểm tra hộp thư spam.</p>
                        </>
                    }
                />
            </div>
        </AuthLayout>
    );
};

export default CheckEmail; 