import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal } from 'antd';
import axios from 'axios';
import AddCourse from '../../admin/courses/manage_course/add_course';
import EditCourse from '../../admin/courses/manage_course/edit_course';
import CourseTableColumns from '../../common/course/CourseTableColumns';

const { confirm } = Modal;

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/teacher/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Xóa khóa học thành công');
      fetchCourses();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa khóa học');
    }
  };

  const handleEdit = (record) => {
    setSelectedCourse(record);
    setIsEditModalVisible(true);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Thêm khóa học
      </Button>
      <Table 
        columns={CourseTableColumns({ 
          onEdit: handleEdit,
          onDelete: handleDelete, 
          role: 'teacher' 
        })} 
        dataSource={courses} 
        loading={loading} 
        rowKey="id" 
      />

      <AddCourse
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          fetchCourses();
        }}
      />

      <EditCourse
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedCourse(null);
        }}
        onSuccess={() => {
          setIsEditModalVisible(false);
          setSelectedCourse(null);
          fetchCourses();
        }}
        courseData={selectedCourse}
      />
    </div>
  );
};

export default CourseManagement; 