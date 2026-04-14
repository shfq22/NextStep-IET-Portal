const mongoose = require('mongoose');
const logger = console;

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dsw-tsa44';

let isConnected = false;

async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    logger.log(`MongoDB connected: ${MONGO_URI}`);
  } catch (error) {
    isConnected = false;
    logger.warn('MongoDB not available — document upload features will be disabled.');
    logger.warn('Other features (auth, grievances, scholarships, announcements, forum) work without MongoDB.');
  }
}

function getIsConnected() {
  return isConnected;
}

module.exports = { connectDB, getIsConnected };