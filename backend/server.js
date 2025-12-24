require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/tasks', require('./src/routes/task.routes'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));