import React from 'react';
import { Card, Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import MultipleAnswerOption from './MultipleAnswerOption';
import SingleAnswerOption from './SingleAnswerOption';

const QuestionItem = ({ form, name, remove, restField }) => {
  const allows_multiple_correct = Form.useWatch(['questions', name, 'allows_multiple_correct'], form);

  const { key, ...restFieldWithoutKey } = restField || {};

  return (
    <Card
      key={name}
      title={`Câu hỏi ${name + 1}`}
      extra={
        <Space>
          <Button
            type="text"
            danger
            onClick={() => remove(name)}
            icon={<MinusCircleOutlined />}
          >
            Xóa câu hỏi
          </Button>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Form.Item
        {...restFieldWithoutKey}
        name={[name, 'question_text']}
        rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
      >
        <Input.TextArea 
          placeholder="Nhập nội dung câu hỏi" 
          rows={2}
          style={{ marginBottom: 8 }} 
        />
      </Form.Item>

      <Form.Item
        {...restFieldWithoutKey}
        name={[name, 'allows_multiple_correct']}
        hidden
      >
        <Input type="hidden" />
      </Form.Item>

      <div style={{ backgroundColor: '#fafafa', padding: 16, borderRadius: 8 }}>
        <Form.List name={[name, 'options']}>
          {(fields, { add, remove: removeOption }) => (
            <>
              {fields.map((field, index) => {
                const { key: fieldKey, ...fieldProps } = field;
                
                return allows_multiple_correct ? (
                  <MultipleAnswerOption
                    key={fieldKey}
                    optionField={fieldProps}
                    index={index}
                    removeOption={removeOption}
                    restField={restFieldWithoutKey}
                  />
                ) : (
                  <SingleAnswerOption
                    key={fieldKey}
                    form={form}
                    name={name}
                    optionField={fieldProps}
                    index={index}
                    removeOption={removeOption}
                    restField={restFieldWithoutKey}
                  />
                );
              })}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: 16 }}
              >
                Thêm đáp án
              </Button>
            </>
          )}
        </Form.List>
      </div>
    </Card>
  );
};

export default QuestionItem; 