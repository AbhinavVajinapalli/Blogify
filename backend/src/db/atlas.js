import mongoose from 'mongoose';
import { getEnv } from '../config/env.js';

export const connectDB = async () => {
  try {
    const mongoUri = getEnv('MONGODB_URI');

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });

    console.log('MongoDB Atlas connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message);
  }
};
