const db = require('../config/database');

const schoolModel = {
    createSchool: (schoolData) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO schools SET ?';
            db.query(query, schoolData, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results.insertId);
            });
        });
    },

    getSchoolByDomain: (domain) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM schools WHERE domain = ? AND status = "active"';
            db.query(query, [domain], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0]);
            });
        });
    },

    getAllSchools: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM schools WHERE status = "active" ORDER BY created_at DESC';
            db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    getSchoolById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM schools WHERE id = ?';
            db.query(query, [id], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0]);
            });
        });
    },

    deleteSchool: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM schools WHERE id = ?';
            db.query(query, [id], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    updateSchool: (id, schoolData) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE schools SET ? WHERE id = ?';
            schoolData.updated_at = new Date();
            
            db.query(query, [schoolData, id], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },

    checkSchoolExists: (domain) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM schools WHERE domain = ?';
            db.query(query, [domain], (error, results) => {
                resolve(results.length > 0);
            });
        });
    },

    getSchoolsByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, name, domain, logo, status, created_at, updated_at
                FROM schools
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;
            
            db.query(query, [userId], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
};

module.exports = schoolModel; 