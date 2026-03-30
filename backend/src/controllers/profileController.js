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
      siteName: user.siteName,
      siteSlug: user.siteSlug,
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
    const pageNumber = Number.parseInt(page, 10);
    const limitNumber = Number.parseInt(limit, 10);

    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const skip = (pageNumber - 1) * limitNumber;

    const blogs = await Blog.find({ author: req.params.userId })
      .populate('author', 'name email profilePicture bio siteName siteSlug')
      .populate('likes', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Blog.countDocuments({ author: req.params.userId });

    return successResponse(res, 200, {
      blogs,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get site profile by slug (public site identity)
export const getSiteProfileBySlug = async (req, res, next) => {
  try {
    const user = await User.findOne({ siteSlug: req.params.siteSlug });

    if (!user) {
      throw new ApiError(404, 'Site not found');
    }

    return successResponse(res, 200, {
      id: user._id,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture,
      siteName: user.siteName,
      siteSlug: user.siteSlug,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// Get site blogs by slug (public website view)
export const getSiteBlogsBySlug = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number.parseInt(page, 10);
    const limitNumber = Number.parseInt(limit, 10);

    const user = await User.findOne({ siteSlug: req.params.siteSlug });
    if (!user) {
      throw new ApiError(404, 'Site not found');
    }

    const skip = (pageNumber - 1) * limitNumber;

    const blogs = await Blog.find({ author: user._id })
      .populate('author', 'name email profilePicture bio siteName siteSlug')
      .populate('likes', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Blog.countDocuments({ author: user._id });

    return successResponse(res, 200, {
      site: {
        id: user._id,
        siteName: user.siteName,
        siteSlug: user.siteSlug,
      },
      blogs,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};
