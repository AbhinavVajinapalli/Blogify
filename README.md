# BlogHub - Full-Stack Blog Platform

A production-ready full-stack blog platform built with React, Redux Toolkit, Node.js/Express, MongoDB, and JWT authentication. Features include blog CRUD operations, user authentication, profiles, search, pagination, and interactive likes/bookmarks/comments.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Architecture Overview](#architecture-overview)
- [Deployment](#deployment)
- [AI Usage & Disclosure](#ai-usage--disclosure)
- [Git Commit Strategy](#git-commit-strategy)

## Features

### Mandatory ✅
- **User Authentication**: Secure signup/login with JWT tokens
- **Protected Routes**: Authenticated users only for write operations
- **Blog CRUD**: Create, read, update, delete blog posts
- **Author Profiles**: User profile with bio and authored blogs list
- **Responsive Design**: Mobile-friendly SCSS styling

### Bonus Features ✅
- **Search**: Search blogs by title and tags (text-indexed queries)
- **Pagination**: Efficient pagination for feeds and profiles
- **Likes/Bookmarks**: Interactive like and bookmark functionality
- **Comments System**: Full comment CRUD on blog posts
- **User Profiles**: Author bio, profile picture, published blog count

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Axios** - API client
- **SCSS** - Styling (modular components)
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Mongoose** - ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### Deployment
- **Render** - Backend + Frontend hosting
- **MongoDB Atlas** - Cloud database

## Project Structure

```
blog-platform/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js                 # Redux store config
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── authSlice.js         # Auth state slice
│   │   │   ├── blogs/
│   │   │   │   └── blogsSlice.js        # Blogs state slice
│   │   │   └── profile/
│   │   │       └── profileSlice.js      # Profile state slice
│   │   ├── services/
│   │   │   ├── apiClient.js             # Axios instance + interceptors
│   │   │   ├── authService.js           # Auth API calls
│   │   │   └── blogService.js           # Blog/Profile API calls
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── FeedPage.jsx
│   │   │   ├── BlogDetailsPage.jsx
│   │   │   ├── EditorPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── AppLayout.jsx
│   │   │   ├── common/
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── Pagination.jsx
│   │   │   └── blog/
│   │   │       ├── BlogCard.jsx
│   │   │       ├── BlogForm.jsx
│   │   │       └── SearchBar.jsx
│   │   ├── styles/
│   │   │   ├── index.scss               # Global styles
│   │   │   ├── pages/
│   │   │   └── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                    # MongoDB connection
│   │   │   └── env.js                   # Environment config
│   │   ├── models/
│   │   │   ├── User.js                  # User schema
│   │   │   ├── Blog.js                  # Blog schema
│   │   │   └── Comment.js               # Comment schema
│   │   ├── controllers/
│   │   │   ├── authController.js        # Auth logic
│   │   │   ├── blogController.js        # Blog logic
│   │   │   └── profileController.js     # Profile logic
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── blogRoutes.js
│   │   │   └── profileRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # JWT verification
│   │   │   ├── errorMiddleware.js       # Error handling
│   │   │   └── validateMiddleware.js    # Input validation
│   │   ├── validators/
│   │   │   └── blogValidators.js        # Validation rules
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── ApiResponse.js
│   │   ├── app.js                       # Express app setup
│   │   └── server.js                    # Server bootstrap
│   ├── package.json
│   └── .env.example

├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Git**

### Setup Instructions

#### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/blog-platform.git
cd blog-platform
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values (see Environment Variables below)

# Start development server
npm run dev
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env (set VITE_API_BASE_URL to your backend URL)

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000` (frontend) and `http://localhost:5000/api` (backend).

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Documentation

### Authentication

**POST /api/auth/signup**
- Register new user
- Body: `{ name, email, password }`
- Returns: `{ user, token }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`
- Returns: `{ user, token }`

**GET /api/auth/me** (Protected)
- Get current user
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

**PATCH /api/auth/me** (Protected)
- Update user profile
- Headers: `Authorization: Bearer <token>`
- Body: `{ name, bio, profilePicture }`
- Returns: `{ user }`

### Blogs

**POST /api/blogs** (Protected)
- Create new blog
- Body: `{ title, content, tags[], imageUrl }`
- Returns: `{ blog }`

**GET /api/blogs**
- Get all blogs with pagination/search
- Query: `?page=1&limit=10&search=query&tag=tag1,tag2`
- Returns: `{ blogs[], pagination }`

**GET /api/blogs/:id**
- Get single blog
- Returns: `{ blog }`

**PATCH /api/blogs/:id** (Protected)
- Update blog (owner only)
- Body: `{ title, content, tags[], imageUrl }`
- Returns: `{ blog }`

**DELETE /api/blogs/:id** (Protected)
- Delete blog (owner only)
- Returns: `{ message }`

**PATCH /api/blogs/:id/like** (Protected)
- Toggle like on blog
- Returns: `{ blog }`

**PATCH /api/blogs/:id/bookmark** (Protected)
- Toggle bookmark on blog
- Returns: `{ blog }`

### Comments

**POST /api/blogs/:id/comments** (Protected)
- Add comment to blog
- Body: `{ content }`
- Returns: `{ comment }`

**GET /api/blogs/:id/comments**
- Get blog comments
- Query: `?page=1&limit=10`
- Returns: `{ comments[], pagination }`

**DELETE /api/blogs/:blogId/comments/:commentId** (Protected)
- Delete comment (author or blog owner only)
- Returns: `{ message }`

### Profiles

**GET /api/profiles/:userId**
- Get user profile
- Returns: `{ user profile data }`

**GET /api/profiles/:userId/blogs**
- Get user's published blogs
- Query: `?page=1&limit=10`
- Returns: `{ blogs[], pagination }`

## Architecture Overview

### Frontend Architecture
- **Feature-based slicing**: Each Redux slice (auth, blogs, profile) manages independent domain state
- **Service layer**: Centralized API calls through `apiClient` with request/response interceptors
- **Component hierarchy**: Layout → Pages → Components, with reusable components like `BlogCard`, `Pagination`
- **Protected routes**: `ProtectedRoute` wrapper prevents unauthorized access to edit/create pages
- **Token persistence**: JWT stored in localStorage with auto-attach to API requests

### Backend Architecture
- **MVC pattern**: Controllers handle business logic, Models define schemas, Routes wire endpoints
- **Middleware chain**: CORS → JSON parser → Auth verification → Validation → Route handlers
- **Error handling**: Global error middleware catches and formats errors consistently
- **Database indexing**: Text index on blogs for search, compound indexes for feed queries
- **Schema validation**: Mongoose pre-save hooks for password hashing, express-validator for input checks

### Data Flow
1. **Auth**: User signup → hash password → save to DB → issue JWT
2. **Blog creation**: Authenticated request → validate input → save to DB → return populated blog
3. **Feed**: Fetch blogs with pagination → apply search/tag filters → populate author data → return paginated list
4. **Ownership check**: On update/delete, verify `req.user.userId === blog.author` before allowing operation

## Deployment

### Deploy Backend to Render

1. **Create Render Web Service**
   - Connect GitHub repo
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Select Node runtime

2. **Set Environment Variables**
   - NODE_ENV: `production`
   - PORT: `5000` (auto-assigned by Render)
   - MONGODB_URI: Your MongoDB Atlas connection string
   - JWT_SECRET: Strong random secret
   - JWT_EXPIRES_IN: `7d`
   - CORS_ORIGIN: Your frontend Render URL (e.g., `https://blog-frontend.onrender.com`)

3. **Deploy**
   - Push to main branch
   - Render auto-deploys

### Deploy Frontend to Render

1. **Create Render Static Site**
   - Connect GitHub repo
   - Set build command: `npm install && npm run build`
   - Set publish directory: `dist`

2. **Set Environment Variables**
   - VITE_API_BASE_URL: Your backend Render URL (e.g., `https://blog-backend.onrender.com/api`)

3. **Deploy**
   - Render auto-deploys on push

### Post-Deployment Checklist
- [ ] Backend health check: visit `https://backend-url/api/health`
- [ ] Test signup/login flow in production
- [ ] Create test blog post
- [ ] Verify search and pagination
- [ ] Test like/bookmark/comment features
- [ ] Check CORS errors in browser console

## AI Usage & Disclosure

### How GitHub Copilot & AI Were Used

This project was built with assistance from AI coding tools (GitHub Copilot, Claude). The following aspects benefited from AI:

1. **Boilerplate scaffolding**: Express middleware chain, Redux store configuration, component structure
2. **API contract design**: RESTful endpoint naming, validation patterns, error response format
3. **Component templates**: React hooks patterns, form handling, conditional rendering
4. **Database schema design**: Mongoose indexes for performance, relationships between collections
5. **SCSS styling**: Responsive grid layouts, flexbox patterns, utility classes
6. **Path resolution**: Vite configuration, build output paths
7. **Documentation**: README structure, API endpoint descriptions, deployment guides

### What Was Manually Implemented

- Project planning and architectural decisions (MVC for backend, feature-slicing for frontend)
- Business logic for ownership validation (edit/delete checks)
- Token lifecycle management (intercept requests, refresh on expiry)
- Error handling patterns and validation logic
- Git workflow and commit message conventions

### Transparency

- All code is production-ready but should be reviewed before deployment
- Security best practices are followed (password hashing, JWT, HTTPS in production, CORS)
- For production, consider:
  - Upgraded token storage (httpOnly cookies vs localStorage)
  - Rate limiting on auth endpoints
  - Additional input sanitization
  - Comprehensive test coverage
  - CDN for static assets

## Git Commit Strategy

### Branching Model
```
main (production) ← develop (integration) ← feature/* (feature branches)
```

### Commit Convention
```
feat(scope): description
fix(scope): description
docs(scope): description
chore(scope): description
```

### Examples
```
feat(auth): add JWT token refresh endpoint
feat(blogs): implement pagination on feed
feat(search): add text-search index and query parameters
fix(auth): handle token expiry in interceptor
fix(validation): prevent empty blog title submission
docs(readme): add deployment instructions
chore(deps): update express to 4.18.2
```

### PR Checklist
- [ ] Branch created from `develop`
- [ ] Code follows project structure
- [ ] Environment variables documented in .env.example
- [ ] API contract unchanged or documented
- [ ] Manual testing completed
- [ ] No hardcoded secrets
- [ ] Commit messages follow convention

## Troubleshooting

### "CORS error" on frontend requests
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Ensure backend is running and accessible

### "MongoDB connection error"
- Verify MONGODB_URI is correct
- Check IP address is whitelisted in MongoDB Atlas
- Test connection string locally first

### "Token expired" after login
- Check `JWT_EXPIRES_IN` is reasonable (e.g., "7d")
- Verify JWT secret is consistent between frontend and backend

### "Blog form not submitting"
- Check browser console for validation errors
- Ensure title is at least 5 characters, content at least 20
- Verify image URL is valid format

## Future Enhancements

- [ ] Advanced rich-text editor (Quill/TipTap)
- [ ] File upload (Cloudinary/AWS S3)
- [ ] Email notifications on comments
- [ ] Role-based access (admin, moderator)
- [ ] Analytics dashboard
- [ ] Dark mode
- [ ] Real-time notifications (WebSocket)
- [ ] API rate limiting
- [ ] Automated test suite (Jest, Supertest)

## License

MIT License - Feel free to use this project as a starting point for your own blog platform.

---

**Build with ❤️ using React, Node.js, and MongoDB**
