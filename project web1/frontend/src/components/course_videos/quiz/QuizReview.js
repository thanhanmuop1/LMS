import React from 'react';
import { Radio, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './quiz.css';

const QuizReview = ({ quiz, quizResult }) => {
    if (!quiz || !quizResult || !quizResult.details) {
        return null;
    }

    return (
        <div className="quiz-review">
            {quiz.questions.map((question, index) => {
                const resultDetail = quizResult.details.find(d => d.id === question.id);
                const correctOption = question.options.find(opt => opt.is_correct);
                
                return (
                    <div key={question.id} className="quiz-question">
                        <p className="question-text">
                            {index + 1}. {question.question_text}
                        </p>
                        <Radio.Group value={resultDetail?.selected_answer} disabled>
                            <Space direction="vertical" className="quiz-options">
                                {question.options.map(option => {
                                    const isSelected = option.id === resultDetail?.selected_answer;
                                    const isCorrect = option.id === correctOption?.id;
                                    
                                    return (
                                        <div 
                                            key={option.id} 
                                            className={`option-wrapper ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''}`}
                                        >
                                            <Radio value={option.id}>
                                                {option.option_text}
                                            </Radio>
                                            {isCorrect && <CheckCircleOutlined className="icon-correct" />}
                                            {isSelected && !isCorrect && <CloseCircleOutlined className="icon-wrong" />}
                                        </div>
                                    );
                                })}
                            </Space>
                        </Radio.Group>
                    </div>
                );
            })}
        </div>
    );
};

export default QuizReview; 