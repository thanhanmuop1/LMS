const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const quizRoutes = require('./routes/quizRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', quizRoutes);
app.use('/teacher', teacherRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 