import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const EditCourse = ({ visible, onCancel, onSuccess, courseData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (courseData) {
      form.setFieldsValue({
        title: courseData.title,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
      });
      setImageUrl(courseData.thumbnail || '');
    }
  }, [courseData, form]);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      await axios.put(`http://localhost:5000/courses/${courseData.id}`, {
        ...values,
        thumbnail: imageUrl || values.thumbnail
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Cập nhật khóa học thành công');
      onSuccess();
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else {
        message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khóa học');
      }
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file ảnh!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
    }
    return isImage && isLt5M;
  };

  const handleUpload = async (options) => {
    const { onSuccess, onError, file } = options;
    const token = localStorage.getItem('token');
    
    if (!token) {
      message.error('Vui lòng đăng nhập lại');
      onError({ err: new Error('No authentication token') });
      return;
    }

    const formData = new FormData();
    formData.append('thumbnail', file);

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/courses/upload-thumbnail',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setImageUrl(response.data.url);
      onSuccess('Ok');
      message.success('Tải ảnh lên thành công!');
    } catch (err) {
      if (err.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else {
        message.error('Tải ảnh lên thất bại.');
      }
      onError({ err });
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <Modal
      title="Chỉnh sửa khóa học"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Tên khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Ảnh thumbnail"
          extra="Hỗ trợ JPG, PNG, GIF (< 5MB)"
        >
          <Upload
            name="thumbnail"
            listType="picture-card"
            showUploadList={false}
            customRequest={handleUpload}
            beforeUpload={beforeUpload}
          >
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="thumbnail" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          name="thumbnail"
          label="hoặc nhập URL ảnh"
          rules={[{ type: 'url', message: 'Vui lòng nhập URL hợp lệ!' }]}
        >
          <Input 
            placeholder="https://example.com/image.jpg"
            onChange={(e) => {
              if (e.target.value) {
                setImageUrl(e.target.value);
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourse; 