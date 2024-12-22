import React, { useState } from 'react';
import { Modal, Form, Input, Upload, message, Switch } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const AddCourse = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/courses', {
        ...values,
        thumbnail: imageUrl,
        is_public: values.is_public
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(values);
      message.success('Thêm khóa học thành công');
      form.resetFields();
      setImageUrl('');
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm khóa học');
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
      onError({ err });
      message.error('Tải ảnh lên thất bại.');
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
      title="Thêm khóa học mới"
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
          rules={[{ required: true, message: 'Vui lòng tải lên ảnh thumbnail!' }]}
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
          name="is_public"
          label="Trạng thái công khai"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch 
            checkedChildren="Công khai" 
            unCheckedChildren="Riêng tư" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourse;
