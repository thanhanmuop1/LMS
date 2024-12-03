const lms = require('../models/lms');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllCourses = async (req, res) => {
    try {
        const courses = await lms.getAllCourses();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllVideos = async (req, res) => {
    try {
        const videos = await lms.getAllVideos();
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error getting videos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getVideosByCourseId = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const videos = await lms.getVideosByCourseId(courseId);
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error getting videos for course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getVideoById = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const video = await lms.getVideoById(videoId);
        
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        
        res.status(200).json(video);
    } catch (error) {
        console.error('Error getting video:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getChaptersByCourseId = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const chapters = await lms.getChaptersByCourseId(courseId);
        res.status(200).json(chapters);
    } catch (error) {
        console.error('Error getting chapters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getVideosByChapterId = async (req, res) => {
    try {
        const chapterId = req.params.chapterId;
        const videos = await lms.getVideosByChapterId(chapterId);
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error getting videos for chapter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getVideoProgress = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const userId = req.user.id; // Assuming you have authentication middleware
        const progress = await lms.getVideoProgress(userId, videoId);
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error getting video progress:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateVideoProgress = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const userId = req.user.id; // Assuming you have authentication middleware
        const { completed } = req.body;
        await lms.updateVideoProgress(userId, videoId, completed);
        res.status(200).json({ message: 'Progress updated successfully' });
    } catch (error) {
        console.error('Error updating video progress:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const register = async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;
        
        // Check if user already exists
        const existingUser = await lms.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await lms.createUser({
            username,
            email,
            password: hashedPassword,
            full_name
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Get user by email
        const user = await lms.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'your_jwt_secret', // Thay thế bằng secret key thực tế
            { expiresIn: '24h' }
        );

        res.status(200).json({
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
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createCourse = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const { title, description, thumbnail } = req.body;
        const course = await lms.createCourse({ title, description, thumbnail });
        res.status(201).json(course);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const courseId = req.params.courseId;

        // Xóa tất cả video progress liên quan đến videos của khóa học
        await lms.deleteVideoProgressByCourseId(courseId);
        
        // Xóa tất cả videos của khóa học
        await lms.deleteVideosByCourseId(courseId);
        
        // Xóa tất cả chapters của khóa học
        await lms.deleteChaptersByCourseId(courseId);
        
        // Cuối cùng xóa khóa học
        await lms.deleteCourse(courseId);
        
        res.status(200).json({ message: 'Xóa khóa học thành công' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCourse = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const courseId = req.params.courseId;
        const { title, description, thumbnail } = req.body;

        // Kiểm tra xem khóa học có tồn tại không
        const existingCourse = await lms.getCourseById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }

        const updatedCourse = await lms.updateCourse(courseId, { 
            title, 
            description, 
            thumbnail 
        });
        
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await lms.getCourseById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }
        
        res.status(200).json(course);
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { 
    getAllCourses,
    getAllVideos,
    getVideosByCourseId,
    getVideoById,
    getChaptersByCourseId,
    getVideosByChapterId,
    getVideoProgress,
    updateVideoProgress,
    register,
    login,
    createCourse,
    deleteCourse,
    updateCourse,
    getCourseById
};

