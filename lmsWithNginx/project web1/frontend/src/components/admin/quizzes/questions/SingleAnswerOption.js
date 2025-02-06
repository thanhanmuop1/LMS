import React from 'react';
import { Form, Input, Radio, Space, Button } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';

const SingleAnswerOption = ({ form, name, optionField, index, removeOption, restField }) => {
  return (
    <Space key={optionField.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
      <Form.Item
        {...restField}
        name={[optionField.name, 'option_text']}
        rules={[{ required: true, message: 'Vui lòng nhập đáp án' }]}
        style={{ flex: 1, marginBottom: 0 }}
      >
        <Input placeholder={`Đáp án ${index + 1}`} />
      </Form.Item>

      <Form.Item
        {...restField}
        name={[optionField.name, 'is_correct']}
        valuePropName="checked"
        style={{ marginBottom: 0 }}
      >
        <Radio 
          checked={form.getFieldValue(['questions', name, 'options'])?.findIndex(
            (opt, i) => i !== optionField.name && opt?.is_correct
          ) === -1}
          onChange={(e) => {
            const options = form.getFieldValue(['questions', name, 'options']) || [];
            const newOptions = options.map((opt, i) => ({
              ...opt,
              is_correct: i === optionField.name
            }));
            form.setFieldValue(['questions', name, 'options'], newOptions);
          }}
        >
          Đáp án đúng
        </Radio>
      </Form.Item>

      <Button
        type="text"
        danger
        onClick={() => removeOption(optionField.name)}
        icon={<MinusCircleOutlined />}
      />
    </Space>
  );
};

export default SingleAnswerOption; 