const schoolModel = require('../models/schoolModel');

// Cache để lưu kết quả truy vấn school
const schoolCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

const subdomainMiddleware = async (req, res, next) => {
    try {
        // Bỏ qua middleware cho route check-domain
        if (req.path === '/check-domain') {
            return next();
        }

        const subdomain = req.headers['x-subdomain'];
        
        // Check cache trước
        const cacheKey = subdomain || 'default';
        const cachedSchool = schoolCache.get(cacheKey);
        
        if (cachedSchool && (Date.now() - cachedSchool.timestamp) < CACHE_DURATION) {
            req.school = cachedSchool.data;
            return next();
        }

        // Nếu không có trong cache, query database
        let school;
        if (!subdomain || subdomain === 'www') {
            school = await schoolModel.getSchoolByDomain('school1');
        } else {
            school = await schoolModel.getSchoolByDomain(subdomain);
        }

        // Lưu vào cache
        if (school) {
            schoolCache.set(cacheKey, {
                data: school,
                timestamp: Date.now()
            });
        }

        req.school = school;
        next();
    } catch (error) {
        console.error('Subdomain middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

module.exports = subdomainMiddleware; 