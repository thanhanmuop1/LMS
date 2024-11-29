const express = require('express');
const router = express.Router();
const lmsControllers = require('../controllers/lmsControllers');
const authMiddleware = require('../middleware/auth');

router.get('/courses', lmsControllers.getAllCourses);
router.get('/videos', lmsControllers.getAllVideos);
router.get('/videos/:videoId', lmsControllers.getVideoById);
router.get('/courses/:courseId/chapters', lmsControllers.getChaptersByCourseId);
router.get('/courses/:courseId/videos', lmsControllers.getVideosByCourseId);
router.get('/chapters/:chapterId/videos', lmsControllers.getVideosByChapterId);
router.get('/videos/:videoId/progress', authMiddleware, lmsControllers.getVideoProgress);
router.post('/videos/:videoId/progress', authMiddleware, lmsControllers.updateVideoProgress);
router.post('/auth/register', lmsControllers.register);
router.post('/auth/login', lmsControllers.login);
router.post('/courses', authMiddleware, lmsControllers.createCourse);

module.exports = router;

// CREATE TABLE `chapters` (
//     `id` int(11) NOT NULL,
//     `course_id` int(11) DEFAULT NULL,
//     `title` varchar(255) DEFAULT NULL,
//     `order_index` int(11) DEFAULT NULL,
//     `created_at` timestamp NOT NULL DEFAULT current_timestamp()
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// CREATE TABLE `courses` (
//     `id` int(11) NOT NULL,
//     `title` varchar(200) NOT NULL,
//     `description` text DEFAULT NULL,
//     `thumbnail` varchar(255) DEFAULT NULL,
//     `created_at` timestamp NOT NULL DEFAULT current_timestamp()
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// CREATE TABLE `users` (
//     `id` int(11) NOT NULL,
//     `username` varchar(50) NOT NULL,
//     `email` varchar(100) NOT NULL,
//     `password` varchar(255) NOT NULL,
//     `full_name` varchar(100) DEFAULT NULL,
//     `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//     `role` enum('admin','student','teacher') DEFAULT 'student'
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// CREATE TABLE `videos` (
//     `id` int(11) NOT NULL,
//     `title` varchar(200) NOT NULL,
//     `course_id` int(11) NOT NULL,
//     `video_url` varchar(255) NOT NULL,
//     `chapter_id` int(11) DEFAULT NULL
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// CREATE TABLE `video_progress` (
//     `id` int(11) NOT NULL AUTO_INCREMENT,
//     `user_id` int(11) NOT NULL,
//     `video_id` int(11) NOT NULL, 
//     `completed` boolean DEFAULT false,
//     `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
//     `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
//     PRIMARY KEY (`id`),
//     UNIQUE KEY `user_video_unique` (`user_id`, `video_id`),
//     FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
//     FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;