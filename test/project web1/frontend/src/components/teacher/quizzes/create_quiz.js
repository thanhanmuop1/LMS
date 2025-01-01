import React from 'react';
import CreateQuizBase from '../../common/quiz/CreateQuizBase';

const CreateQuiz = () => {
  return (
    <CreateQuizBase
      role="teacher"
      apiEndpoint={`${process.env.REACT_APP_API_URL}/teacher/quizzes`}
    />
  );
};

export default CreateQuiz; 