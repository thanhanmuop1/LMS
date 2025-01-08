import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const AddVideoModal = ({ 
  visible, 
  onCancel, 
  onSuccess, 
  courseId, 
  chapterId,
  role = 'teacher' // 'admin' or 'teacher'
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');

      const videoData = {
        title: values.title,
        video_url: values.video_url,
        chapter_id: chapterId,
        course_id: courseId
      };

      if (!videoData.title || !videoData.video_url || !videoData.chapter_id || !videoData.course_id) {
        message.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      await axios.post( `${process.env.REACT_APP_API_URL}/chapters/${chapterId}/videos`, videoData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      message.success('Thêm video thành công');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Error adding video:', error);
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

export default AddVideoModal; 