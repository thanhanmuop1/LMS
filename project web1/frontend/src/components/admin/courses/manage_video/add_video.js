import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const AddVideo = ({ visible, onCancel, onSuccess, courseId, chapterId }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/chapters/${chapterId}/videos`, {
        ...values,
        course_id: courseId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Thêm video thành công');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm video');
    }
  };

  return (
    <Modal
      title="Thêm video mới"
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
          label="Tên video"
          rules={[{ required: true, message: 'Vui lòng nhập tên video!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="video_url"
          label="URL Video"
          rules={[
            { required: true, message: 'Vui lòng nhập URL video!' },
            { type: 'url', message: 'Vui lòng nhập URL hợp lệ!' }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVideo; 