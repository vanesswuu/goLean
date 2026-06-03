const express = require('express');
const router = express.Router();

const { saveNotification, getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, saveNotification)
    .get(protect, getNotifications);

module.exports = router;