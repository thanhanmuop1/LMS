const lms = require('../models/lms');

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

const createChapter = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const courseId = req.params.courseId;
        const { title } = req.body;
        
        const result = await lms.createChapter(courseId, title);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateChapter = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const chapterId = req.params.chapterId;
        const { title } = req.body;
        
        await lms.updateChapter(chapterId, title);
        res.status(200).json({ message: 'Cập nhật chương thành công' });
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteChapter = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const chapterId = req.params.chapterId;

        // Xóa tất cả video trong chương
        await lms.deleteVideosByChapterId(chapterId);
        // Xóa chương
        await lms.deleteChapter(chapterId);
        
        res.status(200).json({ message: 'Xóa chương thành công' });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createVideo = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const chapterId = req.params.chapterId;
        const { title, video_url, course_id } = req.body;
        
        const result = await lms.createVideo(chapterId, course_id, title, video_url);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateVideo = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const videoId = req.params.videoId;
        const { title, video_url } = req.body;
        
        await lms.updateVideo(videoId, title, video_url);
        res.status(200).json({ message: 'Cập nhật video thành công' });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteVideo = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const videoId = req.params.videoId;

        // Xóa video
        await lms.deleteVideo(videoId);
        
        res.status(200).json({ message: 'Xóa video thành công' });
    } catch (error) {
        console.error('Error deleting video:', error);
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
    createCourse,
    deleteCourse,
    updateCourse,
    getCourseById,
    createChapter,
    updateChapter,
    deleteChapter,
    createVideo,
    updateVideo,
    deleteVideo
};

