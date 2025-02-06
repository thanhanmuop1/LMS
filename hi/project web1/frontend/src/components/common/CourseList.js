import React from 'react';
import { Spin } from 'antd';
import CourseCard from './card/CourseCard';
import EmptyCourseLayout from './layout/EmptyCourseLayout';

const CourseList = ({
  courses,
  loading,
  error,
  emptyMessage,
  onCardClick,
  showAddButton,
  onAddClick,
  customIcon,
  renderCard
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải khóa học..." />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyCourseLayout
        title="Có lỗi xảy ra"
        description={error}
        customIcon={customIcon}
      />
    );
  }

  if (!courses.length) {
    return (
      <EmptyCourseLayout
        title={emptyMessage.title}
        description={emptyMessage.description}
        showAddButton={showAddButton}
        onAddClick={onAddClick}
        customIcon={customIcon}
      />
    );
  }

  return (
    <div className="courses-grid">
      {courses.map((course, index) => (
        <div 
          key={course.id} 
          className="course-card-wrapper"
          style={{ '--i': index }}
        >
          {renderCard ? renderCard(course) : (
            <CourseCard
              course={course}
              onCardClick={onCardClick}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseList; 