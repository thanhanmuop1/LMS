import React, { useState, useEffect } from 'react';
import { Card, Radio, Space, Button, message, Result } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import QuizReview from './QuizReview';
import './quiz.css';

const Quiz = ({ quiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPreviousAttempt = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !quiz) return;

        const response = await axios.get(
          `http://localhost:5000/quizzes/${quiz.id}/result`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (response.data) {
          setQuizResult(response.data);
          setShowResult(true);
        }
      } catch (error) {
        console.error('Error checking previous attempt:', error);
      }
    };

    checkPreviousAttempt();
  }, [quiz]);

  if (!quiz) {
    return <div className="loading-icon"><LoadingOutlined /></div>;
  }

  const handleAnswerChange = (questionId, value) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Vui lòng đăng nhập để nộp bài');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/quizzes/${quiz.id}/submit`,
        { answers: selectedAnswers },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setQuizResult(response.data);
      setShowResult(true);
      setSelectedAnswers({});
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        message.error(error.response?.data?.message || 'Có lỗi xảy ra khi nộp bài');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setShowResult(false);
    setQuizResult(null);
    setSelectedAnswers({});
    setShowAnswers(false);
  };

  if (showResult && quizResult) {
    return (
      <div className="quiz-container">
        <Card className="quiz-card">
          <Result
            icon={quizResult.passed ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            status={quizResult.passed ? "success" : "error"}
            title={quizResult.passed ? "Chúc mừng! Bạn đã hoàn thành bài kiểm tra" : "Rất tiếc! Bạn chưa đạt yêu cầu"}
            subTitle={`Điểm của bạn: ${quizResult.score}/100 ${quizResult.passed ? '' : '- Chưa đạt'}`}
            extra={[
              <Button type="primary" key="retry" onClick={handleRetry}>
                Làm lại
              </Button>,
              <Button key="review" onClick={() => setShowAnswers(!showAnswers)}>
                {showAnswers ? 'Ẩn đáp án' : 'Xem đáp án'}
              </Button>
            ]}
          />

          {showAnswers && <QuizReview quiz={quiz} quizResult={quizResult} />}
        </Card>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <Card title={quiz.title || 'Bài kiểm tra'} className="quiz-card">
        {quiz.questions && quiz.questions.map(question => (
          <div key={question.id} className="quiz-question">
            <p className="question-text">{question.question_text}</p>
            <Radio.Group
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              value={selectedAnswers[question.id]}
            >
              <Space direction="vertical" className="quiz-options">
                {question.options && question.options.map(option => (
                  <Radio key={option.id} value={option.id}>
                    {option.option_text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        ))}
        <Button 
          type="primary" 
          onClick={handleSubmitQuiz}
          loading={submitting}
          disabled={Object.keys(selectedAnswers).length === 0 || submitting}
        >
          Nộp bài
        </Button>
      </Card>
    </div>
  );
};

export default Quiz; 