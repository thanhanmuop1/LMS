import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const authService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
            const { token, user } = response.data;
            
            console.log('Auth response:', response.data); // Debug log
            
            // Lưu token và role vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Kiểm tra xem đã lưu thành công chưa
            const storedRole = localStorage.getItem('role');
            console.log('Stored role after login:', storedRole); // Debug log
            
            return response.data;
        } catch (error) {
            console.error('Auth error:', error); // Debug log
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getRole: () => {
        return localStorage.getItem('role');
    }
};

export default authService; 