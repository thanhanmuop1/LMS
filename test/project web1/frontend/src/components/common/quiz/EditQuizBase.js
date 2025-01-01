import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space, message, Spin } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const EditQuizBase = ({ 
  visible, 
  onCancel, 
  onSuccess, 
  quizData,
  role, // 'admin' or 'teacher'
  apiEndpoint 
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!quizData?.id || !visible) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${apiEndpoint}/${quizData.id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        const formattedData = {
          ...response.data,
          questions: response.data.questions?.map(q => ({
            ...q,
            options: q.options?.map(opt => ({
              ...opt,
              is_correct: opt.is_correct === 1 || opt.is_correct === true
            })) || []
          })) || []
        };

        form.setFieldsValue(formattedData);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
        message.error('Có lỗi xảy ra khi tải thông tin quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizData?.id, visible, form, apiEndpoint]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const formattedValues = {
        ...values,
        questions: values.questions?.map(q => ({
          ...q,
          points: q.points || 1,
          options: q.options?.map(opt => ({
            ...opt,
            is_correct: opt.is_correct === true
          })) || []
        })) || []
      };

      await axios.put(`${apiEndpoint}/${quizData.id}`, formattedValues, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      message.success('Cập nhật quiz thành công');
      onSuccess();
    } catch (error) {
      console.error('Error updating quiz:', error);
      message.error('Có lỗi xảy ra khi cập nhật quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa Quiz"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={() => form.submit()}
          disabled={loading}
        >
          Cập nhật
        </Button>
      ]}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Form fields giống như AddQuizBase */}
          {/* ... */}
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditQuizBase; 