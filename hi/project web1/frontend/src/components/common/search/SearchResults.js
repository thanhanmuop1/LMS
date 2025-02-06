import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Empty, Spin } from 'antd';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';
import CourseCard from '../card/CourseCard';
import '../../../styles/CourseLayout.css';
import axiosConfig from '../../../utils/axiosConfig';

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
      const response = await axiosConfig.get(`/search/courses?keyword=${keyword}`);
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
      
      await axiosConfig.post(`/courseEnroll/enroll`, { courseId }, {
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
          <h2 className="section-title">Kết quả tìm kiếm cho "{keyword}"</h2>
          
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="courses-grid">
              {searchResults.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  userRole={localStorage.getItem('role')}
                  onEnroll={handleEnroll}
                  onCardClick={handleCourseClick}
                />
              ))}
            </div>
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