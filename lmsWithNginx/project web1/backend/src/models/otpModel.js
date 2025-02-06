const db = require('../config/database');

const otpModel = {
    createOTP: (data) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO otp_verifications 
                (user_id, email, otp, type, expires_at) 
                VALUES (?, ?, ?, ?, ?)
            `;
            
            db.query(query, [
                data.user_id,
                data.email,
                data.otp,
                data.type,
                data.expires_at
            ], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results.insertId);
            });
        });
    },

    verifyOTP: (email, otp, type) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM otp_verifications 
                WHERE email = ? 
                AND otp = ? 
                AND type = ?
                AND expires_at > NOW()
                ORDER BY created_at DESC 
                LIMIT 1
            `;
            
            db.query(query, [email, otp, type], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0]);
            });
        });
    },

    deleteOTP: (email, type) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM otp_verifications WHERE email = ? AND type = ?';
            db.query(query, [email, type], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
};

module.exports = otpModel; 