import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const EditCourse = ({ visible, onCancel, onSuccess, courseData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (courseData) {
      form.setFieldsValue({
        title: courseData.title,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
      });
    }
  }, [courseData, form]);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/courses/${courseData.id}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Cập nhật khóa học thành công');
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khóa học');
    }
  };

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

export default EditCourse; 