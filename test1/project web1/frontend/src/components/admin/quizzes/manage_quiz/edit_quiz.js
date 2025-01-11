import React from 'react';
import EditQuizBase from '../../../common/quiz/EditQuizBase';

const EditQuiz = ({ visible, onCancel, onSuccess, quizData }) => {
  return (
    <EditQuizBase
      visible={visible}
      onCancel={onCancel}
      onSuccess={onSuccess}
      quizData={quizData}
      role="admin"
      apiEndpoint={`${process.env.REACT_APP_API_URL}/quizzes`}
    />
  );
};

export default EditQuiz; 