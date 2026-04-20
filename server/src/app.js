const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorHandler');
//import routes after dependencies imports
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const runLogRoutes = require('./routes/runLogRoutes');


const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//mount routes after middlewares
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/runs', runLogRoutes);


app.use(errorHandler);

module.exports = app;