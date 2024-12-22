import React from 'react';
import CreateQuizBase from '../../common/quiz/CreateQuizBase';

const CreateQuiz = () => {
  return (
    <CreateQuizBase
      role="teacher"
      apiEndpoint="http://localhost:5000/teacher/quizzes"
    />
  );
};

export default CreateQuiz; 