import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Upload, Divider } from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons';
import axios from 'axios';
import Navbar from '../common/navbar/navbar';
import Sidebar from '../common/sidebar/sidebar';
import './profile.css';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const userData = response.data;
      form.setFieldsValue({
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role
      });
      setAvatar(userData.avatar);
    } catch (error) {
      message.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        { full_name: values.full_name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        const updatedUser = { ...user, full_name: values.full_name };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      message.error('Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    // Tạo input file ẩn và kích hoạt click
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/users/upload-avatar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        setAvatar(response.data.avatar);
        message.success('Tải lên ảnh đại diện thành công');

        // Cập nhật avatar trong localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          const updatedUser = { ...user, avatar: response.data.avatar };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        message.error('Tải lên ảnh thất bại');
      }
    };

    fileInput.click();
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="content-container">
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="avatar-wrapper">
                  <div onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                    {avatar ? (
                      <img 
                        src={`${process.env.REACT_APP_API_URL}${avatar}`} 
                        alt="Avatar" 
                        className="profile-avatar"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {form.getFieldValue('full_name')?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <h1 className="profile-name">{form.getFieldValue('full_name') || 'Chưa cập nhật tên'}</h1>
              <p className="profile-role">{form.getFieldValue('role')?.toUpperCase()}</p>
            </div>

            <Divider />

            <div className="profile-content">
              <h2 className="section-title">Thông tin cá nhân</h2>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="profile-form"
              >
                <div className="form-row">
                  <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    className="form-item-half"
                  >
                    <Input prefix={<UserOutlined />} disabled />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    className="form-item-half"
                  >
                    <Input prefix={<MailOutlined />} disabled />
                  </Form.Item>
                </div>

                <Form.Item
                  name="full_name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên của bạn" />
                </Form.Item>

                <Form.Item
                  name="role"
                  label="Vai trò"
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item className="form-actions">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="update-button"
                  >
                    Cập nhật thông tin
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 