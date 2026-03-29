import express from 'express';
import {
	getUserProfile,
	getUserBlogs,
	getSiteProfileBySlug,
	getSiteBlogsBySlug,
} from '../controllers/profileController.js';

const router = express.Router();

router.get('/site/:siteSlug', getSiteProfileBySlug);
router.get('/site/:siteSlug/blogs', getSiteBlogsBySlug);
router.get('/:userId', getUserProfile);
router.get('/:userId/blogs', getUserBlogs);

export default router;
