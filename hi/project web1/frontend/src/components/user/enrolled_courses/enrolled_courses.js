import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadOutlined } from '@ant-design/icons';
import { useCourses } from '../../../hooks/useCourses';
import { API_ENDPOINTS } from '../../../constants/courseConstants';
import CourseList from '../../common/CourseList';
import CourseCard from '../../common/card/CourseCard';
import Navbar from '../../common/navbar/navbar';
import Sidebar from '../../common/sidebar/sidebar';
import './enrolled_courses.css';

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const { courses, loading, error } = useCourses(API_ENDPOINTS.ENROLLED_COURSES);

  const handleCardClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleExplore = () => {
    navigate('/courses');
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content">
          <div className="enrolled-courses-container">
            <h2 className="section-title">Khóa học đã đăng ký</h2>
            
            <CourseList
              courses={courses}
              loading={loading}
              error={error}
              emptyMessage={{
                title: "Bạn chưa đăng ký khóa học nào",
                description: "Hãy khám phá các khóa học để bắt đầu hành trình học tập của bạn"
              }}
              onCardClick={handleCardClick}
              showAddButton={true}
              onAddClick={handleExplore}
              customIcon={<ReadOutlined className="empty-icon" />}
              renderCard={(course) => (
                <CourseCard
                  course={course}
                  isEnrolled={true}
                  onCardClick={handleCardClick}
                  showEnrollmentStatus={true}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourses;