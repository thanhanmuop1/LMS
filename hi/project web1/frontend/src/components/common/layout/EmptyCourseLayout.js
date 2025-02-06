import React from 'react';
import { Empty, Button } from 'antd';
import { BookOutlined, PlusCircleOutlined } from '@ant-design/icons';
import './EmptyCourseLayout.css';

const EmptyCourseLayout = ({ 
  title = 'Chưa có khóa học nào',
  description = 'Hiện tại chưa có khóa học nào được tạo',
  showAddButton = false,
  onAddClick,
  customIcon
}) => {
  return (
    <div className="empty-course-layout">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="empty-content">
            {customIcon || <BookOutlined className="empty-icon" />}
            <h3 className="empty-title">{title}</h3>
            <p className="empty-description">{description}</p>
            {showAddButton && (
              <Button 
                type="primary" 
                icon={<PlusCircleOutlined />}
                onClick={onAddClick}
                className="add-course-button"
              >
                Thêm khóa học mới
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default EmptyCourseLayout; 