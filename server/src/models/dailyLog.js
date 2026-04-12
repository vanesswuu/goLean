const mongoose = require('mongoose');

const dailyLogSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    dateString: {
        type: String,
        required: true
    },
    totalCals: {
        type: Number,
        required: true,
        default: 0
    },
    protein: {
        type: Number,
        required: true,
        default: 0
    },
    carbs: {
        type: Number,
        required: true,
        default: 0
    },
    fats: {
        type: Number,
        required: true,
        default: 0
    },
    meals: [
        {
            type: { type: String },
            food: { type: String },
            calories: { type: Number },
            p: { type: Number },
            c: { type: Number },
            f: { type: Number },
            timestamp: { type: String }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);