const schoolModel = require('../models/schoolModel');
const hostsService = require('../services/hostsService');

const schoolController = {
    // Tạo trường học mới
    createSchool: async (req, res) => {
        try {
            const { name, domain } = req.body;
            const user_id = req.user.id;
            const logo = req.body.logo || null;

            // Validate dữ liệu
            if (!name || !domain) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên trường và tên miền là bắt buộc'
                });
            }

            // Kiểm tra domain đã tồn tại
            const existingSchool = await schoolModel.getSchoolByDomain(domain);
            if (existingSchool) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên miền này đã được sử dụng'
                });
            }

            const schoolData = {
                name,
                domain,
                logo,
                status: 'active',
                created_at: new Date(),
                updated_at: new Date(),
                user_id
            };

            // Tạo school trong database
            const schoolId = await schoolModel.createSchool(schoolData);
            
            res.status(201).json({
                success: true,
                message: 'Tạo trường học thành công',
                data: { 
                    id: schoolId,
                    domain,
                    url: `${domain}.${process.env.BASE_DOMAIN}`
                }
            });
        } catch (error) {
            console.error('Error in createSchool:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi tạo trường học'
            });
        }
    },

    // Upload logo trường học
    uploadLogo: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy file'
                });
            }

            const logoUrl = `/uploads/school-logos/${req.file.filename}`;
            
            res.json({
                success: true,
                message: 'Upload logo thành công',
                url: logoUrl
            });
        } catch (error) {
            console.error('Error in uploadLogo:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi upload logo'
            });
        }
    },

    // Lấy danh sách trường học
    getAllSchools: async (req, res) => {
        try {
            const schools = await schoolModel.getAllSchools();
            res.json({
                success: true,
                data: schools
            });
        } catch (error) {
            console.error('Error in getAllSchools:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách trường học'
            });
        }
    },

    // Cập nhật thông tin trường học
    updateSchool: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, domain, status } = req.body;
            const logo = req.body.logo || null;

            // Kiểm tra trường học tồn tại
            const school = await schoolModel.getSchoolById(id);
            if (!school) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy trường học'
                });
            }

            // Kiểm tra domain mới có bị trùng không
            if (domain && domain !== school.domain) {
                const existingSchool = await schoolModel.getSchoolByDomain(domain);
                if (existingSchool) {
                    return res.status(400).json({
                        success: false,
                        message: 'Tên miền này đã được sử dụng'
                    });
                }
            }

            const updateData = {
                ...(name && { name }),
                ...(domain && { domain }),
                ...(status && { status }),
                ...(logo && { logo }),
                updated_at: new Date()
            };

            await schoolModel.updateSchool(id, updateData);
            
            res.json({
                success: true,
                message: 'Cập nhật trường học thành công'
            });
        } catch (error) {
            console.error('Error in updateSchool:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi cập nhật trường học'
            });
        }
    },

    // Xóa trường học (soft delete)
    deleteSchool: async (req, res) => {
        try {
            const { id } = req.params;
            
            const school = await schoolModel.getSchoolById(id);
            if (!school) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy trường học'
                });
            }

            // Xóa domain khỏi hosts file trước
            try {
                await hostsService.removeDomain(school.domain);
            } catch (hostError) {
                console.error('Error removing from hosts file:', hostError);
            }

            // Xóa school từ database
            await schoolModel.deleteSchool(id);
            
            res.json({
                success: true,
                message: 'Xóa trường học thành công'
            });
        } catch (error) {
            console.error('Error in deleteSchool:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi xóa trường học'
            });
        }
    },

    // Thêm function mới vào schoolController
    checkDomain: async (req, res) => {
        try {
            const subdomain = req.headers['x-subdomain'];
            
            // Thêm cache control headers
            res.set('Cache-Control', 'public, max-age=300'); // Cache 5 phút
            
            if (!subdomain || subdomain === 'www') {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy subdomain',
                    notFound: true
                });
            }

            const school = await schoolModel.getSchoolByDomain(subdomain);

            if (!school) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy trường học',
                    notFound: true
                });
            }

            return res.json({
                success: true,
                message: 'Tìm thấy trường học',
                data: {
                    id: school.id,
                    name: school.name,
                    domain: school.domain,
                    logo: school.logo
                }
            });
        } catch (error) {
            console.error('Error checking domain:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server',
                notFound: true
            });
        }
    },

    getMySchools: async (req, res) => {
        try {
            // Lấy user_id từ token thông qua middleware auth
            const userId = req.user.id;

            const schools = await schoolModel.getSchoolsByUserId(userId);

            return res.json({
                success: true,
                message: 'Lấy danh sách trường học thành công',
                data: schools
            });
        } catch (error) {
            console.error('Error getting schools:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy danh sách trường học'
            });
        }
    }
};

module.exports = schoolController;