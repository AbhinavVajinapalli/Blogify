import User from '../models/User.js';
import Blog from '../models/Blog.js';
import { ApiError } from '../utils/ApiError.js';
import { successResponse } from '../utils/ApiResponse.js';

// Get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return successResponse(res, 200, {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's blogs
export const getUserBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ author: req.params.userId })
      .populate('author', 'name email profilePicture bio')
      .populate('likes', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments({ author: req.params.userId });

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
