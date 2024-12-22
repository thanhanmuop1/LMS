import React from 'react';
import AddQuizBase from '../../../common/quiz/AddQuizBase';

const AddQuiz = ({ visible, onCancel, onSuccess }) => {
  return (
    <AddQuizBase
      visible={visible}
      onCancel={onCancel}
      onSuccess={onSuccess}
      role="teacher"
      apiEndpoint="http://localhost:5000/teacher/quizzes"
    />
  );
};

export default AddQuiz; 