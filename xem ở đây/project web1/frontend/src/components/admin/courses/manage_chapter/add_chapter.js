import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import apiService from '../../../../services/apiService';

const AddChapter = ({ visible, onCancel, onSuccess, courseId }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const role = localStorage.getItem('role');
      if (!role) {
        message.error('Vui lòng đăng nhập lại');
        // Có thể chuyển hướng đến trang đăng nhập
        return;
      }

      await apiService.post('chapters', values, { courseId });
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