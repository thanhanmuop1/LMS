const auth = require('../models/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password, full_name, role } = req.body;
        
        // Kiểm tra email đã tồn tại
        const existingUser = await auth.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Kiểm tra username đã tồn tại
        const existingUsername = await auth.getUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Tạo user với role được chỉ định hoặc mặc định là student
        const user = await auth.createUser({
            username,
            email,
            password: hashedPassword,
            full_name,
            role: role || 'student'
        });

        res.status(201).json({ 
            message: 'Đăng ký thành công',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Tìm user theo username hoặc email
        const user = await auth.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        // Kiểm tra password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                email: user.email,
                role: user.role 
            },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Chỉ admin mới có quyền xem danh sách users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const users = await auth.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    getAllUsers
};

