const quiz = require('../models/quiz');

const quizController = {
    getQuizzesByCourse: async (req, res) => {
        try {
            const courseId = req.params.courseId;
            const quizzes = await quiz.getQuizzesByCourse(courseId);
            res.json(quizzes);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getQuizzesByChapter: async (req, res) => {
        try {
            const chapterId = req.params.chapterId;
            const quizzes = await quiz.getQuizzesByChapter(chapterId);
            res.json(quizzes);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    submitQuiz: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized - Please login' });
            }

            const quizId = req.params.quizId;
            const userId = req.user.id;
            const { answers } = req.body;
            
            if (!answers || Object.keys(answers).length === 0) {
                return res.status(400).json({ message: 'No answers provided' });
            }

            const result = await quiz.submitQuizAttempt(userId, quizId, answers);
            
            try {
                await quiz.saveQuizAttempt({
                    userId,
                    quizId,
                    score: result.score,
                    status: result.passed ? 'completed' : 'failed',
                    answers
                });
            } catch (saveError) {
                console.error('Error saving quiz attempt:', saveError);
                return res.status(500).json({ 
                    message: 'Error saving quiz attempt',
                    error: saveError.message 
                });
            }

            res.json(result);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            if (error.message === 'Quiz not found' || error.message === 'Invalid quiz attempt') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ 
                    message: 'Internal server error',
                    error: error.message 
                });
            }
        }
    },

    getQuizResult: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized - Please login' });
            }

            const quizId = req.params.quizId;
            const userId = req.user.id;

            const result = await quiz.getLatestAttempt(userId, quizId);
            if (!result) {
                return res.json(null);
            }

            // Thêm thông tin is_correct cho mỗi câu hỏi
            if (result.details) {
                result.details = result.details.map(question => {
                    const correctOption = question.options.find(opt => opt.is_correct);
                    return {
                        ...question,
                        is_correct: question.selected_answer === correctOption?.id
                    };
                });
            }

            res.json(result);
        } catch (error) {
            console.error('Error getting quiz result:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = quizController; 