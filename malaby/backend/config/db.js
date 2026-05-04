const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // MongoDB Atlas connection options
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Server will continue running without database connection');
    // process.exit(1); ← تم إزالته عشان السيرفر مايقعش
  }
};

module.exports = connectDB;
