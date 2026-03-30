# API Overview

Base URL: `/api`

## Health
- `GET /health` - API health check.

## Authentication
- `POST /auth/signup` - Register with name, email, and password.
- `POST /auth/login` - Login with email and password.
- `POST /auth/google` - Login/signup via Google OAuth token.
- `GET /auth/me` - Get current authenticated user.
- `PATCH /auth/me` - Update profile fields.
- `DELETE /auth/me` - Permanently delete current account.

## Blogs
- `POST /blogs` - Create blog post (authenticated).
- `GET /blogs` - Get feed with pagination/search/tag filters.
- `GET /blogs/:id` - Get single blog post.
- `PATCH /blogs/:id` - Update own blog post.
- `DELETE /blogs/:id` - Delete own blog post.
- `PATCH /blogs/:id/like` - Toggle like.
- `PATCH /blogs/:id/bookmark` - Toggle bookmark.

## Comments
- `POST /blogs/:id/comments` - Add comment (authenticated).
- `GET /blogs/:id/comments` - List blog comments.
- `DELETE /blogs/:blogId/comments/:commentId` - Delete own comment or as blog owner.

## Profiles and Public Sites
- `GET /profiles/:userId` - Get user profile.
- `GET /profiles/:userId/blogs` - Get blogs by user ID.
- `GET /profiles/site/:siteSlug` - Get public site profile by slug.
- `GET /profiles/site/:siteSlug/blogs` - Get blogs by site slug.

## Typical Query Params
- `page` (number)
- `limit` (number)
- `search` (string)
- `tag` (comma-separated string)

## Authentication Header
Use bearer token for protected endpoints:

`Authorization: Bearer <jwt-token>`
