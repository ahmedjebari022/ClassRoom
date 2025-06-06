const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`);
    }

};

module.exports = connectDB;