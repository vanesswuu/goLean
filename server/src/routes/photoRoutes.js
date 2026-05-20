const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const { protect } = require('../middlewares/authMiddleware');
const { uploadPhoto, getPhotos } =
    require('../controllers/photoController');

//multer configuration for local storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.route('/')
    .post(protect, upload.single('image'), uploadPhoto)
    .get(protect, getPhotos);

module.exports = router;