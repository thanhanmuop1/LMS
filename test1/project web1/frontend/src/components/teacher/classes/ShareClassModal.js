import React from 'react';
import { Modal, Button, Alert, message   } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../../../assets/images/95465964_p0.png';

const ShareClassModal = ({ visible, onCancel, classData }) => {
    const generateJoinClassUrl = (classCode, password) => {
        const payload = {
            code: classCode,
            password: password,
            expires: Date.now() + (24 * 60 * 60 * 1000),
            timestamp: Date.now()
        };

        const encodedData = btoa(JSON.stringify(payload));
        const baseUrl = `${process.env.REACT_APP_URL || window.location.origin}/join-class`;
        const params = new URLSearchParams();
        params.append('data', encodedData);
        
        return `${baseUrl}?${params.toString()}`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success('Đã sao chép vào clipboard');
        }).catch(() => {
            message.error('Không thể sao chép vào clipboard');
        });
    };

    const handleDownloadQR = () => {
        const qrCodeElement = document.querySelector('.qr-code-container svg');
        if (qrCodeElement) {
            const svgData = new XMLSerializer().serializeToString(qrCodeElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Tăng kích thước canvas để QR code rõ nét hơn
                canvas.width = img.width * 2;
                canvas.height = img.height * 2;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(2, 2); // Scale up để chất lượng tốt hơn
                ctx.drawImage(img, 0, 0);
                
                const pngUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = `qr-${classData.class_code}-${Date.now()}.png`;
                downloadLink.href = pngUrl;
                downloadLink.click();
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    const joinUrl = classData ? generateJoinClassUrl(
        classData.class_code,
        classData.requires_password ? classData.password : null
    ) : '';

    return (
        <Modal
            title="Chia sẻ lớp học"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="copy-link" type="primary" onClick={() => copyToClipboard(joinUrl)}>
                    Sao chép link
                </Button>,
                <Button key="close" onClick={onCancel}>
                    Đóng
                </Button>
            ]}
            width={600}
        >
            {classData && (
                <div>
                    <div style={{ 
                        display: 'flex', 
                        gap: 24,
                        marginBottom: 24,
                        padding: 16,
                        background: '#f5f5f5',
                        borderRadius: 8 
                    }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ marginBottom: 16 }}>Thông tin lớp học</h3>
                            <p style={{ marginBottom: 8 }}><strong>Tên lớp:</strong> {classData.name}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span><strong>Mã lớp:</strong> {classData.class_code}</span>
                                <Button 
                                    type="primary" 
                                    size="small"
                                    onClick={() => copyToClipboard(classData.class_code)}
                                >
                                    Sao chép
                                </Button>
                            </div>
                            {classData.requires_password && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span><strong>Mật khẩu:</strong> {classData.password}</span>
                                    <Button 
                                        type="primary" 
                                        size="small"
                                        onClick={() => copyToClipboard(classData.password)}
                                    >
                                        Sao chép
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            padding: 16,
                            background: 'white',
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }} className="qr-code-container">
                            <QRCodeSVG 
                                value={joinUrl}
                                size={150}
                                level="H"
                                includeMargin={true}
                                imageSettings={{
                                    src: logo,
                                    height: 24,
                                    width: 24,
                                    excavate: true,
                                }}
                            />
                            <Button
                                type="link"
                                icon={<QrcodeOutlined />}
                                onClick={handleDownloadQR}
                            >
                                Tải mã QR
                            </Button>
                        </div>
                    </div>

                    <Alert
                        message="Hướng dẫn"
                        description={
                            <div>
                                <p>Học viên có thể tham gia lớp bằng một trong các cách sau:</p>
                                <ol>
                                    <li>Quét mã QR bằng điện thoại để truy cập trực tiếp</li>
                                    <li>Nhấp vào link tham gia đã được chia sẻ</li>
                                    <li>Hoặc thực hiện các bước sau:
                                        <ul>
                                            <li>Đăng nhập vào hệ thống</li>
                                            <li>Chọn "Tham gia lớp" từ menu</li>
                                            <li>Nhập mã lớp: <strong>{classData.class_code}</strong></li>
                                            {classData.requires_password && (
                                                <li>Nhập mật khẩu lớp học</li>
                                            )}
                                        </ul>
                                    </li>
                                </ol>
                            </div>
                        }
                        type="info"
                        showIcon
                    />
                </div>
            )}
        </Modal>
    );
};

export default ShareClassModal; 