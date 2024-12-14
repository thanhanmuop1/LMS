import React from 'react';
import { Form, Input, Button, Card, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import SingleAnswerOption from './SingleAnswerOption';
import MultipleAnswerOption from './MultipleAnswerOption';

const QuestionItem = ({ form, name, remove, restField }) => {
  const allows_multiple_correct = Form.useWatch(['questions', name, 'allows_multiple_correct'], form);

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
        {...restField}
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
        {...restField}
        name={[name, 'allows_multiple_correct']}
        hidden
      >
        <Input type="hidden" />
      </Form.Item>

      <div style={{ backgroundColor: '#fafafa', padding: 16, borderRadius: 8 }}>
        <Form.List name={[name, 'options']}>
          {(fields, { add, remove: removeOption }) => (
            <>
              {fields.map((optionField, index) => (
                allows_multiple_correct ? (
                  <MultipleAnswerOption
                    key={optionField.key}
                    optionField={optionField}
                    index={index}
                    removeOption={removeOption}
                    restField={restField}
                  />
                ) : (
                  <SingleAnswerOption
                    key={optionField.key}
                    form={form}
                    name={name}
                    optionField={optionField}
                    index={index}
                    removeOption={removeOption}
                    restField={restField}
                  />
                )
              ))}
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