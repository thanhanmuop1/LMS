import React, { useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddCourse from './manage_course/add_course';
import EditCourse from './manage_course/edit_course';
import CourseTableColumns from '../../common/course/CourseTableColumns';
import axios from 'axios';
import CourseStudents from '../../common/course/CourseStudents';

const { confirm } = Modal;

const CourseManagement = ({ courses, loading, onCourseAdded }) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isStudentsModalVisible, setIsStudentsModalVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleEdit = (record) => {
    setSelectedCourse(record);
    setIsEditModalVisible(true);
  };

  const handleDelete = (courseId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa khóa học này?',
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          message.success('Xóa khóa học thành công');
          if (onCourseAdded) {
            onCourseAdded();
          }
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa khóa học');
        }
      }
    });
  };

  const handleViewStudents = (courseId) => {
    setSelectedCourseId(courseId);
    setIsStudentsModalVisible(true);
  };

  const handleStudentRemoved = () => {
    if (onCourseAdded) {
      onCourseAdded();
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>Thêm khóa học</Button>
      <Table 
        columns={CourseTableColumns({ onEdit: handleEdit, onDelete: handleDelete, role: 'admin', onViewStudents: handleViewStudents })} 
        dataSource={courses} 
        loading={loading} 
        rowKey="id"
      />

      <AddCourse
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          if (onCourseAdded) {
            onCourseAdded();
          }
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
          if (onCourseAdded) {
            onCourseAdded();
          }
        }}
        courseData={selectedCourse}
      />

      <CourseStudents
        visible={isStudentsModalVisible}
        onCancel={() => {
          setIsStudentsModalVisible(false);
          setSelectedCourseId(null);
        }}
        courseId={selectedCourseId}
        onStudentRemoved={handleStudentRemoved}
      />
    </div>
  );
};

export default CourseManagement; 