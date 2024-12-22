import React from 'react';
import CreateQuizBase from '../../common/quiz/CreateQuizBase';

const CreateQuiz = () => {
  return (
    <CreateQuizBase
      role="admin"
      apiEndpoint="http://localhost:5000/quizzes"
    />
  );
};

export default CreateQuiz; 