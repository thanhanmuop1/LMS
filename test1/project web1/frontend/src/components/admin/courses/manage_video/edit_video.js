import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const EditVideo = ({ visible, onCancel, onSuccess, videoData }) => {
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
      await axios.put(`http://localhost:5000/videos/${videoData.id}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Cập nhật video thành công');
      onSuccess();
    } catch (error) {
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

export default EditVideo; 