import React, { useState, useEffect } from 'react';
import { Form, Button, Space, message, Typography, Modal, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuestionItem from './QuestionItem';
import Navbar from '../../../navbar/navbar';
import Sidebar from '../../../sidebar/sidebar';
import '../../admin_page.css';

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
  const role = localStorage.getItem('role');

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

      // Format questions data
      const formattedQuestions = quizData.questions?.map(q => ({
        id: q.id,
        question_text: q.question_text,
        points: q.points || 1,
        allows_multiple_correct: q.allows_multiple_correct,
        options: q.options?.map(opt => ({
          id: opt.id,
          option_text: opt.option_text,
          is_correct: opt.is_correct === true // Đảm bảo boolean
        })) || []
      })) || [];

      setQuestions(formattedQuestions);
      form.setFieldsValue({
        questions: formattedQuestions
      });

    } catch (error) {
      console.error('Error fetching quiz:', error);
      message.error('Không thể tải thông tin quiz');
      navigate('/admin/quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/questions/${questionId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      message.success('Xóa câu hỏi thành công');
      fetchQuizData();
    } catch (error) {
      console.error('Error deleting question:', error);
      message.error('Có lỗi xảy ra khi xóa câu hỏi');
    }
  };

  const handleUpdateQuestions = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      // Format lại dữ liệu trước khi gửi
      const formattedQuestions = values.questions?.map(q => ({
        id: q.id, // Giữ lại id nếu có
        question_text: q.question_text,
        points: q.points || 1,
        allows_multiple_correct: q.allows_multiple_correct === true,
        options: q.options?.map(opt => ({
          id: opt.id, // Giữ lại id nếu có
          option_text: opt.option_text,
          is_correct: opt.is_correct === true ? 1 : 0 // Chuyển về 1/0 cho database
        }))
      }));
      
      await axios.put(
        `http://localhost:5000/quizzes/${quizId}/questions`,
        { questions: formattedQuestions },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      message.success('Cập nhật câu hỏi thành công');
      fetchQuizData(); // Tải lại dữ liệu sau khi cập nhật
    } catch (error) {
      console.error('Error updating questions:', error);
      message.error('Có lỗi xảy ra khi cập nhật câu hỏi');
    } finally {
      setSubmitting(false);
    }
  };

  const showQuestionTypeModal = () => {
    setIsModalVisible(true);
    setQuestionType('single');
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
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content admin-container">
          <div className="course-management">
            <div className="page-header" style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Title level={2}>Quản lý câu hỏi - {quiz?.title}</Title>
            </div>

            <div className="form-container" style={{ maxWidth: 800, margin: '20px auto', background: 'white', padding: '24px', borderRadius: '8px' }}>
              <Form
                form={form}
                onFinish={handleUpdateQuestions}
                layout="vertical"
                disabled={loading}
                initialValues={{ questions: questions }}
              >
                <Form.List name="questions">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <QuestionItem
                          key={field.key}
                          form={form}
                          name={field.name}
                          remove={remove}
                          restField={field}
                          index={index}
                          handleDeleteQuestion={handleDeleteQuestion}
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
                    <Button onClick={() => navigate(role === 'admin' ? '/admin/quiz' : '/teacher/quiz')}>
                      Quay lại
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        </main>
      </div>

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
  );
};

export default QuestionManagement; 