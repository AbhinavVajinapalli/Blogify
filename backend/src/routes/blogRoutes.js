import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  toggleBookmark,
  addComment,
  getComments,
  deleteComment,
} from '../controllers/blogController.js';
import { validateBlog, validateBlogQuery, validateComment, handleValidationErrors } from '../validators/blogValidators.js';

const router = express.Router();

// Blog CRUD
router.post('/', verifyToken, validateBlog, handleValidationErrors, createBlog);
router.get('/', validateBlogQuery, handleValidationErrors, getBlogs);
router.get('/:id', getBlog);
router.patch('/:id', verifyToken, validateBlog, handleValidationErrors, updateBlog);
router.delete('/:id', verifyToken, deleteBlog);

// Likes and Bookmarks
router.patch('/:id/like', verifyToken, toggleLike);
router.patch('/:id/bookmark', verifyToken, toggleBookmark);

// Comments
router.post('/:id/comments', verifyToken, validateComment, handleValidationErrors, addComment);
router.get('/:id/comments', getComments);
router.delete('/:blogId/comments/:commentId', verifyToken, deleteComment);

export default router;
