import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const EditChapter = ({ visible, onCancel, onSuccess, chapterData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (chapterData) {
      form.setFieldsValue({
        title: chapterData.title,
      });
    }
  }, [chapterData, form]);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/chapters/${chapterData.id}`, values, { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      message.success('Cập nhật chương thành công');
      onSuccess();
    } catch (error) {
      console.error('Error updating chapter:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message ||
                          'Có lỗi xảy ra khi cập nhật chương';
      message.error(errorMessage);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa chương"
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

export default EditChapter; 