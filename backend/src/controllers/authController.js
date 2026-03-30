import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { getEnv } from '../config/env.js';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import { ApiError } from '../utils/ApiError.js';
import { successResponse } from '../utils/ApiResponse.js';

const GOOGLE_CLIENT_ID =
  getEnv('GOOGLE_CLIENT_ID') ||
  '611469724829-1bsfbegjfvv7rm18u61fcjeprip5gdgv.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, getEnv('JWT_SECRET'), {
    expiresIn: getEnv('JWT_EXPIRES_IN') || '7d',
  });
};

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '');

const buildUniqueSiteSlug = async (baseInput, excludeUserId = null) => {
  const baseSlug = slugify(baseInput) || 'blog';
  let candidate = baseSlug;
  let counter = 1;

  // Keep searching until the slug is available.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await User.findOne({ siteSlug: candidate });
    if (!existing || String(existing._id) === String(excludeUserId)) {
      return candidate;
    }
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
};

const ensureSiteIdentity = async (user) => {
  let changed = false;

  if (!user.siteName) {
    user.siteName = `${user.name}'s Blog`;
    changed = true;
  }

  if (!user.siteSlug) {
    user.siteSlug = await buildUniqueSiteSlug(user.name, user._id);
    changed = true;
  }

  if (changed) {
    await user.save();
  }

  return user;
};

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  profilePicture: user.profilePicture,
  siteName: user.siteName,
  siteSlug: user.siteSlug,
});

const buildRandomPassword = () => {
  // Used for Google-created accounts where no local password is provided.
  return `${crypto.randomBytes(10).toString('hex')}Aa!1`;
};

// Signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const siteSlug = await buildUniqueSiteSlug(name);
    const siteName = `${name}'s Blog`;

    // Create new user
    const user = await User.create({ name, email, password, siteName, siteSlug });

    // Generate token
    const token = generateToken(user._id);

    // Return response
    return successResponse(res, 201, {
      user: toPublicUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    // Find user and select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    await ensureSiteIdentity(user);

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 200, {
      user: toPublicUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      throw new ApiError(400, 'Google credential is required');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.name || !payload?.sub) {
      throw new ApiError(400, 'Invalid Google account data');
    }

    let user = await User.findOne({ email: payload.email });

    if (user) {
      let changed = false;
      if (!user.googleId) {
        user.googleId = payload.sub;
        changed = true;
      }
      if (!user.profilePicture && payload.picture) {
        user.profilePicture = payload.picture;
        changed = true;
      }
      await ensureSiteIdentity(user);
      if (changed) {
        await user.save();
      }
    } else {
      const siteSlug = await buildUniqueSiteSlug(payload.name);
      const siteName = `${payload.name}'s Blog`;
      user = await User.create({
        name: payload.name,
        email: payload.email,
        password: buildRandomPassword(),
        profilePicture: payload.picture || null,
        googleId: payload.sub,
        siteName,
        siteSlug,
      });
    }

    const token = generateToken(user._id);

    return successResponse(res, 200, {
      user: toPublicUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await ensureSiteIdentity(user);

    return successResponse(res, 200, {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      siteName: user.siteName,
      siteSlug: user.siteSlug,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, profilePicture, siteName, siteSlug } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (name !== undefined) {
      user.name = name;
    }
    if (bio !== undefined) {
      user.bio = bio;
    }
    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }
    if (siteName !== undefined) {
      user.siteName = siteName?.trim() || `${user.name}'s Blog`;
    }
    if (siteSlug !== undefined) {
      user.siteSlug = await buildUniqueSiteSlug(siteSlug, user._id);
    }

    await ensureSiteIdentity(user);
    await user.save();

    return successResponse(res, 200, {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      siteName: user.siteName,
      siteSlug: user.siteSlug,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const authoredBlogs = await Blog.find({ author: userId }).select('_id');
    const authoredBlogIds = authoredBlogs.map((blog) => blog._id);

    if (authoredBlogIds.length > 0) {
      await Comment.deleteMany({ blog: { $in: authoredBlogIds } });
      await Blog.deleteMany({ author: userId });
    }

    await Comment.deleteMany({ author: userId });

    await Blog.updateMany(
      {},
      {
        $pull: {
          likes: userId,
          bookmarks: userId,
        },
      }
    );

    await user.deleteOne();

    return successResponse(res, 200, null, 'Account deleted permanently');
  } catch (error) {
    next(error);
  }
};
