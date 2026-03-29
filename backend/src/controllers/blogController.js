import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import { ApiError } from '../utils/ApiError.js';
import { successResponse } from '../utils/ApiResponse.js';

// Create blog
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, tags, imageUrl } = req.body;

    const blog = await Blog.create({
      title,
      content,
      tags: tags || [],
      imageUrl,
      author: req.user.userId,
    });

    const populatedBlog = await blog.populate('author', 'name email profilePicture siteName siteSlug');

    return successResponse(res, 201, populatedBlog);
  } catch (error) {
    next(error);
  }
};

// Get all blogs (feed) with pagination and search
export const getBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', tag = '' } = req.query;

    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (tag) {
      filter.tags = { $in: tag.split(',').map((t) => t.trim()) };
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .populate('author', 'name email profilePicture bio siteName siteSlug')
      .populate('likes', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);

    return successResponse(res, 200, {
      blogs,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('author', 'name email profilePicture bio siteName siteSlug')
      .populate('likes', 'name email')
      .populate('bookmarks', 'name email');

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    return successResponse(res, 200, blog);
  } catch (error) {
    next(error);
  }
};

// Update blog (owner only)
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    if (blog.author.toString() !== req.user.userId) {
      throw new ApiError(403, 'Not authorized to update this blog');
    }

    const { title, content, tags, imageUrl } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.imageUrl = imageUrl || blog.imageUrl;

    await blog.save();
    const updatedBlog = await blog.populate('author', 'name email profilePicture siteName siteSlug');

    return successResponse(res, 200, updatedBlog, 'Blog updated successfully');
  } catch (error) {
    next(error);
  }
};

// Delete blog (owner only)
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    if (blog.author.toString() !== req.user.userId) {
      throw new ApiError(403, 'Not authorized to delete this blog');
    }

    // Also delete associated comments
    await Comment.deleteMany({ blog: blog._id });

    await blog.deleteOne();

    return successResponse(res, 200, null, 'Blog deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Like/Unlike blog
export const toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    const userId = req.user.userId;
    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    const updatedBlog = await blog.populate('author', 'name email profilePicture siteName siteSlug');

    return successResponse(res, 200, updatedBlog);
  } catch (error) {
    next(error);
  }
};

// Bookmark/Unbookmark blog
export const toggleBookmark = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    const userId = req.user.userId;
    const bookmarkIndex = blog.bookmarks.indexOf(userId);

    if (bookmarkIndex > -1) {
      blog.bookmarks.splice(bookmarkIndex, 1);
    } else {
      blog.bookmarks.push(userId);
    }

    await blog.save();
    const updatedBlog = await blog.populate('author', 'name email profilePicture siteName siteSlug');

    return successResponse(res, 200, updatedBlog);
  } catch (error) {
    next(error);
  }
};

// Add comment
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    const comment = await Comment.create({
      content,
      author: req.user.userId,
      blog: req.params.id,
    });

    const populatedComment = await comment.populate('author', 'name email profilePicture siteName siteSlug');

    return successResponse(res, 201, populatedComment, 'Comment added successfully');
  } catch (error) {
    next(error);
  }
};

// Get comments for blog
export const getComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ blog: req.params.id })
      .populate('author', 'name email profilePicture siteName siteSlug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({ blog: req.params.id });

    return successResponse(res, 200, {
      comments,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment (owner or blog author)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    const blog = await Blog.findById(comment.blog);
    const isCommentAuthor = comment.author.toString() === req.user.userId;
    const isBlogAuthor = blog.author.toString() === req.user.userId;

    if (!isCommentAuthor && !isBlogAuthor) {
      throw new ApiError(403, 'Not authorized to delete this comment');
    }

    await comment.deleteOne();

    return successResponse(res, 200, null, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
};
