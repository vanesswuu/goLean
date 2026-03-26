const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    //TDEE fields
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    weight: { type: Number, required: true }, //in kg
    height: { type: Number, required: true }, //in cm
    activityLevel: {
        type: String,
        required: true,
        enum: ['sedentary', 'light', 'moderate', 'heavy', 'athlete'],
        default: 'sedentary'
    }
}, {
    timestamps: true
});


//check user's entered password if it matched the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


//before saving, hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);


module.exports = User;
