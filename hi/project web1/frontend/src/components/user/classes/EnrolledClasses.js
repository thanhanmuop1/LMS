import React, { useState, useEffect } from 'react';
import { Button, message, Empty, Modal, Input, Card, Dropdown } from 'antd';
import { FileTextOutlined, LockOutlined, EditOutlined, PlusOutlined, EllipsisOutlined, UserDeleteOutlined, CloseOutlined, KeyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axiosConfig from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/navbar/navbar';
import Sidebar from '../../common/sidebar/sidebar';
import { getImageUrl } from '../../../utils/imageConfig';
import './EnrolledClasses.css';

const EnrolledClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEnrolledClasses();
    }, []);

    const fetchEnrolledClasses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axiosConfig.get(
                `/student/enrolled-classes`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (response.data.success) {
                setClasses(response.data.data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách lớp học');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClass = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosConfig.post(
                `/student/join-class`,
                {
                    classCode,
                    password
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (response.data.success) {
                message.success('Tham gia lớp học thành công');
                setIsJoinModalVisible(false);
                setClassCode('');
                setPassword('');
                fetchEnrolledClasses();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Không thể tham gia lớp học');
        }
    };

    const handleCardClick = (classId) => {
        navigate(`/student/classes/${classId}/courses`);
    };

    const ClassCard = ({ classData }) => {
        const handleLeaveClass = () => {
            Modal.confirm({
                title: 'Xác nhận rời khỏi lớp',
                content: `Bạn có chắc chắn muốn rời khỏi lớp "${classData.name}"?`,
                okText: 'Rời khỏi',
                cancelText: 'Hủy',
                okButtonProps: { 
                    danger: true,
                    icon: <UserDeleteOutlined />
                },
                onOk: async () => {
                    try {
                        const token = localStorage.getItem('token');
                        await axiosConfig.delete(
                            `/student/classes/${classData.id}/leave`,
                            {
                                headers: { Authorization: `Bearer ${token}` }
                            }
                        );
                        message.success('Đã rời khỏi lớp học');
                        fetchEnrolledClasses();
                    } catch (error) {
                        message.error('Không thể rời khỏi lớp học');
                    }
                }
            });
        };

        const items = [
            {
                key: 'leave',
                icon: <UserDeleteOutlined style={{ color: '#ff4d4f' }} />,
                label: 'Rời khỏi lớp',
                onClick: (e) => {
                    e.domEvent.stopPropagation();
                    handleLeaveClass();
                }
            }
        ];

        const initials = classData.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

        return (
            <Card className="class-card" onClick={() => handleCardClick(classData.id)}>
                <div className="class-card-content">
                    <div className="class-card-header">
                        <div className="class-avatar" style={{ 
                            backgroundColor: classData.thumbnail ? 'transparent' : getRandomColor(classData.name)
                        }}>
                            {classData.thumbnail ? (
                                <img 
                                    src={getImageUrl(classData.thumbnail)}
                                    alt={classData.name}
                                    className="avatar-image"
                                />
                            ) : initials}
                        </div>
                        <div className="class-title">
                            {classData.name}
                        </div>
                        <Dropdown 
                            menu={{ items }} 
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <Button 
                                type="text" 
                                icon={<EllipsisOutlined />}  
                                className="more-button"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Dropdown>
                    </div>
                    <div className="class-card-footer">
                        <div className="class-actions">
                            <Button type="text" icon={<FileTextOutlined />} disabled={true}/>
                            <Button type="text" icon={<LockOutlined />} disabled={true}/>
                            <Button type="text" icon={<EditOutlined />} disabled={true}/>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    const getRandomColor = (str) => {
        const colors = [
            '#E74856', '#0078D4', '#107C10', 
            '#5C2D91', '#FF8C00', '#008272',
            '#E74856', '#0078D4', '#107C10', 
            '#5C2D91', '#FF8C00', '#008272'
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="page-content">
                    <div className="content-container">
                        <div className="header">
                            <div></div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsJoinModalVisible(true)}
                            >
                                Tham gia lớp
                            </Button>
                        </div>

                        <Card className="class-section">
                            <div className="section-header">
                                <h3>Lớp học</h3>
                                <Button type="text" size="small">▼</Button>
                            </div>

                            <div className="class-grid">
                                {classes.length === 0 ? (
                                    <Empty description="Bạn chưa tham gia lớp học nào" />
                                ) : (
                                    <div className="class-cards">
                                        {classes.map(classItem => (
                                            <ClassCard key={classItem.id} classData={classItem} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Modal
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>Tham gia lớp học</span>
                                </div>
                            }
                            open={isJoinModalVisible}
                            onOk={handleJoinClass}
                            onCancel={() => {
                                setIsJoinModalVisible(false);
                                setClassCode('');
                                setPassword('');
                            }}
                            okText="Tham gia"
                            cancelText="Hủy"
                            okButtonProps={{
                                icon: <PlusOutlined />,
                                style: { 
                                    background: '#1890ff',
                                    borderColor: '#1890ff'
                                }
                            }}
                            cancelButtonProps={{
                                icon: <CloseOutlined />
                            }}
                        >
                            <div style={{ padding: '20px 0' }}>
                                <Input
                                    prefix={<KeyOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Nhập mã lớp học"
                                    value={classCode}
                                    onChange={(e) => setClassCode(e.target.value)}
                                    style={{ 
                                        marginBottom: 16,
                                        height: '40px',
                                        borderRadius: '6px'
                                    }}
                                />
                                <Input
                                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Nhập mật khẩu (nếu có)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        height: '40px', 
                                        borderRadius: '6px'
                                    }}
                                />
                                <div style={{ 
                                    marginTop: '20px',
                                    padding: '12px',
                                    background: '#f5f5f5',
                                    borderRadius: '6px'
                                }}>
                                    <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                                    <span style={{ fontSize: '14px', color: '#595959' }}>
                                        Nhập mã lớp học do giáo viên cung cấp để tham gia lớp học
                                    </span>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrolledClasses; 