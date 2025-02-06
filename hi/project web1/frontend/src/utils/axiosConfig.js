import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL.startsWith('http') 
    ? process.env.REACT_APP_API_URL 
    : `http://${process.env.REACT_APP_API_URL}`;

const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Thêm auth token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Thêm subdomain header
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        if (parts.length > 1 && parts[0] !== 'www') {
            config.headers['X-Subdomain'] = parts[0];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.notFound) {
            window.location.href = '/not-found';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 