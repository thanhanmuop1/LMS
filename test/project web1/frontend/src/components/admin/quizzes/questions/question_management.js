import React, { useState, useEffect } from 'react';
import { Form, Button, Space, message, Typography, Modal, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuestionItem from './QuestionItem';

const { Title } = Typography;

const QuestionManagement = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [questionType, setQuestionType] = useState('single');

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/quizzes/${quizId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const quizData = response.data;
      setQuiz(quizData);

      const formattedQuestions = quizData.questions?.map(q => ({
        question_text: q.question_text,
        allows_multiple_correct: q.allows_multiple_correct === 1 || q.allows_multiple_correct === true,
        options: q.options?.map(opt => ({
          option_text: opt.option_text,
          is_correct: opt.is_correct === 1 || opt.is_correct === true
        })) || []
      })) || [];

      setQuestions(formattedQuestions);
      
      form.setFieldsValue({
        questions: formattedQuestions
      });

    } catch (error) {
      console.error('Error fetching quiz:', error);
      message.error('Không thể tải thông tin quiz');
      navigate('/admin/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const formattedQuestions = values.questions?.map(q => ({
        question_text: q.question_text,
        points: quiz.points_per_question || 1,
        allows_multiple_correct: q.allows_multiple_correct,
        options: q.options?.map(opt => ({
          option_text: opt.option_text,
          is_correct: opt.is_correct === true
        }))
      }));

      await axios.put(
        `http://localhost:5000/quizzes/${quizId}/questions`,
        { questions: formattedQuestions },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      message.success('Cập nhật câu hỏi thành công');
      fetchQuizData();
    } catch (error) {
      console.error('Error updating questions:', error);
      message.error('Có lỗi xảy ra khi cập nhật câu hỏi');
    } finally {
      setSubmitting(false);
    }
  };

  const showQuestionTypeModal = () => {
    setIsModalVisible(true);
    setQuestionType('single'); // Reset to default
  };

  const handleModalOk = () => {
    const newQuestion = {
      question_text: '',
      allows_multiple_correct: questionType === 'multiple',
      options: []
    };

    form.setFieldsValue({
      questions: [...(form.getFieldValue('questions') || []), newQuestion]
    });

    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          Quản lý câu hỏi - {quiz?.title}
        </Title>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          disabled={loading}
          initialValues={{ questions: questions }}
        >
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <QuestionItem
                    key={key}
                    form={form}
                    name={name}
                    remove={remove}
                    restField={restField}
                  />
                ))}

                <Button
                  type="dashed"
                  onClick={showQuestionTypeModal}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 24 }}
                >
                  Thêm câu hỏi
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Lưu thay đổi
              </Button>
              <Button onClick={() => navigate('/admin/quizzes')}>
                Quay lại
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Modal
          title="Chọn loại câu hỏi"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Radio.Group
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value="single">Chỉ cho phép một đáp án đúng</Radio>
              <Radio value="multiple">Cho phép nhiều đáp án đúng</Radio>
            </Space>
          </Radio.Group>
        </Modal>
      </div>
    </div>
  );
};

export default QuestionManagement; 