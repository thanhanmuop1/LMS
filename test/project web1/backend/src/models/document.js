const db = require('../configs/database');
const fs = require('fs');

const document = {
    createDocument: (documentData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO documents 
                (title, file_path, file_type, course_id, chapter_id, video_id) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            db.query(
                query,
                [
                    documentData.title,
                    documentData.file_path,
                    documentData.file_type,
                    documentData.course_id,
                    documentData.chapter_id,
                    documentData.video_id
                ],
                (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({ id: results.insertId, ...documentData });
                }
            );
        });
    },

    getDocuments: (courseId, chapterId, videoId) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM documents WHERE course_id = ?';
            const params = [courseId];

            if (chapterId) {
                query += ' AND chapter_id = ?';
                params.push(chapterId);
            }

            if (videoId) {
                query += ' AND video_id = ?';
                params.push(videoId);
            }

            db.query(query, params, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    getDocumentById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM documents WHERE id = ?';
            db.query(query, [id], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0]);
            });
        });
    },

    deleteDocument: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM documents WHERE id = ?';
            db.query(query, [id], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    deleteDocumentsByVideoId: (videoId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Lấy danh sách documents của video để xóa file vật lý
                const getDocsQuery = 'SELECT file_path FROM documents WHERE video_id = ?';
                db.query(getDocsQuery, [videoId], (error, documents) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    // Xóa các file vật lý
                    documents.forEach(doc => {
                        if (fs.existsSync(doc.file_path)) {
                            fs.unlinkSync(doc.file_path);
                        }
                    });

                    // Xóa records trong database
                    const deleteQuery = 'DELETE FROM documents WHERE video_id = ?';
                    db.query(deleteQuery, [videoId], (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(result);
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }
};

module.exports = document;