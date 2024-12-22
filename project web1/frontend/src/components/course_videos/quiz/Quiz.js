import React, { useState, useEffect, useCallback } from 'react';
import { Card, Radio, Checkbox, Space, Button, message, Result, Progress, Alert, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import QuizReview from './QuizReview';
import './quiz.css';

const { Title, Text } = Typography;

const Quiz = ({ quiz: initialQuiz }) => {
  const [quiz, setQuiz] = useState(initialQuiz);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timer, setTimer] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const navigate = useNavigate();

  const handleSubmitQuiz = useCallback(async () => {
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
      
      setQuizResult({
        ...response.data,
        answers: selectedAnswers
      });
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
  }, [quiz?.id, selectedAnswers, navigate]);

  useEffect(() => {
    setSelectedAnswers({});
    setQuizResult(null);
    setShowResult(false);
    setShowAnswers(false);
    setIsStarted(false);
    setTimeRemaining(null);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [initialQuiz?.id]);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/quizzes/${initialQuiz.id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setQuiz(response.data);

        const resultResponse = await axios.get(
          `http://localhost:5000/quizzes/${initialQuiz.id}/result`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (resultResponse.data) {
          setQuizResult(resultResponse.data);
          setShowResult(true);
          setIsStarted(true);
        }
      } catch (error) {
        console.error('Error initializing quiz:', error);
        message.error('Có lỗi xảy ra khi tải thông tin quiz');
      }
    };

    if (initialQuiz?.id) {
      initializeQuiz();
    }
  }, [initialQuiz?.id]);

  useEffect(() => {
    if (!isStarted || showResult || timeRemaining === null) {
      return;
    }

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

    return () => {
      clearInterval(interval);
      setTimer(null);
    };
  }, [isStarted, showResult, timeRemaining, handleSubmitQuiz]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeProgress = () => {
    if (!timeRemaining || !quiz?.duration_minutes) return 100;
    const totalSeconds = quiz.duration_minutes * 60;
    return Math.round((timeRemaining / totalSeconds) * 100);
  };

  const handleAnswerChange = (questionId, value, isMultiple = false) => {
    if (isMultiple) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: value // value sẽ là array cho multichoice
      }));
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: [value] // wrap single value trong array để thống nhất format
      }));
    }
  };

  const renderQuestionOptions = (question) => {
    if (question.allows_multiple_correct) {
      return (
        <Checkbox.Group
          onChange={(values) => handleAnswerChange(question.id, values, true)}
          value={selectedAnswers[question.id] || []}
        >
          <Space direction="vertical" className="quiz-options">
            {question.options && question.options.map(option => (
              <Checkbox key={option.id} value={option.id}>
                {option.option_text}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      );
    }

    return (
      <Radio.Group
        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
        value={selectedAnswers[question.id]?.[0]}
      >
        <Space direction="vertical" className="quiz-options">
          {question.options && question.options.map(option => (
            <Radio key={option.id} value={option.id}>
              {option.option_text}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    );
  };

  const handleRetry = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/quizzes/${quiz.id}/reset`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setShowResult(false);
      setQuizResult(null);
      setSelectedAnswers({});
      setShowAnswers(false);
      setIsStarted(false);
      setTimeRemaining(quiz?.duration_minutes * 60 || 1800);
    } catch (error) {
      message.error('Có lỗi xảy ra khi reset bài làm');
    }
  }, [quiz?.id, quiz?.duration_minutes]);

  const handleStartQuiz = () => {
    setIsStarted(true);
    setTimeRemaining(quiz?.duration_minutes * 60 || 1800);
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
            subTitle={`Điểm của bạn: ${quizResult.score}/100 ${quizResult.passed ? '- Đạt' : '- Chưa đạt'}`}
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
            <p className="question-text">
              {question.question_text}
              {question.allows_multiple_correct && 
                <span className="multiple-choice-indicator"> (Chọn nhiều đáp án)</span>
              }
            </p>
            {renderQuestionOptions(question)}
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