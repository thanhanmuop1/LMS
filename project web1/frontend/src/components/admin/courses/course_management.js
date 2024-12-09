import React, { useState } from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddCourse from './manage_add/add_course';
import EditCourse from './manage_edit/edit_course';
import axios from 'axios';

const { confirm } = Modal;

const CourseManagement = ({ courses, loading, onCourseAdded }) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleEdit = (e, record) => {
    e.stopPropagation();
    setSelectedCourse(record);
    setIsEditModalVisible(true);
  };

  const handleDelete = (e, record) => {
    e.stopPropagation();
    confirm({
      title: 'Bạn có chắc chắn muốn xóa khóa học này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/courses/${record.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          message.success('Xóa khóa học thành công');
          if (onCourseAdded) {
            onCourseAdded();
          }
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa khóa học');
        }
      },
    });
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

  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setSelectedCourse(null);
    if (onCourseAdded) {
      onCourseAdded();
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedCourse(null);
  };

  const handleRowClick = (record) => {
    navigate(`/admin/courses/${record.id}/videos`);
    console.log(record);
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
        <Space size="middle" onClick={e => e.stopPropagation()}>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={(e) => handleEdit(e, record)}
          >
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={(e) => handleDelete(e, record)}
          >
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
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' }
        })}
      />

      <AddCourse
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />

      <EditCourse
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
        courseData={selectedCourse}
      />
    </div>
  );
};

export default CourseManagement; 