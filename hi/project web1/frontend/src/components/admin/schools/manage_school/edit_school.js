import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const EditSchool = ({ visible, onCancel, onSuccess, schoolData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (schoolData) {
      form.setFieldsValue({
        name: schoolData.name,
        domain: schoolData.domain,
      });
      setImageUrl(schoolData.logo?.replace(`${process.env.REACT_APP_API_URL}`, '') || '');
    }
  }, [schoolData, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/schools/${schoolData.id}`,
        { ...values, logo: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        message.success('Cập nhật trường học thành công');
        onSuccess();
      }
    } catch (error) {
      message.error('Không thể cập nhật trường học');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('logo', info.file.originFileObj);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/schools/upload_logo`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        if (response.data.success) {
          const relativePath = response.data.url.replace(`${process.env.REACT_APP_API_URL}`, '');
          setImageUrl(relativePath);
          message.success('Tải logo lên thành công');
        }
      } catch (error) {
        message.error('Tải logo thất bại');
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const getFullImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}${path}`;
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin trường học"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Tên trường"
          rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
        >
          <Input placeholder="Nhập tên trường học" />
        </Form.Item>

        <Form.Item
          name="domain"
          label="Tên miền"
          rules={[{ required: true, message: 'Vui lòng nhập tên miền' }]}
        >
          <Input placeholder="ten-truong" addonAfter=".yourdomain.com" />
        </Form.Item>

        <Form.Item label="Logo trường">
          <Upload
            name="logo"
            listType="picture-card"
            showUploadList={false}
            onChange={handleChange}
            customRequest={({ onSuccess }) => onSuccess('ok')}
          >
            {imageUrl ? (
              <img
                src={getFullImageUrl(imageUrl)}
                alt="logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : uploadButton}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSchool; 