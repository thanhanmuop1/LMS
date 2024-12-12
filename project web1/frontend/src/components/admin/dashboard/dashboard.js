import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BookOutlined, UserOutlined} from '@ant-design/icons';

const Dashboard = ({ courses, users }) => {
  const studentCount = users?.filter(user => user.role !== 'admin').length || 0;
  const teacherCount = users?.filter(user => user.role === 'teacher').length || 0;

  return (
    <div className="dashboard">
      <h2>Tổng quan hệ thống</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số khóa học"
              value={courses.length}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Giảng viên"
              value={teacherCount}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Học viên"
              value={studentCount}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
