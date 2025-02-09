const lms = require('../models/lms');
const document = require('../models/document');

const getAllCourses = async (req, res) => {
    try {
        const schoolId = req.school.id;
        const courses = await lms.getAllCourses(schoolId);
        // console.log(courses);
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
        // Cho phép cả admin và teacher tạo khóa học
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const { title, description, thumbnail, is_public } = req.body;
        const teacher_id = req.user.id; // Lấy ID của người tạo
        const school_id = req.school.id; // Lấy school_id từ middleware

        const course = await lms.createCourse({ 
            title, 
            description, 
            thumbnail,
            is_public,
            teacher_id,
            school_id
        });
        
        res.status(201).json(course);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const schoolId = req.school.id;

        // Kiểm tra quyền xóa
        const course = await lms.getCourseById(courseId, schoolId);
        if (!course) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }

        if (req.user.role !== 'admin' && 
            (req.user.role === 'teacher' && course.teacher_id !== req.user.id)) {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        // Xóa course
        await lms.deleteCourse(courseId);
        
        res.status(200).json({ message: 'Xóa khóa học thành công' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const schoolId = req.school.id;     
        
        // Kiểm tra khóa học có tồn tại không
        const course = await lms.getCourseById(courseId, schoolId);
        if (!course) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }

        // Kiểm tra quyền - admin có thể sửa tất cả, giáo viên chỉ sửa được khóa học của mình
        if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
            return res.status(403).json({ message: 'Không có quyền chỉnh sửa khóa học này' });
        }

        const { title, description, thumbnail, is_public } = req.body;

        const updatedCourse = await lms.updateCourse(courseId, { 
            title, 
            description, 
            thumbnail,
            is_public: typeof is_public === 'boolean' ? is_public : course.is_public // Chỉ cập nhật nếu có gửi lên
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
        const schoolId = req.school.id;
        const course = await lms.getCourseById(courseId, schoolId);
        
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
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
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
        // Kiểm tra quyền cập nhật
        const chapterId = req.params.chapterId;
        const chapter = await lms.getChapterById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chương' });
        }

        // Cho phép admin hoặc teacher sở hữu khóa học
        if (req.user.role === 'admin') {
            const { title } = req.body;
            const updatedChapter = await lms.updateChapter(chapterId, title);
            return res.json(updatedChapter);
        }

        // Nếu là teacher, kiểm tra quyền sở hữu
        const schoolId = req.school.id;
        const course = await lms.getCourseById(chapter.course_id, schoolId);
        if (course.teacher_id !== req.user.id) {
            return res.status(403).json({ message: 'Không có quyền chỉnh sửa chương này' });
        }

        const { title } = req.body;
        const updatedChapter = await lms.updateChapter(chapterId, title);
        res.json(updatedChapter);
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteChapter = async (req, res) => {
    try {
        // Cho phép admin và teacher xóa chương
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const chapterId = req.params.chapterId;
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
        // Cho phép cả admin và teacher tạo video
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Không có quyền thực hiện' });
        }

        const chapterId = req.params.chapterId;
        const { title, video_url, course_id } = req.body;
        
        // Log để debug
        console.log('Received video data:', { chapterId, title, video_url, course_id });
        
        // Validate required fields
        if (!title || !video_url || !chapterId || !course_id) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin bắt buộc',
                required: {
                    title: !title,
                    video_url: !video_url,
                    chapter_id: !chapterId,
                    course_id: !course_id
                }
            });
        }

        // Kiểm tra quyền với khóa học
        if (req.user.role === 'teacher') {
            const schoolId = req.school.id;
            const course = await lms.getCourseById(course_id, schoolId);
            if (!course || course.teacher_id !== req.user.id) {
                return res.status(403).json({ message: 'Không có quyền thêm video vào khóa học này' });
            }
        }
        
        // Tạo video với đầy đủ thông tin
        const videoData = {
            title,
            video_url,
            chapter_id: chapterId,
            course_id
        };
        
        const result = await lms.createVideo(videoData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

const updateVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const { title, video_url } = req.body;
        const teacherId = req.user.id;

        // Kiểm tra video có tồn tại không
        const video = await lms.getVideoById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Không tìm thấy video' });
        }

        // Kiểm tra quyền - admin có thể sửa tất cả, giáo viên chỉ sửa được video trong khóa học của mình
        const schoolId = req.school.id;
        const course = await lms.getCourseById(video.course_id, schoolId);
        if (req.user.role !== 'admin' && course.teacher_id !== teacherId) {
            return res.status(403).json({ message: 'Không có quyền chỉnh sửa video này' });
        }
        
        await lms.updateVideo(videoId, title, video_url);
        res.status(200).json({ message: 'Cập nhật video thành công' });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        
        // Kiểm tra video có tồn tại không
        const video = await lms.getVideoById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Không tìm thấy video' });
        }

        await lms.deleteVideo(videoId);  // xóa video
        
        res.status(200).json({ message: 'Xóa video thành công' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const markVideoAsWatched = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user.id;

        // Check if the record already exists
        const existingRecord = await lms.getVideoCompletion(userId, videoId);
        if (existingRecord) {
            return res.status(200).json({ message: 'Video already marked as watched' });
        }

        // Mark video as watched
        await lms.markVideoAsWatched(userId, videoId);
        res.status(200).json({ message: 'Video marked as watched' });
    } catch (error) {
        console.error('Error marking video as watched:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCompletedVideos = async (req, res) => {
    try {
        const userId = req.user.id;
        const completedVideos = await lms.getCompletedVideos(userId);
        res.status(200).json(completedVideos);
    } catch (error) {
        console.error('Error getting completed videos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    // Trả về đường dẫn file
    const thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    res.status(200).json({ url: thumbnailUrl });
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCourseVisibility = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { isPublic } = req.body;

        // Kiểm tra khóa học có tồn tại không
        const course = await lms.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }

        // Kiểm tra quyền - admin có thể sửa tất cả, giáo viên chỉ sửa được khóa học của mình
        if (req.user.role !== 'admin' && course.teacher_id !== req.user.id) {
            return res.status(403).json({ 
                message: 'Không có quyền thay đổi trạng thái khóa học này' 
            });
        }

        await lms.updateCourseVisibility(courseId, isPublic);
        res.json({ 
            message: `Khóa học đã được ${isPublic ? 'public' : 'private'}` 
        });
    } catch (error) {
        console.error('Error updating course visibility:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCourseVisibility = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const isPublic = await lms.getCourseVisibility(courseId);
        res.json({ isPublic });
    } catch (error) {
        console.error('Error fetching course visibility:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getStudentsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const schoolId = req.school.id;
    // Kiểm tra khóa học tồn tại
    const course = await lms.getCourseById(courseId, schoolId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }

    // Kiểm tra quyền truy cập (chỉ admin và giáo viên của khóa học)
    if (req.user.role !== 'admin' && 
        (req.user.role === 'teacher' && course.teacher_id !== req.user.id)) {
      return res.status(403).json({ 
        message: 'Không có quyền xem danh sách học sinh của khóa học này' 
      });
    }

    const students = await lms.getStudentsByCourseId(courseId);
    res.json(students);
  } catch (error) {
    console.error('Error getting students by course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeStudentFromCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.params.userId;

        // Kiểm tra khóa học tồn tại
        const course = await lms.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        }

        // Kiểm tra quyền truy cập (chỉ admin và giáo viên của khóa học)
        if (req.user.role !== 'admin' && 
            (req.user.role === 'teacher' && course.teacher_id !== req.user.id)) {
            return res.status(403).json({ 
                message: 'Không có quyền xóa học viên khỏi khóa học này' 
            });
        }
        
        // Sau đó xóa khỏi khóa học
        await lms.deleteStudentFromCourse(courseId, userId);
        
        res.status(200).json({ 
            message: 'Đã xóa học viên khỏi khóa học thành công' 
        });
    } catch (error) {
        console.error('Error removing student from course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCourseDescription = async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const description = await lms.getCourseDescription(courseId);
        console.log(description);
        if (!description) {
            return res.status(404).json({ message: 'Không tìm thấy mô tả khóa học' });
        }
        res.json(description);
    } catch (error) {
        console.error('Error getting course description:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateCourseDescription = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { description } = req.body;

        await lms.updateCourseDescription(courseId, description);
        res.json({ message: 'Cập nhật mô tả thành công' });
    } catch (error) {
        console.error('Error updating course description:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCourseRating = async (req, res) => {
    const courseId = req.params.courseId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    
    try {
        const result = await lms.getCourseRating(courseId, page, limit);
        res.json(result);
    } catch (error) {
        console.error('Error getting course rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const createCourseRating = async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user.id;
    try {
        const { rating, rating_text } = req.body;
        await lms.createCourseRating(courseId, userId, rating, rating_text);
        res.json({ message: 'Đánh giá khóa học thành công' });
    } catch (error) {
        console.error('Error creating course rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getCourseRatingStats = async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const stats = await lms.getCourseRatingStats(courseId);
        res.json(stats);
    } catch (error) {
        console.error('Error getting course rating stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

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
    deleteVideo,
    markVideoAsWatched,
    getCompletedVideos,
    uploadThumbnail,
    updateCourseVisibility,
    getCourseVisibility,
    getStudentsByCourse,
    removeStudentFromCourse,
    getCourseDescription,
    updateCourseDescription,
    getCourseRating,
    createCourseRating,
    getCourseRatingStats
};

