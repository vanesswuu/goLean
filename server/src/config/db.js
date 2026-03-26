const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`mongo db connected ${conn.connection.host}`);

    } catch (error) {
        console.error(`error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;