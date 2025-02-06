import React from 'react';
import AddQuizBase from '../../../common/quiz/AddQuizBase';

const AddQuiz = ({ visible, onCancel, onSuccess }) => {
  return (
    <AddQuizBase
      visible={visible}
      onCancel={onCancel}
      onSuccess={onSuccess}
      role="admin"
      apiEndpoint={`/quizzes`}
    />
  );
};

export default AddQuiz; 