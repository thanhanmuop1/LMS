const db = require('../config/database');
const bcrypt = require('bcrypt');

const adminAuthModel = {
    registerAdmin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            const { username, email, password, full_name } = adminData;
            
            // Kiểm tra email tồn tại
            const checkEmail = 'SELECT * FROM users WHERE email = ? AND role = "admin"';
            db.query(checkEmail, [email], async (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (results.length > 0) {
                    reject(new Error('Email đã được sử dụng'));
                    return;
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Thêm admin mới
                const query = `
                    INSERT INTO users (username, email, password, full_name, role, email_verified)
                    VALUES (?, ?, ?, ?, 'admin', true)
                `;

                db.query(query, [username, email, hashedPassword, full_name], (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results.insertId);
                });
            });
        });
    },

    loginAdmin: (email, password) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ? or username = ? AND role = "admin"';
            db.query(query, [email, email], async (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (results.length === 0) {
                    reject(new Error('Email hoặc mật khẩu không đúng'));
                    return;
                }

                const admin = results[0];
                const validPassword = await bcrypt.compare(password, admin.password);
                if (!validPassword) {
                    reject(new Error('Email hoặc mật khẩu không đúng'));
                    return;
                }

                resolve(admin);
            });
        });
    },

    verifyEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET email_verified = true WHERE email = ? AND role = "admin"';
            db.query(query, [email], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
};

module.exports = adminAuthModel; 