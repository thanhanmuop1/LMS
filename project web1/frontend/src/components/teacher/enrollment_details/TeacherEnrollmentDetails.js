import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, Row, Col, Progress, Input, Button, Space, Tag } from 'antd';
import { SearchOutlined, UserOutlined, BookOutlined, FieldTimeOutlined } from '@ant-design/icons';
import axios from 'axios';
import Navbar from '../../navbar/navbar';
import Sidebar from '../../sidebar/sidebar';
import './TeacherEnrollmentDetails.css';

const TeacherEnrollmentDetails = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEnrollmentDetails();
  }, []);

  const fetchEnrollmentDetails = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/courseEnroll/teacher/student-enrollment-details',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Chuyển đổi dữ liệu từ API thành dạng phẳng để hiển thị trong bảng
      const flattenedData = response.data.flatMap(course => 
        course.students.map(student => ({
          course_id: course.id,
          course_title: course.title || 'Chưa có tên',
          student_id: student.id,
          student_name: student.name || 'Chưa có tên',
          student_email: student.email || 'Chưa có email',
          enrolled_date: student.enrolled_at,
          progress: student.progress || 0,
          completed_videos: student.completed_videos,
          total_videos: student.total_videos
        }))
      );
      
      setEnrollmentData(flattenedData);
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tính toán tiến độ học tập
  const calculateProgress = (totalVideos, watchedVideos) => {
    if (!totalVideos) return 0;
    return Math.round((watchedVideos / totalVideos) * 100);
  };

  const columns = [
    {
      title: 'Khóa học',
      dataIndex: 'course_title',
      key: 'course_title',
      filterable: true,
    },
    {
      title: 'Học viên',
      dataIndex: 'student_name',
      key: 'student_name',
      filterable: true,
    },
    {
      title: 'Email',
      dataIndex: 'student_email',
      key: 'student_email',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'enrolled_date',
      key: 'enrolled_date',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress 
          percent={Math.round(progress)} 
          size="small" 
          status={progress === 100 ? "success" : "active"}
        />
      ),
    },
  ];

  const filteredData = enrollmentData.filter(item => {
    const searchLower = searchText.toLowerCase();
    console.log(item);
    return (
      (item.course_title || '').toLowerCase().includes(searchLower) ||
      (item.student_name || '').toLowerCase().includes(searchLower) ||
      (item.student_email || '').toLowerCase().includes(searchLower)
    );
  });

  // Tính toán thống kê
  const uniqueCourses = new Set(enrollmentData.map(item => item.course_id));
  const completedCourses = enrollmentData.filter(item => item.progress === 100);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="enrollment-details-container">
          <Card className="stats-section">
            <Row gutter={24}>
              <Col span={8}>
                <Statistic 
                  title="Tổng số học viên"
                  value={enrollmentData.length}
                  prefix={<UserOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Số khóa học"
                  value={uniqueCourses.size}
                  prefix={<BookOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Hoàn thành khóa học"
                  value={completedCourses.length}
                  suffix={`/${enrollmentData.length}`}
                  prefix={<FieldTimeOutlined />}
                />
              </Col>
            </Row>
          </Card>

          <Card className="table-section">
            <div className="table-header">
              <Input
                placeholder="Tìm kiếm theo tên khóa học, học viên..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="search-input"
              />
            </div>
            
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              rowKey={(record) => `${record.course_id}-${record.student_id}`}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng số ${total} bản ghi`,
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherEnrollmentDetails; 