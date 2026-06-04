const express = require('express');
const router = express.Router();

const { saveNotification, getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, saveNotification)
    .get(protect, getNotifications);

router.put('/mark-read', protect, markAsRead);

module.exports = router;