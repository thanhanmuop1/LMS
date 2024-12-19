import React from 'react';
import EditQuizBase from '../../../common/quiz/EditQuizBase';

const EditQuiz = ({ visible, onCancel, onSuccess, quizData }) => {
  return (
    <EditQuizBase
      visible={visible}
      onCancel={onCancel}
      onSuccess={onSuccess}
      quizData={quizData}
      role="teacher"
      apiEndpoint="http://localhost:5000/teacher/quizzes"
    />
  );
};

export default EditQuiz; 