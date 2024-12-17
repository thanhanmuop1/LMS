const db = require('../configs/database');

const lms = {
    getAllCourses: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.*, u.full_name as teacher_name 
                FROM courses c
                LEFT JOIN users u ON c.teacher_id = u.id
                ORDER BY c.created_at DESC
            `;
            db.query(query, [], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    getChaptersByCourseId: (courseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM chapters WHERE course_id = ? ORDER BY order_index ASC',
                [courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getAllVideos: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT v.*, c.title as chapter_title 
                FROM videos v 
                LEFT JOIN chapters c ON v.chapter_id = c.id`,
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getVideosByCourseId: (courseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT v.*, c.title as chapter_title 
                FROM videos v 
                LEFT JOIN chapters c ON v.chapter_id = c.id 
                WHERE v.course_id = ? 
                ORDER BY c.order_index ASC`,
                [courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getVideosByChapterId: (chapterId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM videos WHERE chapter_id = ?',
                [chapterId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getVideoById: (videoId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT v.*, c.title as chapter_title 
                FROM videos v 
                LEFT JOIN chapters c ON v.chapter_id = c.id 
                WHERE v.id = ?`,
                [videoId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results[0]);
                }
            );
        });
    },

    createCourse: (courseData) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO courses (title, description, thumbnail, teacher_id, is_public) VALUES (?, ?, ?, ?, ?)',
                [
                    courseData.title, 
                    courseData.description, 
                    courseData.thumbnail,
                    courseData.teacher_id,
                    courseData.is_public || false
                ],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({ id: results.insertId, ...courseData });
                }
            );
        });
    },

    deleteCourse: (courseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM courses WHERE id = ?',
                [courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    deleteChaptersByCourseId: (courseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM chapters WHERE course_id = ?',
                [courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getCourseById: (courseId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.*, u.full_name as teacher_name 
                FROM courses c
                LEFT JOIN users u ON c.teacher_id = u.id
                WHERE c.id = ?
            `;
            db.query(query, [courseId], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0]);
            });
        });
    },

    updateCourse: (courseId, courseData) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE courses SET title = ?, description = ?, thumbnail = ? WHERE id = ?',
                [courseData.title, courseData.description, courseData.thumbnail, courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({ id: courseId, ...courseData });
                }
            );
        });
    },

    deleteVideosByCourseId: (courseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM videos WHERE course_id = ?',
                [courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    createChapter: (courseId, title) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO chapters (course_id, title) VALUES (?, ?)',
                [courseId, title],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({ id: results.insertId, course_id: courseId, title });
                }
            );
        });
    },

    updateChapter: (chapterId, title) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE chapters SET title = ? WHERE id = ?',
                [title, chapterId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({ id: chapterId, title });
                }
            );
        });
    },

    deleteChapter: (chapterId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM chapters WHERE id = ?',
                [chapterId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },



    deleteVideosByChapterId: (chapterId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM videos WHERE chapter_id = ?',
                [chapterId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    createVideo: (chapterId, courseId, title, videoUrl) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO videos (title, video_url, chapter_id, course_id) 
                VALUES (?, ?, ?, ?)
            `;
            
            // Log để debug
            console.log('Creating video with params:', { chapterId, courseId, title, videoUrl });
            
            db.query(query, [title, videoUrl, chapterId, courseId], (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    updateVideo: (videoId, title, videoUrl) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE videos SET title = ?, video_url = ? WHERE id = ?',
                [title, videoUrl, videoId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    deleteVideo: (videoId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM videos WHERE id = ?',
                [videoId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getVideoCompletion: (userId, videoId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM video_completion WHERE user_id = ? AND video_id = ?',
                [userId, videoId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results[0]);
                }
            );
        });
    },

    markVideoAsWatched: (userId, videoId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO video_completion (user_id, video_id, is_completed) VALUES (?, ?, 1)',
                [userId, videoId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getCompletedVideos: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, user_id, video_id, is_completed FROM video_completion WHERE user_id = ? AND is_completed = 1',
                [userId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    updateCourseVisibility: (courseId, isPublic) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE courses 
                SET is_public = ? 
                WHERE id = ?
            `;
            db.query(query, [isPublic, courseId], (error, results) => {
                if (error) {
                    console.error("Error updating course visibility:", error);
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    getCourseVisibility: (courseId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT is_public 
                FROM courses 
                WHERE id = ?
            `;
            db.query(query, [courseId], (error, results) => {
                if (error) {
                    console.error("Error fetching course visibility:", error);
                    reject(error);
                    return;
                }
                resolve(results[0]?.is_public);
            });
        });
    },

    getTeacherCourses: (teacherId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.*, u.full_name as teacher_name 
                FROM courses c
                LEFT JOIN users u ON c.teacher_id = u.id
                WHERE c.teacher_id = ?
                ORDER BY c.created_at DESC
            `;
            db.query(query, [teacherId], (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    getDocumentsByCourseId: (courseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM documents WHERE course_id = ?',
                [courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getQuizzesByCourseId: (courseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM quizzes WHERE course_id = ?',
                [courseId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    },

    getChapterById: (chapterId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM chapters WHERE id = ?',
                [chapterId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results[0]);
                }
            );
        });
    },

    getDocumentById: (documentId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM documents WHERE id = ?',
                [documentId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results[0]);
                }
            );
        });
    },

    createDocument: (documentData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO documents (
                    title, 
                    file_path, 
                    file_type, 
                    course_id, 
                    chapter_id, 
                    video_id, 
                    teacher_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                documentData.title,
                documentData.file_path,
                documentData.file_type,
                documentData.course_id,
                documentData.chapter_id,
                documentData.video_id,
                documentData.teacher_id
            ];

            db.query(query, values, (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    reject(error);
                    return;
                }
                resolve({
                    id: results.insertId,
                    ...documentData
                });
            });
        });
    },

    getQuizzesByTeacher: (teacherId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT DISTINCT
                    q.*, 
                    c.title as course_title,
                    ch.title as chapter_title,
                    v.title as video_title,
                    (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count
                FROM quizzes q
                LEFT JOIN courses c ON q.course_id = c.id
                LEFT JOIN chapters ch ON q.chapter_id = ch.id
                LEFT JOIN videos v ON q.video_id = v.id
                WHERE q.teacher_id = ?
                ORDER BY q.created_at DESC
            `;
            
            db.query(query, [teacherId], (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    reject(error);
                    return;
                }
                console.log('Query results for teacher quizzes:', results);
                resolve(results);
            });
        });
    }
}

module.exports = lms;