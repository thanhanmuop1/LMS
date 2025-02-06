import axiosInstance from '../utils/axiosConfig';

const authService = {
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/login', credentials);
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

    register: async (userData) => {
        const response = await axiosInstance.post('/register', userData);
        return response.data;
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