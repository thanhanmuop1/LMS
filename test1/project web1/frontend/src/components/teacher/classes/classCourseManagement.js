import React, { useState, useEffect } from 'react';
import { Table, Button, message, Space, Modal } from 'antd';
import { DeleteOutlined, VideoCameraOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../common/navbar/navbar';
import Sidebar from '../../common/sidebar/sidebar';
import './ClassManagement.css';

const { confirm } = Modal;

const ClassCourseManagement = () => {
    const { classId } = useParams();
    const [courses, setCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    // Fetch khóa học trong lớp
    const fetchClassCourses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/teacher/classes/${classId}/courses`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách khóa học');
        } finally {
            setLoading(false);
        }
    };

    // Fetch khóa học có thể thêm
    const fetchAvailableCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/teacher/courses`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (response.data) {
                setAvailableCourses(response.data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách khóa học');
        }
    };

    useEffect(() => {
        fetchClassCourses();
    }, [classId]);

    const handleDelete = (courseId) => {
        confirm({
            title: 'Xác nhận xóa khóa học',
            content: 'Bạn có chắc chắn muốn xóa khóa học này khỏi lớp?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.delete(
                        `${process.env.REACT_APP_API_URL}/teacher/classes/${classId}/courses/${courseId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    if (response.data.success) {
                        message.success('Xóa khóa học khỏi lớp thành công');
                        fetchClassCourses();
                    }
                } catch (error) {
                    message.error('Không thể xóa khóa học khỏi lớp');
                }
            }
        });
    };

    const handleAddCourse = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/teacher/classes/${classId}/courses`,
                { courseId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (response.data.success) {
                message.success('Thêm khóa học vào lớp thành công');
                setIsModalVisible(false);
                fetchClassCourses();
            }
        } catch (error) {
            message.error('Không thể thêm khóa học vào lớp');
        }
    };

    const handleVideoManagement = (courseId) => {
        navigate(`/teacher/courses/${courseId}/videos`);
    };

    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<VideoCameraOutlined />}
                        onClick={() => handleVideoManagement(record.id)}
                        title="Quản lý video"
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        title="Xóa khỏi lớp"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="page-content">
                    <div className="content-container">
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button onClick={() => navigate('/teacher/classes')}>
                                Quay lại danh sách lớp
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    fetchAvailableCourses();
                                    setIsModalVisible(true);
                                }}
                            >
                                Thêm khóa học
                            </Button>
                        </div>
    
                        <Table
                            columns={columns}
                            dataSource={courses}
                            loading={loading}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showTotal: (total) => `Tổng số ${total} khóa học`,
                            }}
                        />
    
                        <Modal
                            title="Thêm khóa học vào lớp"
                            open={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={null}
                        >
                            <Table
                                columns={[
                                    {
                                        title: 'Tên khóa học',
                                        dataIndex: 'title',
                                        key: 'title',
                                    },
                                    {
                                        title: 'Thao tác',
                                        key: 'action',
                                        render: (_, record) => (
                                            <Button
                                                type="primary"
                                                onClick={() => handleAddCourse(record.id)}
                                            >
                                                Thêm vào lớp
                                            </Button>
                                        ),
                                    },
                                ]}
                                dataSource={availableCourses.filter(
                                    course => !courses.some(c => c.id === course.id)
                                )}
                                rowKey="id"
                                pagination={false}
                            />
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassCourseManagement;
