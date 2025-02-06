import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message, Descriptions, Statistic, Row, Col, Rate, Tabs, Input, Avatar, Pagination } from 'antd';
import { PlayCircleOutlined, FileOutlined, TeamOutlined, StarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Navbar from '../common/navbar/navbar';
import Sidebar from '../common/sidebar/sidebar';
import './course_info.css';
import axiosConfig from '../../utils/axiosConfig';
import { getImageUrl } from '../../utils/imageConfig';
import userService from '../../services/userService';

const { TextArea } = Input;
const { TabPane } = Tabs;

const CourseInfo = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [courseDescription, setCourseDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState({ rating: 0, rating_text: '' });
  const [ratingStats, setRatingStats] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const token = localStorage.getItem('token');
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetchCourseDetails();
    fetchCourseDescription();
    if (token) {
      checkEnrollmentStatus();
    }
  }, [courseId]);

  const checkEnrollmentStatus = async () => {
    try {
      const response = await axiosConfig.get(
        `/courseEnroll/check/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axiosConfig.get(`/courseEnroll/courses/${courseId}/details`);
      setCourseDetails(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      message.error('Không thể tải thông tin khóa học');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDescription = async () => {
    try {
      const response = await axiosConfig.get(`/courses/${courseId}/description`);
      setCourseDescription(response.data);
    } catch (error) {
      console.error('Error fetching course description:', error);
    }
  };

  const fetchCourseRating = async (page = 1, limit = 5) => {
    try {
      const response = await axiosConfig.get(
        `/courses/${courseId}/rating?page=${page}&limit=${limit}`
      );
      setRatings(response.data.ratings);
      setPages(response.data.pagination);
      console.log('Total pages:', response.data.pagination);
      console.log('Course rating:', response.data);
    } catch (error) {
      console.error('Error fetching course rating:', error);
    }
  };

  const fetchCourseRatingStats = async () => {
    try {
      const response = await axiosConfig.get(`/courses/${courseId}/rating-stats`);
      setRatingStats(response.data);
      console.log('Course rating stats:', response.data);
    } catch (error) {
      console.error('Error fetching course rating stats:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      await axiosConfig.post(`/courseEnroll/enroll`, 
        { courseId }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      message.success('Đăng ký khóa học thành công');
      setIsEnrolled(true);
      navigate(`/course/${courseId}`);
    } catch (error) {
      message.error('Lỗi khi đăng ký khóa học');
    }
  };

  const handleStartLearning = () => {
    navigate(`/course/${courseId}`);
  };

  const handleRatingSubmit = async () => {
    try {
      await axiosConfig.post(`/courses/${courseId}/rating`, {
        rating: userRating.rating,
        rating_text: userRating.rating_text
      });

      message.success('Đánh giá khóa học thành công');
      setUserRating({ rating: 0, rating_text: '' });
      fetchCourseRating();
    } catch (error) {
      console.error('Error submitting rating:', error);
      message.error('Không thể gửi đánh giá');
    }
  };

  const handleTabChange = (activeKey) => {
    if (activeKey === '1') {
      fetchCourseDescription();
    } else if (activeKey === '2') {
      fetchCourseRating();
      fetchCourseRatingStats();
      fetchUserProfile();
    }
  };

  const handlePageChange = (page) => {
    setPages(page);
    fetchCourseRating(page);
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUserProfile(profile);
    } catch (error) {
      message.error('Không thể tải thông tin người dùng');
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
                <div className="rating">
                  {courseDetails?.average_rating}
                  <Rate value={courseDetails?.average_rating} disabled/>
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
                  src={getImageUrl(courseDetails?.thumbnail)} 
                  alt={courseDetails?.title}
                  className="course-thumbnail" 
                />
                <div className="card-content">
                  {isEnrolled ? (
                    <Button 
                      type="primary" 
                      block 
                      onClick={handleStartLearning}
                    >
                      Vào học
                    </Button>
                  ) : (
                    <Button type="primary" block onClick={handleEnroll}>
                      Đăng ký học ngay
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
          <div className="course-details-tabs">
            <Tabs defaultActiveKey="1" onChange={handleTabChange}>
              <TabPane tab="Mô tả chi tiết" key="1">
                <Card className="description-card">
                  <pre className="course-description-content">
                    {courseDescription || 'Chưa có mô tả chi tiết cho khóa học này'}
                  </pre>
                </Card>
              </TabPane>

              <TabPane tab="Đánh giá khóa học" key="2">
                <Card className="rating-card">
                  <Row gutter={24}>
                    <Col span={8}>
                      <div className="rating-statistics">
                        <div className="average-rating-box">
                          <div className="big-rating">{courseDetails?.average_rating || 0}</div>
                          <Rate 
                            disabled 
                            value={courseDetails?.average_rating || 0} 
                            className="average-rating"
                          />
                          <div className="total-reviews">
                            {courseDetails?.rating_count || 0} đánh giá
                          </div>
                        </div>
                        
                        <div className="rating-distribution">
                          {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="rating-bar">
                              <span className="star-label">{star} sao</span>
                              <div className="progress-bar">
                                <div 
                                  className="progress" 
                                  style={{ 
                                    width: `${((ratingStats?.[star] || 0) / 
                                      (ratingStats?.total || 1)) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="count-label">
                                {ratingStats?.[star] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>

                    <Col span={16}>
                      {isEnrolled && (
                        <div className="user-rating-section">
                          <Card className="rating-form">
                            <h3>Đánh giá của bạn</h3>
                            <div className="rating-input">
                              <Rate 
                                value={userRating.rating} 
                                onChange={(value) => setUserRating({ ...userRating, rating: value })}
                                className="rating-stars"
                              />
                              <TextArea
                                value={userRating.rating_text}
                                onChange={(e) => setUserRating({ ...userRating, rating_text: e.target.value })}
                                placeholder="Chia sẻ trải nghiệm học tập của bạn..."
                                rows={4}
                                className="rating-textarea"
                              />
                              <Button 
                                type="primary" 
                                onClick={handleRatingSubmit}
                                className="submit-rating-btn"
                              >
                                Gửi đánh giá
                              </Button>
                            </div>
                          </Card>
                        </div>
                      )}

                      <div className="rating-list">
                        {ratings.map((rating, index) => (
                          <Card key={index} className="rating-item">
                            <div className="rating-header">
                              <div className="user-info">
                                <Avatar size={40} src={getImageUrl(userProfile?.avatar)} />
                                <div className="user-details">
                                  <strong>{userProfile?.name}</strong>
                                  <span className="rating-date">
                                    {new Date(rating.created_at).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              </div>
                              <Rate disabled value={rating.rating} />
                            </div>
                            <div className="rating-content">
                              <p>{rating.rating_text}</p>
                            </div>
                          </Card>
                        ))}
                        
                        <Pagination
                          current={pages.current_page}
                          total={pages.total}
                          pageSize={pages.per_page}
                          onChange={handlePageChange}
                          className="rating-pagination"
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo; 