import React from 'react';
import CreateQuizBase from '../../common/quiz/CreateQuizBase';

const CreateQuiz = () => {
  return (
    <CreateQuizBase
      role="admin"
      apiEndpoint={`${process.env.REACT_APP_API_URL}/quizzes`}
    />
  );
};

export default CreateQuiz; 