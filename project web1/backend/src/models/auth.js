const db = require('../configs/database');

const auth = {
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

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, username, email, full_name, role FROM users';
            db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    },
}
module.exports = auth;