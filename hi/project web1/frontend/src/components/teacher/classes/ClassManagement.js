import React, { useState, useEffect } from 'react';
import { Table, Button, message, Space, Tag, Modal } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PictureOutlined, ShareAltOutlined } from '@ant-design/icons';
import axiosConfig from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import CreateClass from './createClass';
import EditClass from './editClass';
import Navbar from '../../common/navbar/navbar';
import Sidebar from '../../common/sidebar/sidebar';
import './ClassManagement.css';
import ShareClassModal from './ShareClassModal';
import { getImageUrl } from '../../../utils/imageConfig';

const { confirm } = Modal;
const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [selectedClassForShare, setSelectedClassForShare] = useState(null);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axiosConfig.get(`/teacher/classes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setClasses(response.data.data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách lớp học');
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleDelete = async (classId) => {
        confirm({
            title: 'Xác nhận xóa lớp học',
            content: 'Bạn có chắc chắn muốn xóa lớp học này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosConfig.delete(`/teacher/classes/${classId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                message.success('Xóa lớp học thành công');
                fetchClasses();
            }
        } catch (error) {
            message.error('Không thể xóa lớp học');
            console.error('Error deleting class:', error);
        }
            }
        });
    };

    const handleViewCourses = (classId) => {
        navigate(`/teacher/classes/${classId}/courses`);
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            width: 120,
            render: (thumbnail) => (
                <div style={{ width: '80px', height: '80px' }}>
                    {thumbnail ? (
                        <img
                            src={getImageUrl(thumbnail)}
                            alt="Thumbnail"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }}
                        />
                    ) : (
                        <div 
                            style={{
                                width: '100%',
                                height: '100%',
                                background: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px'
                            }}
                        >
                            <PictureOutlined style={{ fontSize: '24px', color: '#999' }} />
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Tên lớp học',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Mã lớp',
            dataIndex: 'class_code',
            key: 'class_code',
            render: (code) => <Tag color="blue">{code}</Tag>
        },
        {
            title: 'Số học viên',
            dataIndex: 'student_count',
            key: 'student_count',
            render: (count) => (
                <Tag color="purple">{count} học viên</Tag>
            ),
        },
        {
            title: 'Số khóa học',
            dataIndex: 'course_count',
            key: 'course_count',
            render: (count) => (
                <Tag color="green">{count} khóa học</Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status === 'active' ? 'green' : 'red';
                let text = status === 'active' ? 'Đang hoạt động' : 'Đã đóng';
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewCourses(record.id)}
                        title="Quản lý khóa học"
                        className='icon-button'
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        title="Chỉnh sửa lớp học"
                        className='icon-button'
                    />
                    <Button
                        type="text"
                        icon={<ShareAltOutlined />}
                        onClick={() => showShareModal(record)}
                        title="Chia sẻ lớp học"
                        className='icon-button'
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const showCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateSuccess = () => {
        fetchClasses();
    };

    const showEditModal = (classData) => {
        setSelectedClass(classData);
        setIsEditModalVisible(true);
    };

    const handleEditSuccess = () => {
        fetchClasses();
    };

    const showShareModal = (classData) => {
        setSelectedClassForShare(classData);
        setIsShareModalVisible(true);
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="page-content">
                    <div className="content-container">
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Quản lý lớp học</h2>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={showCreateModal}
                            >
                                Tạo lớp học mới
                            </Button>
                        </div>

                        <Table 
                            columns={columns} 
                            dataSource={classes} 
                            loading={loading}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `Tổng số ${total} lớp học`,
                            }}
                        />

                        <CreateClass
                            visible={isCreateModalVisible}
                            onCancel={() => setIsCreateModalVisible(false)}
                            onSuccess={handleCreateSuccess}
                        />

                        <EditClass
                            visible={isEditModalVisible}
                            onCancel={() => setIsEditModalVisible(false)}
                            onSuccess={handleEditSuccess}
                            classData={selectedClass}
                        />

                        <ShareClassModal 
                            visible={isShareModalVisible}
                            onCancel={() => setIsShareModalVisible(false)}
                            classData={selectedClassForShare}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassManagement; 