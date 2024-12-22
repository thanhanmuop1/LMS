import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Tạo instance axios với cấu hình chung
const api = axios.create({
  baseURL: BASE_URL,
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Định nghĩa các endpoints theo module
const endpoints = {
  teacher: {
    courses: '/teacher/courses',
    chapters: '/teacher/courses/:courseId/chapters',
    updateChapter: '/teacher/chapters/:id',
    videos: '/teacher/courses/:courseId/videos',
    quizzes: '/teacher/courses/:courseId/quizzes',
    documents: '/teacher/courses/:courseId/documents',
  },
  admin: {
    courses: '/courses',
    chapters: '/courses/:courseId/chapters',
    updateChapter: '/chapters/:id',
    videos: '/chapters/:chapterId/videos',
    quizzes: '/courses/:courseId/quizzes',
    documents: '/courses/:courseId/documents',
  }
};

// Helper function để thay thế params trong URL
const replaceParams = (url, params) => {
  let finalUrl = url;
  Object.keys(params).forEach(key => {
    finalUrl = finalUrl.replace(`:${key}`, params[key]);
  });
  return finalUrl;
};

const checkAndRefreshAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || !role) {
        // Redirect to login or refresh token
        window.location.href = '/login';
        return false;
    }
    return true;
};

// Service functions
const apiService = {
  // Lấy endpoint dựa vào role
  getEndpoint: (path, params = {}) => {
    const role = localStorage.getItem('role');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Current role from storage:', role); // Debug log
    console.log('Current user from storage:', user); // Debug log
    
    // Fallback to user object if role is not in localStorage
    const effectiveRole = role || user.role;
    
    if (!effectiveRole) {
        console.error('No role found');
        throw new Error('No role found');
    }
    
    const baseEndpoint = effectiveRole === 'admin' ? endpoints.admin[path] : endpoints.teacher[path];
    if (!baseEndpoint) {
      console.error(`Endpoint not found for path: ${path}`);
      throw new Error(`Endpoint not found for path: ${path}`);
    }
    
    return replaceParams(baseEndpoint, params);
  },

  // CRUD operations
  get: async (path, params = {}) => {
    const url = apiService.getEndpoint(path, params);
    return api.get(url);
  },

  post: async (path, data, params = {}) => {
    if (!checkAndRefreshAuth()) return;
    const url = apiService.getEndpoint(path, params);
    return api.post(url, data);
  },

  put: async (path, data, params = {}) => {
    try {
      const url = apiService.getEndpoint(path, params);
      return await api.put(url, data);
    } catch (error) {
      console.error(`API Error (${path}):`, error.response || error); // Log chi tiết lỗi
      throw error; // Ném lỗi để component xử lý
    }
  },

  delete: async (path, params = {}) => {
    const url = apiService.getEndpoint(path, params);
    return api.delete(url);
  }
};

export default apiService; 