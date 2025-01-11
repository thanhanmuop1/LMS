import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const EditVideoModal = ({ 
  visible, 
  onCancel, 
  onSuccess, 
  videoData,
  role = 'teacher' // 'admin' or 'teacher'
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (videoData) {
      form.setFieldsValue({
        title: videoData.title,
        video_url: videoData.video_url
      });
    }
  }, [videoData, form]);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(`${process.env.REACT_APP_API_URL}/videos/${videoData.id}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      message.success('Cập nhật video thành công');
      onSuccess();
    } catch (error) {
      console.error('Error updating video:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật video');
    }
  };

  return (
    <Modal
      title="Chỉnh sửa video"
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

export default EditVideoModal; 