import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ReadOutlined } from '@ant-design/icons';

const Dashboard = ({ courses = [], users = [] }) => {
  const totalStudents = users.filter(user => user.role === 'student').length;
  const totalTeachers = users.filter(user => user.role === 'teacher').length;
  const totalCourses = courses.length;

  return (
    <div className="dashboard">
      <h1>Tổng quan hệ thống</h1>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số học viên"
              value={totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số giảng viên"
              value={totalTeachers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số khóa học"
              value={totalCourses}
              prefix={<ReadOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <h2 style={{ marginTop: 32 }}>Khóa học mới nhất</h2>
      <Row gutter={16}>
        {courses.slice(0, 3).map(course => (
          <Col span={8} key={course.id}>
            <Card title={course.title}>
              <p>Giảng viên: {course.teacher_name || 'Chưa phân công'}</p>
              <p>Số học viên: {course.student_count || 0}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
