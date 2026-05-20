const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    imageUrl: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TransPhoto', photoSchema);