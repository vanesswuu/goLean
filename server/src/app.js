const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorHandler');

//import routes after dependencies imports
const authRoutes = require('./routes/authRoutes');




const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//mount routes after middlewares
app.use('/api/auth', authRoutes);




//this is a routes placeholder
app.get('/', (req, res) => {
    res.json({
        message: 'welcome to goLean'
    })
})

app.use(errorHandler);

module.exports = app;