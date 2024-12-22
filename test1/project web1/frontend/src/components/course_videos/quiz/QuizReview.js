import React from 'react';
import { Card, Typography, Space } from 'antd';
import './QuizReview.css';

const { Text } = Typography;

const QuizReview = ({ quiz, quizResult }) => {
  if (!quiz || !quiz.questions || !quizResult || !quizResult.answers) {
    return null;
  }

  return (
    <div className="quiz-review">
      <h3>Xem lại bài làm</h3>
      <Space direction="vertical" style={{ width: '100%' }}>
        {quiz.questions.map((question, qIndex) => {
          const userAnswer = quizResult.answers[question.id];
          return (
            <Card key={question.id} style={{ marginBottom: 16 }}>
              <div className="question">
                <Text strong>{qIndex + 1}. {question.question_text}</Text>
                <div className="options">
                  {question.options?.map(option => {
                    const isUserAnswer = userAnswer === option.id;
                    const isCorrect = option.is_correct;
                    let optionStyle = {};
                    
                    if (isUserAnswer) {
                      optionStyle.backgroundColor = isCorrect ? '#f6ffed' : '#fff1f0';
                      optionStyle.border = `1px solid ${isCorrect ? '#b7eb8f' : '#ffa39e'}`;
                    } else if (isCorrect) {
                      optionStyle.backgroundColor = '#f6ffed';
                      optionStyle.border = '1px solid #b7eb8f';
                    }

                    return (
                      <div 
                        key={option.id} 
                        className="option"
                        style={{
                          padding: '8px 12px',
                          marginBottom: 8,
                          borderRadius: 4,
                          ...optionStyle
                        }}
                      >
                        <Space>
                          {isUserAnswer && (
                            <Text type={isCorrect ? 'success' : 'danger'}>
                              {isCorrect ? '✓' : '✗'}
                            </Text>
                          )}
                          <Text>{option.option_text}</Text>
                          {isCorrect && !isUserAnswer && (
                            <Text type="success">(Đáp án đúng)</Text>
                          )}
                        </Space>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </Space>
    </div>
  );
};

export default QuizReview; 