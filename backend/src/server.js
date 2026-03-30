import app from './app.js';
import { connectDB } from './db/atlas.js';
import { getEnv } from './config/env.js';

const logInfo = (message) => {
  process.stdout.write(`${message}\n`);
};

const logError = (message) => {
  process.stderr.write(`${message}\n`);
};

const PORT = getEnv('PORT') || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logInfo('✓ Database connected');

    // Start Express server
    app.listen(PORT, () => {
      logInfo(`✓ Server running on port ${PORT}`);
      logInfo(`✓ Environment: ${getEnv('NODE_ENV')}`);
    });
  } catch (error) {
    logError(`✗ Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
