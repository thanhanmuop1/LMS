import React from 'react';
import CreateQuizBase from '../../common/quiz/CreateQuizBase';

const CreateQuiz = () => {
  return (
    <CreateQuizBase
      role="admin"
      apiEndpoint={`/quizzes`}
    />
  );
};

export default CreateQuiz; 