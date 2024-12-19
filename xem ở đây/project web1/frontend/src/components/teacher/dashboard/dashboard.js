import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ReadOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';

const TeacherDashboard = ({ courses = [] }) => {
  const totalCourses = courses.length;
  const totalVideos = courses.reduce((acc, course) => acc + (course.video_count || 0), 0);
  const totalDocuments = courses.reduce((acc, course) => acc + (course.document_count || 0), 0);

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
              title="Đang phát triển"
              value={totalVideos}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đang phát triển"
              value={totalDocuments}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* <h2 style={{ marginTop: 32 }}>Khóa học của tôi</h2>
      <Row gutter={16}>
        {courses.map(course => (
          <Col span={8} key={course.id}>
            <Card title={course.title}>
              <p>Số video: {course.video_count || 0}</p>
              <p>Số tài liệu: {course.document_count || 0}</p>
            </Card>
          </Col>
        ))}
      </Row> */}
    </div>
  );
};

export default TeacherDashboard; 