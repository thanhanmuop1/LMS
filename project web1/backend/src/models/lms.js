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
            db.query(
                'SELECT * FROM courses WHERE id = ?',
                [courseId],
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
                    resolve(results);
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
            db.query(
                'INSERT INTO videos (chapter_id, course_id, title, video_url) VALUES (?, ?, ?, ?)',
                [chapterId, courseId, title, videoUrl],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({ 
                        id: results.insertId, 
                        chapter_id: chapterId,
                        course_id: courseId,
                        title,
                        video_url: videoUrl 
                    });
                }
            );
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
};

module.exports = lms;