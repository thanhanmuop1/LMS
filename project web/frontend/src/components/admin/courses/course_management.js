import React, { useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddCourse from './manage_add/add_course';

const CourseManagement = ({ courses, loading, onCourseAdded }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEdit = (record) => {
    message.info('Chức năng đang phát triển');
  };

  const handleDelete = (record) => {
    message.info('Chức năng đang phát triển');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    if (onCourseAdded) {
      onCourseAdded();
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail) => (
        <img src={thumbnail} alt="Thumbnail" style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} />
      ),
    },
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
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="course-management">
      <div className="course-header">
        <h2>Quản lý khóa học</h2>
        <Button type="primary" onClick={showModal}>Thêm khóa học</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={courses} 
        loading={loading}
        rowKey="id"
      />

      <AddCourse
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CourseManagement; 