const db = require('../config/db');

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

    updateSchool: (schoolId, data) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE schools SET ? WHERE id = ?';
            db.query(query, [data, schoolId], (error, results) => {
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