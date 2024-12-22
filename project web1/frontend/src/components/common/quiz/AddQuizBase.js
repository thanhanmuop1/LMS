import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddQuizBase = ({ 
  visible, 
  onCancel, 
  onSuccess, 
  role, // 'admin' or 'teacher'
  apiEndpoint 
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const formattedValues = {
        ...values,
        questions: values.questions.map(q => ({
          ...q,
          points: q.points || 1,
          options: q.options.map(opt => ({
            ...opt,
            is_correct: opt.is_correct === true
          }))
        }))
      };

      await axios.post(apiEndpoint, formattedValues, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      message.success('Tạo quiz thành công');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Có l���i xảy ra khi tạo quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm Quiz mới"
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
        >
          Tạo
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          duration_minutes: 30,
          passing_score: 60,
          quiz_type: 'video',
          questions: [{ options: [{}] }]
        }}
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
                              <Select style={{ width: 120 }}>
                                <Option value={true}>Đúng</Option>
                                <Option value={false}>Sai</Option>
                              </Select>
                            </Form.Item>

                            {optionFields.length > 1 && (
                              <MinusCircleOutlined onClick={() => removeOption(optionField.name)} />
                            )}
                          </Space>
                        ))}

                        <Button type="dashed" onClick={() => addOption()} block icon={<PlusOutlined />}>
                          Thêm đáp án
                        </Button>
                      </>
                    )}
                  </Form.List>

                  {fields.length > 1 && (
                    <Button type="link" danger onClick={() => remove(name)}>
                      Xóa câu hỏi
                    </Button>
                  )}
                </div>
              ))}

              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Thêm câu hỏi
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default AddQuizBase; 