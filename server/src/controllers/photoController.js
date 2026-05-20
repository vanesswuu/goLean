const TransPhoto = require('../models/TransPhoto');

// @desc upload a new progress photo
// @route POST /api/photos
// @access Private

const uploadPhoto = async (req, res, next) => {

    try {
        if (!req.file) {
            res.status(400);
            return next(new Error('Please upload an image file'));
        }

        //create the photo record in mongodb
        const photo = await TransPhoto.create({
            user: req.user._id,
            imageUrl: `/uploads/${req.file.filename}`,
            weight: req.body.weight || req.user.weight
        });

        res.status(201).json(photo);

    } catch (error) {
        next(error);
    }

};


const getPhotos = async (req, res, next) => {

    try {
        const photos = await TransPhoto.find({
            user: req.user._id
        }).sort('-createdAt');

        res.status(200).json(photos);
    } catch (error) {
        next(error);
    }

};

module.exports = {
    uploadPhoto,
    getPhotos
}