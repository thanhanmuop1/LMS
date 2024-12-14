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
      await axios.put(`http://localhost:5000/chapters/${chapterData.id}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Cập nhật chương thành công');
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật chương');
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