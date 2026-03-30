import mongoose from 'mongoose';
import { getEnv } from '../config/env.js';

const logInfo = (message) => {
  process.stdout.write(`${message}\n`);
};

const logError = (message) => {
  process.stderr.write(`${message}\n`);
};

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

    logInfo('MongoDB Atlas connected successfully');
    return mongoose.connection;
  } catch (error) {
    logError(`MongoDB Atlas connection error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logInfo('MongoDB disconnected');
  } catch (error) {
    logError(`Error disconnecting MongoDB: ${error.message}`);
  }
};
