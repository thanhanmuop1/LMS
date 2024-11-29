const db = require('../configs/database');

const lms = {
    getAllCourses: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM courses', (error, results) => {
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
                ORDER BY c.order_index DESC`,
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

    getVideoProgress: (userId, videoId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM video_progress WHERE user_id = ? AND video_id = ?',
                [userId, videoId],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results[0] || { completed: false });
                }
            );
        });
    },

    updateVideoProgress: (userId, videoId, completed) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO video_progress (user_id, video_id, completed) 
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE completed = ?`,
                [userId, videoId, completed, completed],
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

    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
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

    createUser: (userData) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
                [userData.username, userData.email, userData.password, userData.full_name],
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

    createCourse: (courseData) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO courses (title, description, thumbnail) VALUES (?, ?, ?)',
                [courseData.title, courseData.description, courseData.thumbnail],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({ id: results.insertId, ...courseData });
                }
            );
        });
    }
};

module.exports = lms;