import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  signup,
  login,
  loginWithGoogle,
  getCurrentUser,
  updateProfile,
} from '../controllers/authController.js';
import {
  validateSignup,
  validateLogin,
  validateGoogleAuth,
  handleValidationErrors,
} from '../validators/blogValidators.js';

const router = express.Router();

router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/google', validateGoogleAuth, handleValidationErrors, loginWithGoogle);
router.get('/me', verifyToken, getCurrentUser);
router.patch('/me', verifyToken, updateProfile);

export default router;
