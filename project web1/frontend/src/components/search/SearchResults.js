import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Empty, Spin } from 'antd';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';
import CourseCard from '../common/CourseCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');

  useEffect(() => {
    fetchSearchResults();
  }, [keyword]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/search/courses?keyword=${keyword}`);
      setSearchResults(response.data.courses);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course-info/${courseId}`);
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.post('http://localhost:5000/courseEnroll/enroll', { courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate(`/course/${courseId}`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="search-results-container">
          <h2>Kết quả tìm kiếm cho "{keyword}"</h2>
          
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : searchResults.length > 0 ? (
            <Row gutter={[24, 24]}>
              {searchResults.map(course => (
                <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
                  <CourseCard
                    course={course}
                    userRole={localStorage.getItem('role')}
                    onEnroll={handleEnroll}
                    onCardClick={handleCourseClick}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description="Không tìm thấy khóa học nào"
              className="no-results"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 