import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const AddChapter = ({ visible, onCancel, onSuccess, courseId }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/courses/${courseId}/chapters`, values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Thêm chương thành công');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm chương');
    }
  };

  return (
    <Modal
      title="Thêm chương mới"
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
          label="Tên chương"
          rules={[{ required: true, message: 'Vui lòng nhập tên chương!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddChapter; 