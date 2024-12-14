import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space, message, Checkbox, Spin } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const EditQuiz = ({ visible, onCancel, onSuccess, quizData }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch quiz details khi mở form
  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!quizData?.id || !visible) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/quizzes/${quizData.id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        // Format data trước khi set vào form
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
  }, [quizData?.id, visible, form]);

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

      await axios.put(`http://localhost:5000/quizzes/${quizData.id}`, formattedValues, {
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
      <Spin spinning={loading} tip="Đang tải...">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tên Quiz"
            rules={[{ required: true, message: 'Vui lòng nhập tên quiz' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="quiz_type"
            label="Loại Quiz"
            rules={[{ required: true, message: 'Vui lòng chọn loại quiz' }]}
          >
            <Select>
              <Option value="video">Quiz video</Option>
              <Option value="chapter">Quiz chương</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="duration_minutes"
            label="Thời gian làm bài (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="passing_score"
            label="Điểm đạt"
            rules={[{ required: true, message: 'Vui lòng nhập điểm đạt!' }]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ marginBottom: 24, border: '1px dashed #d9d9d9', padding: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'question_text']}
                      label="Câu hỏi"
                      rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'points']}
                      label="Điểm"
                    >
                      <InputNumber min={1} />
                    </Form.Item>

                    <Form.List name={[name, 'options']}>
                      {(optionFields, { add: addOption, remove: removeOption }) => (
                        <>
                          {optionFields.map((optionField, index) => (
                            <Space key={optionField.key} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[optionField.name, 'option_text']}
                                rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}
                              >
                                <Input placeholder="Đáp án" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[optionField.name, 'is_correct']}
                                valuePropName="checked"
                              >
                                <Checkbox>Đáp án đúng</Checkbox>
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => removeOption(optionField.name)} />
                            </Space>
                          ))}
                          <Button type="dashed" onClick={() => addOption()} block icon={<PlusOutlined />}>
                            Thêm đáp án
                          </Button>
                        </>
                      )}
                    </Form.List>

                    <Button type="link" danger onClick={() => remove(name)}>
                      Xóa câu hỏi
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm câu hỏi
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditQuiz; 