import React, { useState, useEffect } from 'react';
import { Button, message, Empty } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import axiosConfig from '../../../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../common/navbar/navbar';
import Sidebar from '../../common/sidebar/sidebar';
import CourseCard from '../../common/card/CourseCard';
import { getImageUrl } from '../../../utils/imageConfig';
import './EnrolledClasses.css';

const ClassCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { classId } = useParams();

    useEffect(() => {
        fetchClassCourses();
    }, [classId]);

    const fetchClassCourses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axiosConfig.get(
                `/student/classes/${classId}/courses`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log(response.data);
            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (error) {
            message.error('Không thể tải danh sách khóa học');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="page-content">
                    <div className="content-container">
                        <div className="header">
                            <Button 
                                icon={<LeftOutlined />} 
                                onClick={() => navigate('/enrolled-classes')}
                            >
                                Quay lại
                            </Button>
                            <h2 className="page-title">Danh sách khóa học</h2>
                        </div>

                        {courses.length === 0 ? (
                            <Empty description="Chưa có khóa học nào trong lớp này" />
                        ) : (
                            <div className="courses-grid">
                                {courses.map(course => (
                                    <CourseCard
                                        key={course.id}
                                        course={{
                                            ...course,
                                            thumbnail: getImageUrl(course.thumbnail)
                                        }}
                                        onCardClick={handleCardClick}
                                        showEnrollmentStatus={false}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassCourse;
