import express from 'express';
import { getUserProfile, getUserBlogs } from '../controllers/profileController.js';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.get('/:userId/blogs', getUserBlogs);

export default router;
