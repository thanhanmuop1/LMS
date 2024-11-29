import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BookOutlined, UserOutlined} from '@ant-design/icons';

const Dashboard = ({ courses }) => {
  return (
    <div className="dashboard">
      <h2>Tổng quan hệ thống</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng số khóa học"
              value={courses.length}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng số học viên"
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
