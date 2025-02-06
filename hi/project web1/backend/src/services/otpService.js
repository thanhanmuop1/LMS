const otpModel = require('../models/otpModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const otpService = {
    generateOTP: () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    sendOTPEmail: async (email, otp) => {
        const mailOptions = {
            from: {
                name: 'LMS System',
                address: process.env.MAIL_USER
            },
            to: email,
            subject: 'Mã xác thực OTP',
            html: `
                <h1>Xác thực tài khoản</h1>
                <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
                <p>Mã này sẽ hết hạn sau 5 phút.</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
            `
        };

        return transporter.sendMail(mailOptions);
    },

    createAndSendOTP: async (userData, type) => {
        const otp = otpService.generateOTP();
        const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

        await otpModel.createOTP({
            user_id: userData.id,
            email: userData.email,
            otp,
            type,
            expires_at
        });

        await otpService.sendOTPEmail(userData.email, otp);
        return true;
    },

    verifyOTP: async (email, otp, type) => {
        const verification = await otpModel.verifyOTP(email, otp, type);
        if (!verification) {
            throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn');
        }
        await otpModel.deleteOTP(email, type);
        return true;
    }
};

module.exports = otpService; 