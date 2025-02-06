import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, message, Input, Button, Space } from 'antd';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../utils/axiosConfig';
import Navbar from '../../navbar/navbar';
import Sidebar from '../../sidebar/sidebar';
import './CourseFullDescription.css';

const { Title } = Typography;
const { TextArea } = Input;

const CourseFullDescription = () => {
    const { courseId } = useParams();
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        fetchDescription();
    }, [courseId]);

    const fetchDescription = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/courses/${courseId}/description`);
            const descriptionText = response.data || 'Chưa có mô tả chi tiết';
            setDescription(descriptionText);
            setEditedDescription(descriptionText);
        } catch (error) {
            console.error('Error fetching course description:', error);
            message.error('Không thể tải mô tả khóa học');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await axiosInstance.put(`/courses/${courseId}/description`, {
                description: editedDescription
            });
            setDescription(editedDescription);
            setIsEditing(false);
            message.success('Cập nhật mô tả thành công');
        } catch (error) {
            console.error('Error updating description:', error);
            message.error('Không thể cập nhật mô tả khóa học');
        }
    };

    const handleCancel = () => {
        setEditedDescription(description);
        setIsEditing(false);
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="course-description-container">
                    <Card className="description-card">
                        <div className="description-header">
                            <Title level={2}>Mô tả chi tiết khóa học</Title>
                            {!isEditing && (
                                <Button type="primary" onClick={handleEdit}>
                                    Chỉnh sửa
                                </Button>
                            )}
                        </div>
                        
                        {loading ? (
                            <div className="loading-container">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <div className="description-content">
                                {isEditing ? (
                                    <>
                                        <TextArea
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            autoSize={{ minRows: 6 }}
                                            className="description-textarea"
                                        />
                                        <Space className="edit-buttons">
                                            <Button type="primary" onClick={handleSave}>
                                                Lưu
                                            </Button>
                                            <Button onClick={handleCancel}>
                                                Hủy
                                            </Button>
                                        </Space>
                                    </>
                                ) : (
                                    <pre className="description-text">
                                        {description}
                                    </pre>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CourseFullDescription; 