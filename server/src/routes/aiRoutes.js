const express = require('express');
const router = express.Router();
const { parseMealString, getDailyQuote } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/parse-meal', protect, parseMealString);
router.get('/quote', protect, getDailyQuote);


module.exports = router;