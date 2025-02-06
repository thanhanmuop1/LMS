import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, message, Empty, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddSchool from './manage_school/add_school';
import SchoolCard from './components/SchoolCard';
import './school_management.css';
import EditSchool from './manage_school/edit_school';
import axiosInstance from '../../../utils/axiosConfig';

const { Title, Paragraph } = Typography;

const SchoolManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/my-schools');
      
      if (response.data.success) {
        setSchools(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      message.error('Không thể tải danh sách trường học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSuccess = () => {
    setIsModalVisible(false);
    fetchSchools();
  };

  const handleDelete = (schoolId) => {
    Modal.confirm({
      title: 'Xác nhận xóa trường học',
      content: 'Bạn có chắc chắn muốn xóa trường học này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axiosInstance.delete(`/admin/schools/${schoolId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          message.success('Xóa trường học thành công');
          fetchSchools();
        } catch (error) {
          message.error('Không thể xóa trường học');
        }
      }
    });
  };

  const handleEdit = (school) => {
    setSelectedSchool(school);
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setSelectedSchool(null);
    fetchSchools();
  };

  const renderSchoolCard = (school) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={school.id}>
      <SchoolCard 
        school={school}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </Col>
  );

  return (
    <div className="school-management">
      <Title level={2} className="page-title">Quản lý trường học</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card
            hoverable
            onClick={() => setIsModalVisible(true)}
            className="add-school-card"
          >
            <PlusOutlined className="add-icon" />
            <Title level={3}>Tạo trường học mới</Title>
            <Paragraph className="add-description">
              Thiết lập không gian học tập trực tuyến cho trường của bạn
            </Paragraph>
          </Card>
        </Col>

        {schools.length > 0 ? (
          schools.map(renderSchoolCard)
        ) : (
          <Col span={24}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có trường học nào. Hãy tạo trường học mới!"
            />
          </Col>
        )}
      </Row>

      <AddSchool
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={handleSuccess}
      />

      <EditSchool
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedSchool(null);
        }}
        onSuccess={handleEditSuccess}
        schoolData={selectedSchool}
      />
    </div>
  );
};

export default SchoolManagement; 