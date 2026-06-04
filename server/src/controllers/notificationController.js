const Notification = require('../models/Notification');

// @desc save a received notification
// @route POST /api/notifications
// @access Private

const saveNotification = async (req, res, next) => {

    try {

        const { title, body, expoId } = req.body;
        const notification = new Notification({
            user: req.user.id,
            title,
            body,
            expoId
        });

        const created = await notification.save();
        res.status(201).json(created);

    } catch (error) {
        next(error);
    }
}


// @desc get all notification for the logged-in user
// @route GET /api/notifications
// @access Private
const getNotifications = async (req, res, next) => {

    try {
        const notifications = await Notification.find({
            user: req.user.id,
        }).sort({ receivedAt: -1 });
        res.json(notifications);

    } catch (error) {
        next(error);
    }
};


const markAsRead = async (req, res, next) => {

    try {

        await Notification.updateMany(
            { user: req.user.id, isRead: { $ne: true } },
            { $set: { isRead: true } }
        );
        res.json({ message: 'Notifications marked as read' })
    } catch (error) {
        next(error);
    }

}

module.exports = { saveNotification, getNotifications, markAsRead }