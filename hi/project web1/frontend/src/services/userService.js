import axiosInstance from '../utils/axiosConfig';

const userService = {
    // Lấy thông tin profile
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/users/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    // Cập nhật thông tin profile
    updateProfile: async (profileData) => {
        try {
            const response = await axiosInstance.put('/users/profile', profileData);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // Upload avatar
    uploadAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axiosInstance.post('/users/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }
};

export default userService; 