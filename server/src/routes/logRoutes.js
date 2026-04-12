const express = require('express');
const router = express.Router();

const { saveLog, getLogs } = require('../controllers/logController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, saveLog)
    .get(protect, getLogs);

module.exports = router;