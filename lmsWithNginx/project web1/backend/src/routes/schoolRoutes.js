const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/school-logos/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer cho upload logo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'school-logo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh'));
        }
    }
});

// Routes cho quản lý trường học
router.post('/admin/schools', authMiddleware, isAdmin, schoolController.createSchool);
router.post('/admin/schools/upload_logo', authMiddleware, isAdmin, upload.single('logo'), schoolController.uploadLogo);
router.get('/admin/schools', authMiddleware, isAdmin, schoolController.getAllSchools);
router.put('/admin/schools/:id', authMiddleware, isAdmin, schoolController.updateSchool);
router.delete('/admin/schools/:id', authMiddleware, isAdmin, schoolController.deleteSchool);
router.get('/check-domain', schoolController.checkDomain);
router.get('/my-schools', authMiddleware, schoolController.getMySchools);

module.exports = router; 