const express = require('express');
const cors = require('cors');
const router = express.Router();
const bodyParser = require('body-parser');
const lmsRoutes = require('./src/routes/lmsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const courseEnrollRoutes = require('./src/routes/courseEnrollRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const userRoutes = require('./src/routes/userRoutes');
const classRoutes = require('./src/routes/classRoutes');
const schoolRoutes = require('./src/routes/schoolRoutes');
const adminAuthRoutes = require('./src/routes/adminAuthRoutes');
const subdomainMiddleware = require('./src/middleware/subdomainMiddleware');
const app = express();
const port = 5000;

app.use(bodyParser.json());

const allowedOriginRegex = /^http:\/\/([a-zA-Z0-9-]+\.)?localhost(?::\d+)?$/;

app.use(cors({
  origin: (origin, callback) => {
    // Nếu không có origin (ví dụ: request từ cùng domain), cho phép
    if (!origin) return callback(null, true);

    // Kiểm tra xem origin có khớp với regex cho phép không
    if (allowedOriginRegex.test(origin)) {
      return callback(null, true); // Cho phép origin này
    }

    // Nếu không khớp, từ chối
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(subdomainMiddleware);

app.use('/teacher', teacherRoutes);
app.use('/', lmsRoutes);
app.use('/', quizRoutes);
app.use('/', authRoutes);
app.use('/', documentRoutes);
app.use('/courseEnroll', courseEnrollRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/search', searchRoutes);
app.use('/users', userRoutes);
app.use('/', classRoutes);
app.use('/', schoolRoutes);
app.use('/admin', adminAuthRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});