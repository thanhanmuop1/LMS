import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import apiService from '../../../../services/apiService';

const AddVideo = ({ visible, onCancel, onSuccess, courseId, chapterId }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      console.log('Submitting video data:', {
        ...values,
        chapter_id: chapterId,
        course_id: courseId
      });

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

      await apiService.post('videos', videoData, { 
        courseId,
        chapterId 
      });
      
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

export default AddVideo; 