import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { ReadOutlined, FileOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const TeacherDashboard = ({ courses = [] }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/courseEnroll/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCourses = courses.length;
  const totalVideos = courses.reduce((acc, course) => acc + (course.video_count || 0), 0);
  const totalStudents = stats.reduce((acc, course) => acc + (course.student_count || 0), 0);

  const columns = [
    {
      title: 'Tên khóa học',
      dataIndex: 'course_title',
      key: 'course_title',
    },
    {
      title: 'Số học viên',
      dataIndex: 'student_count',
      key: 'student_count',
      render: (count) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {count || 0}
        </span>
      ),
    },
  ];

  return (
    <div className="dashboard">
      <h1>Tổng quan giảng viên</h1>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Khóa học của tôi"
              value={totalCourses}
              prefix={<ReadOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số video"
              value={totalVideos}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số học viên"
              value={totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <h2>Chi tiết số học viên theo khóa học</h2>
        <Table
          columns={columns}
          dataSource={stats}
          loading={loading}
          rowKey="course_id"
        />
      </Card>
    </div>
  );
};

export default TeacherDashboard; 