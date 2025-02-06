import React from 'react';
import CreateQuizBase from '../../common/quiz/CreateQuizBase';

const CreateQuiz = () => {
  return (
    <CreateQuizBase
      role="teacher"
      apiEndpoint={`/teacher/quizzes`}
    />
  );
};

export default CreateQuiz; 