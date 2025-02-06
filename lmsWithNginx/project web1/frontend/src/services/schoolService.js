import axiosInstance from '../utils/axiosConfig';

const schoolService = {
    checkDomain: async () => {
        try {
            const response = await axiosInstance.get('/check-domain');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default schoolService; 