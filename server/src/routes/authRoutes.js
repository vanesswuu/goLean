const express = require('express');
const router = express.Router();

const { signupUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');


router.post('/signup', signupUser);
router.post('/login', loginUser);

//protected routes
router.get('/me', protect, getMe);



module.exports = router;