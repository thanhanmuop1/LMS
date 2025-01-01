import React from 'react';
import AddQuizBase from '../../../common/quiz/AddQuizBase';

const AddQuiz = ({ visible, onCancel, onSuccess }) => {
  return (
    <AddQuizBase
      visible={visible}
      onCancel={onCancel}
      onSuccess={onSuccess}
      role="admin"
      apiEndpoint={`${process.env.REACT_APP_API_URL}/quizzes`}
    />
  );
};

export default AddQuiz; 