import React, { useState, useEffect } from 'react';
import { Modal, Table, message, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const CourseStudents = ({ visible, onCancel, courseId, onStudentRemoved }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const handleRemoveStudent = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/courses/${courseId}/students/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      message.success('Đã xóa học viên khỏi khóa học');
      fetchStudents(); // Tải lại danh sách học viên
      if (onStudentRemoved) {
        onStudentRemoved(); // Gọi callback để cập nhật số lượng học viên ở component cha
      }
    } catch (error) {
      message.error('Không thể xóa học viên khỏi khóa học');
    }
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'enrolled_at',
      key: 'enrolled_at',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Xóa học viên"
          description="Bạn có chắc chắn muốn xóa học viên này khỏi khóa học?"
          onConfirm={() => handleRemoveStudent(record.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    }
  ];

  useEffect(() => {
    if (visible && courseId) {
      fetchStudents();
    }
  }, [visible, courseId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/courses/${courseId}/students`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStudents(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách học viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Danh sách học viên"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} học viên`
        }}
      />
    </Modal>
  );
};

export default CourseStudents; 