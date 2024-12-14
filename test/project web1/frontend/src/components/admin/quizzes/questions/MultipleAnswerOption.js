import React from 'react';
import { Form, Input, Checkbox, Space, Button } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';

const MultipleAnswerOption = ({ optionField, index, removeOption, restField }) => {
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
        <Checkbox>Đáp án đúng</Checkbox>
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

export default MultipleAnswerOption; 