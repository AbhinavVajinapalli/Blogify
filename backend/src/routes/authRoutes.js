import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  signup,
  login,
  getCurrentUser,
  updateProfile,
} from '../controllers/authController.js';
import { validateAuth, handleValidationErrors } from '../validators/blogValidators.js';

const router = express.Router();

router.post('/signup', validateAuth, handleValidationErrors, signup);
router.post('/login', validateAuth, handleValidationErrors, login);
router.get('/me', verifyToken, getCurrentUser);
router.patch('/me', verifyToken, updateProfile);

export default router;
