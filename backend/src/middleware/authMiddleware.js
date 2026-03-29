import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'No token provided');
    }

    const decoded = jwt.verify(token, getEnv('JWT_SECRET'));
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Token verification failed: ' + error.message));
  }
};
