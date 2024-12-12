import React, { useState, useEffect } from 'react';
import { Card, Radio, Space, Button, message, Result, Progress, Alert, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import QuizReview from './QuizReview';
import './quiz.css';

const { Title, Text } = Typography;

const Quiz = ({ quiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timer, setTimer] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedAnswers({});
    setQuizResult(null);
    setShowResult(false);
    setShowAnswers(false);
    checkPreviousAttempt();
    
    if (timer) {
      clearInterval(timer);
    }
    setTimeRemaining(quiz?.duration_minutes * 60 || 1800);
  }, [quiz?.id]);

  
  useEffect(() => {
    if (!showResult && timeRemaining !== null) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [showResult, timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeProgress = () => {
    const totalSeconds = quiz?.duration_minutes * 60 || 1800;
    return Math.round((timeRemaining / totalSeconds) * 100);
  };

  // Check if user has already attempted this quiz
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
        setIsStarted(true);
      } else {
        setIsStarted(false);
      }
    } catch (error) {
      console.error('Error checking previous attempt:', error);
      setIsStarted(false);
    }
  };

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

  const handleStartQuiz = () => {
    setIsStarted(true);
  };

  if (!quiz) {
    return <div className="loading-icon"><LoadingOutlined /></div>;
  }

  if (!isStarted && !showResult) {
    return (
      <div className="quiz-container">
        <Card className="quiz-intro-card">
          <Title level={2}>{quiz.title || 'Bài kiểm tra'}</Title>
          
          <div className="quiz-info">
            <Alert
              message="Thông tin bài kiểm tra"
              description={
                <Space direction="vertical">
                  <Text><strong>Thời gian làm bài:</strong> {quiz.duration_minutes || 30} phút</Text>
                  <Text><strong>Số câu hỏi:</strong> {quiz.questions?.length || 0} câu</Text>
                  <Text><strong>Điểm đạt yêu cầu:</strong> {quiz.passing_score || 60}/100 điểm</Text>
                  <Text><strong>Loại bài kiểm tra:</strong> {quiz.quiz_type === 'chapter' ? 'Kiểm tra chương' : 'Kiểm tra video'}</Text>
                </Space>
              }
              type="info"
              showIcon
            />
          </div>

          <div className="quiz-rules">
            <Alert
              message="Lưu ý"
              description={
                <ul className="quiz-rules-list">
                  <li>Bài kiểm tra sẽ bắt đầu tính giờ ngay khi bạn nhấn "Bắt đầu làm bài"</li>
                  <li>Bài làm sẽ tự động được nộp khi hết thời gian</li>
                  <li>Không thoát khỏi trang khi đang làm bài</li>
                  <li>Đảm bảo kết nối internet ổn định</li>
                </ul>
              }
              type="warning"
              showIcon
            />
          </div>

          <div className="quiz-actions">
            <Button type="primary" size="large" onClick={handleStartQuiz}>
              Bắt đầu làm bài
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
      <Card 
        title={quiz.title || 'Bài kiểm tra'} 
        className="quiz-card"
        extra={
          <div className="quiz-timer">
            <Progress 
              type="circle" 
              percent={getTimeProgress()} 
              format={() => formatTime(timeRemaining)}
              width={60}
              status={timeRemaining < 60 ? "exception" : "normal"}
            />
          </div>
        }
      >
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