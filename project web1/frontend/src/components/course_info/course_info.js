import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message, Descriptions, Statistic, Row, Col, Rate } from 'antd';
import { PlayCircleOutlined, FileOutlined, TeamOutlined, StarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';
import './course_info.css';

const CourseInfo = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courseEnroll/courses/${courseId}/details`);
      setCourseDetails(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      message.error('Không thể tải thông tin khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await axios.post('http://localhost:5000/courseEnroll/enroll', 
        { courseId }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      message.success('Đăng ký khóa học thành công');
      navigate(`/course/${courseId}`);
    } catch (error) {
      message.error('Lỗi khi đăng ký khóa học');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!courseDetails) return <div>Không tìm thấy khóa học</div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="course-info-container">
          <div className="course-preview">
            <div className="course-preview-left">
              <h1>{courseDetails?.title}</h1>
              <p className="course-description">{courseDetails?.description}</p>
              
              <div className="course-meta">
                <div className="instructor">
                  Giảng viên: <span>{courseDetails?.teacher_name}</span>
                </div>
              </div>

              <div className="course-content">
                <h2>Nội dung khóa học</h2>
                <div className="content-stats">
                  <div>
                    <PlayCircleOutlined /> {courseDetails?.total_videos || 0} video
                  </div>
                </div>
                {courseDetails?.chapters?.map((chapter) => (
                  <Card key={chapter.id} className="chapter-card">
                    <h3>{chapter.title}</h3>
                    <p>{chapter.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="course-preview-right">
              <Card className="course-card">
                <img 
                  src={courseDetails?.thumbnail} 
                  alt={courseDetails?.title}
                  className="course-thumbnail" 
                />
                <div className="card-content">
                  <Button type="primary" block onClick={handleEnroll}>
                    Đăng ký học ngay
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo; 