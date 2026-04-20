const express = require('express');
const router = express.Router();

const { saveRun, getRuns } = require('../controllers/runController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, saveRun)
    .get(protect, getRuns)

module.exports = router;