import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const AddCourse = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/courses', values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Thêm khóa học thành công');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm khóa học');
    }
  };

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
          name="thumbnail"
          label="URL Ảnh thumbnail"
          rules={[{ required: true, message: 'Vui lòng nhập URL ảnh!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourse;
