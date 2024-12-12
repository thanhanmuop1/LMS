const db = require('../configs/database');

const quiz = {
    getQuizzesByChapter: (chapterId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT q.*, qq.id as question_id, qq.question_text, 
                 qo.id as option_id, qo.option_text
                 FROM quizzes q
                 LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
                 LEFT JOIN quiz_options qo ON qq.id = qo.question_id
                 WHERE q.chapter_id = ?
                 ORDER BY q.id, qq.id, qo.id`,
                [chapterId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    
                    // Restructure data
                    const quizzes = {};
                    results.forEach(row => {
                        if (!quizzes[row.id]) {
                            quizzes[row.id] = {
                                id: row.id,
                                title: row.title,
                                duration_minutes: row.duration_minutes,
                                passing_score: row.passing_score,
                                questions: {}
                            };
                        }
                        
                        if (row.question_id && !quizzes[row.id].questions[row.question_id]) {
                            quizzes[row.id].questions[row.question_id] = {
                                id: row.question_id,
                                question_text: row.question_text,
                                options: []
                            };
                        }
                        
                        if (row.option_id) {
                            quizzes[row.id].questions[row.question_id].options.push({
                                id: row.option_id,
                                option_text: row.option_text
                            });
                        }
                    });
                    
                    // Convert to array
                    const quizzesArray = Object.values(quizzes).map(quiz => ({
                        ...quiz,
                        questions: Object.values(quiz.questions)
                    }));
                    
                    resolve(quizzesArray);
                }
            );
        });
    },

    getQuizzesByCourse: (courseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT q.*, qq.id as question_id, qq.question_text, qq.points,
                 qo.id as option_id, qo.option_text, qo.is_correct,
                 q.video_id, q.quiz_type
                 FROM quizzes q
                 LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
                 LEFT JOIN quiz_options qo ON qq.id = qo.question_id
                 WHERE q.course_id = ?
                 ORDER BY q.id, qq.id, qo.id`,
                [courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    // Restructure data
                    const quizzes = {};
                    results.forEach(row => {
                        if (!quizzes[row.id]) {
                            quizzes[row.id] = {
                                id: row.id,
                                title: row.title,
                                chapter_id: row.chapter_id,
                                video_id: row.video_id,
                                quiz_type: row.quiz_type,
                                duration_minutes: row.duration_minutes,
                                passing_score: row.passing_score,
                                questions: {}
                            };
                        }

                        if (row.question_id && !quizzes[row.id].questions[row.question_id]) {
                            quizzes[row.id].questions[row.question_id] = {
                                id: row.question_id,
                                question_text: row.question_text,
                                points: row.points,
                                options: []
                            };
                        }

                        if (row.option_id) {
                            quizzes[row.id].questions[row.question_id].options.push({
                                id: row.option_id,
                                option_text: row.option_text,
                                is_correct: row.is_correct
                            });
                        }
                    });

                    // Convert to array
                    const quizzesArray = Object.values(quizzes).map(quiz => ({
                        ...quiz,
                        questions: Object.values(quiz.questions)
                    }));

                    resolve(quizzesArray);
                }
            );
        });
    },

    submitQuizAttempt: (userId, quizId, answers) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Lấy thông tin quiz và câu trả lời đúng
                const quizQuery = `
                    SELECT q.id as quiz_id, q.passing_score,
                           qq.id as question_id, qq.question_text, qq.points,
                           qo.id as option_id, qo.option_text, qo.is_correct
                    FROM quizzes q
                    JOIN quiz_questions qq ON q.id = qq.quiz_id
                    JOIN quiz_options qo ON qq.id = qo.question_id
                    WHERE q.id = ?
                `;

                db.query(quizQuery, [quizId], (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (results.length === 0) {
                        reject(new Error('Quiz not found'));
                        return;
                    }

                    // Tính điểm và chuẩn bị chi tiết câu trả lời
                    let totalScore = 0;
                    let maxScore = 0;
                    const answeredQuestions = new Set();
                    const details = [];
                    const questionMap = new Map();

                    // Nhóm các options theo question_id
                    results.forEach(row => {
                        if (!questionMap.has(row.question_id)) {
                            questionMap.set(row.question_id, {
                                id: row.question_id,
                                question_text: row.question_text,
                                points: row.points || 1,
                                options: []
                            });
                        }
                        questionMap.get(row.question_id).options.push({
                            id: row.option_id,
                            text: row.option_text,
                            is_correct: row.is_correct === 1
                        });
                    });

                    // Xử lý từng câu hỏi
                    for (const [questionId, question] of questionMap) {
                        const questionPoints = question.points;
                        maxScore += questionPoints;

                        const userAnswer = answers[questionId];
                        const correctOption = question.options.find(opt => opt.is_correct);
                        const isCorrect = correctOption && userAnswer === correctOption.id;

                        if (isCorrect) {
                            totalScore += questionPoints;
                        }

                        details.push({
                            ...question,
                            selected_answer: userAnswer,
                            is_correct: isCorrect
                        });
                    }

                    // Tính điểm theo thang 100
                    const finalScore = Math.round((totalScore / maxScore) * 100);
                    const passingScore = results[0].passing_score || 60;
                    
                    resolve({
                        score: finalScore,
                        maxScore: 100,
                        passed: finalScore >= passingScore,
                        details: details
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    getLatestAttempt: (userId, quizId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT qa.*, q.passing_score,
                       qq.id as question_id, qq.question_text, qq.points,
                       qo.id as option_id, qo.option_text, qo.is_correct,
                       qans.selected_option_id
                FROM quiz_attempts qa
                JOIN quizzes q ON qa.quiz_id = q.id
                JOIN quiz_questions qq ON q.id = qq.quiz_id
                JOIN quiz_options qo ON qq.id = qo.question_id
                LEFT JOIN quiz_answers qans ON qa.id = qans.attempt_id AND qq.id = qans.question_id
                WHERE qa.user_id = ? AND qa.quiz_id = ?
                ORDER BY qa.end_time DESC
                LIMIT 1
            `;

            db.query(query, [userId, quizId], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                if (results.length === 0) {
                    resolve(null);
                    return;
                }

                // Tổ chức lại dữ liệu
                const questionMap = new Map();
                results.forEach(row => {
                    if (!questionMap.has(row.question_id)) {
                        questionMap.set(row.question_id, {
                            id: row.question_id,
                            question_text: row.question_text,
                            points: row.points,
                            options: [],
                            selected_answer: row.selected_option_id
                        });
                    }
                    questionMap.get(row.question_id).options.push({
                        id: row.option_id,
                        text: row.option_text,
                        is_correct: row.is_correct === 1
                    });
                });

                const details = Array.from(questionMap.values());
                const attempt = results[0];

                resolve({
                    score: attempt.score,
                    passed: attempt.status === 'completed',
                    attemptId: attempt.id,
                    details: details
                });
            });
        });
    },

    saveQuizAttempt: ({ userId, quizId, score, status, answers }) => {
        return new Promise((resolve, reject) => {
            // Xóa các attempt cũ, chỉ giữ lại 2 attempt gần nhất
            const deleteOldAttempts = `
                DELETE FROM quiz_attempts 
                WHERE user_id = ? AND quiz_id = ? 
                AND id NOT IN (
                    SELECT id FROM (
                        SELECT id FROM quiz_attempts 
                        WHERE user_id = ? AND quiz_id = ? 
                        ORDER BY end_time DESC LIMIT 2
                    ) as latest
                )
            `;

            // Thêm attempt mới
            const insertNewAttempt = `
                INSERT INTO quiz_attempts 
                (user_id, quiz_id, score, status) 
                VALUES (?, ?, ?, ?)
            `;

            // Thực hiện xóa attempts cũ
            db.query(deleteOldAttempts, [userId, quizId, userId, quizId], (err) => {
                if (err) {
                    console.error('Error deleting old attempts:', err);
                    reject(err);
                    return;
                }

                // Thêm attempt mới
                db.query(insertNewAttempt, [userId, quizId, score, status], (err, result) => {
                    if (err) {
                        console.error('Error inserting new attempt:', err);
                        reject(err);
                        return;
                    }

                    // Nếu có câu trả lời, lưu vào bảng quiz_answers
                    if (answers && Object.keys(answers).length > 0) {
                        const insertAnswerQuery = `
                            INSERT INTO quiz_answers 
                            (attempt_id, question_id, selected_option_id) 
                            VALUES (?, ?, ?)
                        `;

                        const answerPromises = Object.entries(answers).map(([questionId, optionId]) => {
                            return new Promise((resolve, reject) => {
                                db.query(
                                    insertAnswerQuery,
                                    [result.insertId, questionId, optionId],
                                    (err) => {
                                        if (err) {
                                            console.error('Error inserting answer:', err);
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    }
                                );
                            });
                        });

                        Promise.all(answerPromises)
                            .then(() => resolve(result))
                            .catch(err => reject(err));
                    } else {
                        resolve(result);
                    }
                });
            });
        });
    }
};

module.exports = quiz;