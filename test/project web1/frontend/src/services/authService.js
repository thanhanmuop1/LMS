import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}`;

const authService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error) {
            if (error.response?.data?.needsVerification) {
                const verificationError = new Error('Vui lòng xác thực email trước khi đăng nhập');
                verificationError.response = {
                    data: {
                        needsVerification: true,
                        message: 'Vui lòng xác thực email trước khi đăng nhập'
                    }
                };
                throw verificationError;
            }
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