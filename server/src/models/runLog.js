const mongoose = require('mongoose');

const runLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    distance: {
        type: Number,
        required: true,
        default: 0
    },
    timeElapsed: {
        type: Number,
        required: true,
        default: 0
    },
    speed: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('runLog', runLogSchema);