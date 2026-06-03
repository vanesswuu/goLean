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

    receivedAt: {
        type: Date,
        default: Date.now,
    },

    expoId: {
        type: String,
    },

}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
