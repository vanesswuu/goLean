const express = require('express');
const router = express.Router();

const { signupUser, loginUser, updateUserProfile, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');


router.post('/signup', signupUser);
router.post('/login', loginUser);

//protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);


module.exports = router;