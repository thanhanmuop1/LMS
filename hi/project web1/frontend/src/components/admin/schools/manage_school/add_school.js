import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../utils/axiosConfig';

const AddSchool = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return false;
    }

    // Tạo preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    return false; // Ngăn không cho Upload component tự động upload
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let logoUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('logo', imageFile);

        // Upload logo
        const uploadResponse = await axiosInstance.post(
          `/admin/schools/upload_logo`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        logoUrl = uploadResponse.data.url;
      }

      // Tạo trường học
      await axiosInstance.post(
        `/admin/schools`,
        {
          ...values,
          logo: logoUrl
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      message.success('Tạo trường học thành công');
      form.resetFields();
      setImageFile(null);
      setPreviewUrl('');
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể tạo trường học');
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <Modal
      title="Tạo trường học mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Tên trường học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên trường học' },
            { max: 255, message: 'Tên không được vượt quá 255 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tên trường học" />
        </Form.Item>

        <Form.Item
          name="domain"
          label="Tên miền"
          rules={[
            { required: true, message: 'Vui lòng nhập tên miền' },
            { pattern: /^[a-z0-9-]+$/, message: 'Tên miền chỉ được chứa chữ thường, số và dấu gạch ngang' }
          ]}
        >
          <Input placeholder="ten-truong" addonAfter=".yourdomain.com" />
        </Form.Item>

        <Form.Item
          label="Logo trường"
          required
        >
          <Upload
            name="logo"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo trường học
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSchool; 