const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const lmsRoutes = require('./src/routes/lmsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const documentRoutes = require('./src/routes/documentRoutes');


const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use('/', lmsRoutes);
app.use('/', quizRoutes);
app.use('/', authRoutes);
app.use('/', documentRoutes);
app.use('/uploads', express.static('uploads'));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});