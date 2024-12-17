// Question routes
router.get('/quizzes/:quizId/questions', adminController.getQuizQuestions);
router.post('/quizzes/:quizId/questions', adminController.addQuestions);
router.put('/quizzes/:quizId/questions', adminController.updateQuestions);
router.delete('/questions/:id', adminController.deleteQuestion); 