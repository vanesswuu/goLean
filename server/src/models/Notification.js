const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

    title: {
        type: String,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['streak', 'run_distance', 'run_streak', 'run_speed', 'reminder', 'general'],
        default: 'general'
    },
    mileStone: {
        type: Number,
    },
    isRead: {
        type: Boolean,
        default: false
    },

    receivedAt: {
        type: Date,
        default: Date.now,
    },

    expoId: {
        type: String,
    },

}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
