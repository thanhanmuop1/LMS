const adminAuthModel = require('../models/adminAuthModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Tận dụng cấu hình nodemailer từ authController
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

const adminAuthController = {
    register: async (req, res) => {
        try {
            const { username, email, password, full_name } = req.body;

            // Validate input
            if (!username || !email || !password || !full_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Đăng ký admin sử dụng auth model
            const user = await auth.createUser({
                username,
                email,
                password: hashedPassword,
                full_name,
                role: 'admin',
                verification_token: verificationToken,
                email_verified: false
            });

            // Gửi email xác thực
            const verificationUrl = `${process.env.BASE_URL}/verify-email/${verificationToken}`;
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: 'Xác thực tài khoản Admin',
                html: `
                    <h1>Xin chào ${full_name}!</h1>
                    <p>Cảm ơn bạn đã đăng ký tài khoản Admin. Vui lòng click vào link bên dưới để xác thực email:</p>
                    <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #1890ff; color: white; text-decoration: none; border-radius: 4px;">
                        Xác thực email
                    </a>
                    <p>Hoặc copy link này vào trình duyệt: ${verificationUrl}</p>
                    <p>Link này sẽ hết hạn sau 24 giờ.</p>
                    <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
                `
            });

            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản'
            });

        } catch (error) {
            console.error('Error in admin registration:', error);
            res.status(error.message.includes('đã được sử dụng') ? 400 : 500).json({
                success: false,
                message: error.message || 'Lỗi khi đăng ký admin'
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body; 
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin'
                });
            }

            // Sử dụng adminAuthModel thay vì auth
            const admin = await adminAuthModel.loginAdmin(email, password);
            
            // Tạo JWT token
            const token = jwt.sign(
                { id: admin.id, email: admin.email, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    token,
                    user: {
                        id: admin.id,
                        email: admin.email,
                        username: admin.username,
                        full_name: admin.full_name,
                        role: 'admin'
                    }
                }
            });

        } catch (error) {
            console.error('Error in admin login:', error);
            res.status(401).json({
                success: false,
                message: error.message || 'Email hoặc mật khẩu không đúng'
            });
        }
    }
};

module.exports = adminAuthController; 