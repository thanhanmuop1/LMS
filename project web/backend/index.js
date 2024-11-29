const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const lmsRoutes = require('./src/routes/lmsRoutes');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use('/', lmsRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});