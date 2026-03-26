const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next(); //all good now, move to the next function
        } catch (error) {
            console.error('token verification failed', error.message);
            res.status(401);
            throw new Error('not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('not authorized, no token provided');
    }

}

module.exports = { protect };