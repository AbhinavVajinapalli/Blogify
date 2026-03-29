# Blog Platform - API & Architecture Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [API Endpoints](#api-endpoints)
6. [Setup & Installation](#setup--installation)
7. [Running the Application](#running-the-application)
8. [Database Schema](#database-schema)
9. [Authentication](#authentication)
10. [Error Handling](#error-handling)
11. [Security Features](#security-features)

---

## 🎯 Overview

**Blog Platform** is a full-stack React & Node.js application that enables users to:
- Create, read, update, and delete blog posts
- Write and publish content with rich formatting
- Like, comment, and interact with posts
- Follow other users and their blogs
- Authenticate with email/password or Google OAuth
- Manage their profile and blog dashboard

### Key Features
✅ **User Authentication** - Email/password + Google OAuth  
✅ **Blog Management** - CRUD operations with rich editors  
✅ **Social Features** - Likes, comments, follow system  
✅ **Search & Filter** - Find blogs by keywords and tags  
✅ **Responsive UI** - Mobile-first Tailwind CSS design  
✅ **Security** - JWT tokens, CORS, input validation, HTTPS-ready  

---

## 🏗️ Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18)                       │
│                    Port 3001 - Development                       │
├─────────────────────────────────────────────────────────────────┤
│  Components Layer    │  Pages Layer    │  Redux State Management  │
│  - BlogCard          │  - HomePage    │  - authSlice            │
│  - BlogForm          │  - FeedPage    │  - blogsSlice           │
│  - Navbar            │  - Dashboard   │  - Action Creators      │
│  - Comments          │  - Profile     │  - Selectors            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express)                         │
│                    Port 5000 - Development                       │
├─────────────────────────────────────────────────────────────────┤
│  Routes          │  Controllers      │  Middleware              │
│  - /api/auth     │  - authController │  - Auth (JWT)           │
│  - /api/blogs    │  - blogController │  - CORS                 │
│  - /api/profile  │  - profileCtrl    │  - Validation           │
│  - /api/comments │  - commentCtrl    │  - Error Handler        │
├─────────────────────────────────────────────────────────────────┤
│              Services & Utilities Layer                          │
│  - blogService     │  - userService  │  - jwtUtils             │
│  - authService     │  - commentSvc   │  - validators           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas (Cloud)                          │
│                   Database Collections                           │
├─────────────────────────────────────────────────────────────────┤
│  Collections:  users  │  blogs  │  comments  │  followers       │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action (Frontend)
         │
         ▼
  React Component
         │
    useDispatch()
         │
         ▼
   Redux Action
         │
         ▼
   API Service (Axios)
         │
         ▼
   HTTP Request to Backend
         │
         ▼
Express Route Handler
         │
         ▼
Controller Logic
         │
         ▼
Mongoose Model
         │
         ▼
MongoDB Database
         │
         ▼
Response (JSON)
         │
         ▼
Redux Reducer
         │
         ▼
State Update
         │
         ▼
Re-render Component
```

---

## 💻 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Library |
| React Router | 6.16.0 | Client-side routing |
| Redux Toolkit | 1.9.7 | State management |
| React Redux | 8.1.3 | Redux bindings |
| Axios | 1.14.0 | HTTP client |
| Tailwind CSS | 4.2.2 | CSS utility framework |
| @react-oauth/google | 0.13.4 | Google OAuth integration |
| prop-types | 15.8.1 | PropTypes validation |
| web-vitals | 3.4.0 | Performance metrics |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 4.18.2 | Web framework |
| Mongoose | 8.0.0 | MongoDB ODM |
| jsonwebtoken | Latest | JWT authentication |
| bcryptjs | Latest | Password hashing |
| express-validator | Latest | Input validation |
| cors | Latest | Cross-Origin Requests |
| dotenv | Latest | Environment variables |
| axios | Latest | HTTP requests |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 8.56.0 | Code linting |
| Prettier | Latest | Code formatting |
| PostCSS | 8.5.8 | CSS transformations |
| Autoprefixer | 10.4.27 | CSS vendor prefixes |
| Sass | 1.68.0 | SCSS compilation |
| Nodemon | 3.0.1 | Dev server auto-reload |

---

## 📁 Project Structure

```
Blog WebApp/
├── frontend/                          # React Application
│   ├── public/
│   │   ├── index.html                # Main HTML file
│   │   └── favicon.ico
│   ├── src/
│   │   ├── App.jsx                   # Root component
│   │   ├── index.js                  # Entry point
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.jsx          # Landing page
│   │   │   ├── LoginPage.jsx         # Authentication
│   │   │   ├── SignupPage.jsx        # User registration
│   │   │   ├── FeedPage.jsx          # Blog feed
│   │   │   ├── BlogDetailsPage.jsx   # Single blog view
│   │   │   ├── EditorPage.jsx        # Blog editor
│   │   │   ├── ProfilePage.jsx       # User profile
│   │   │   ├── DashboardCreatePage   # Post creation
│   │   │   └── Dashboard*/           # Dashboard pages
│   │   ├── components/               # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   └── Logo.jsx
│   │   │   ├── blog/
│   │   │   │   ├── BlogCard.jsx      # Blog card component
│   │   │   │   ├── BlogForm.jsx      # Blog form
│   │   │   │   ├── SearchBar.jsx     # Search functionality
│   │   │   │   └── CommentSection.jsx
│   │   │   └── layout/
│   │   │       ├── PublicSiteLayout.jsx
│   │   │       ├── DashboardLayout.jsx
│   │   │       └── AppLayout.jsx
│   │   ├── features/                 # Redux slices
│   │   │   ├── auth/
│   │   │   │   └── authSlice.js      # Auth state & actions
│   │   │   └── blogs/
│   │   │       └── blogsSlice.js     # Blogs state & actions
│   │   ├── services/                 # API services
│   │   │   ├── apiClient.js          # Axios config
│   │   │   ├── blogService.js        # Blog API calls
│   │   │   ├── authService.js        # Auth API calls
│   │   │   └── commentService.js     # Comments API calls
│   │   ├── styles/                   # CSS/SCSS files
│   │   │   ├── index.scss            # Global styles
│   │   │   ├── DashboardLayout.scss
│   │   │   ├── BlogCard.scss
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.scss
│   │   │   │   ├── LoginPage.scss
│   │   │   │   ├── BlogDetailsPage.scss
│   │   │   │   └── *.scss
│   │   │   └── Navbar.scss
│   │   └── utils/                    # Helper functions
│   │       ├── localStorage.js
│   │       └── helpers.js
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── .eslintrc.json                # ESLint config
│   ├── .env                          # Environment variables
│   └── .eslintignore                 # Files to ignore
│
├── backend/                           # Express Application
│   ├── src/
│   │   ├── server.js                 # Entry point
│   │   ├── app.js                    # Express app config
│   │   ├── config/
│   │   │   ├── env.js                # Environment config
│   │   │   └── database.js           # MongoDB connection
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.js         # /api/auth
│   │   │   ├── blogRoutes.js         # /api/blogs
│   │   │   ├── profileRoutes.js      # /api/profile
│   │   │   └── commentRoutes.js      # /api/comments
│   │   ├── controllers/              # Route handlers
│   │   │   ├── authController.js     # Auth logic
│   │   │   ├── blogController.js     # Blog CRUD
│   │   │   ├── profileController.js  # Profile management
│   │   │   └── commentController.js  # Comments logic
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js               # User schema
│   │   │   ├── Blog.js               # Blog schema
│   │   │   ├── Comment.js            # Comment schema
│   │   │   └── Follow.js             # Follow schema
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── auth.js               # JWT verification
│   │   │   ├── errorHandler.js       # Error handling
│   │   │   └── validators.js         # Input validation
│   │   ├── validators/               # Validation schemas
│   │   │   ├── authValidators.js
│   │   │   ├── blogValidators.js
│   │   │   └── commentValidators.js
│   │   ├── services/                 # Business logic
│   │   │   ├── blogService.js
│   │   │   ├── authService.js
│   │   │   └── googleAuthService.js
│   │   ├── utils/                    # Utilities
│   │   │   ├── ApiResponse.js        # Response formatter
│   │   │   ├── jwtUtils.js           # JWT helpers
│   │   │   └── validators.js         # Validation helpers
│   │   └── scripts/
│   │       └── seedDB.js             # Database seeding
│   ├── package.json
│   ├── .env                          # Config (DO NOT COMMIT)
│   ├── .env.example                  # Config template
│   ├── .eslintrc.json                # ESLint config
│   ├── .eslintignore                 # Files to ignore
│   └── .gitignore
│
├── .github/
│   └── instructions/
│       └── codacy.instructions.md    # Codacy configuration
│
├── README.md                          # Main documentation
├── API_ARCHITECTURE.md               # This file
├── SECURITY.md                       # Security guide
├── SECURITY_CHECKLIST.md             # Pre-deployment checklist
├── VULNERABILITY_REPORT.md           # Known vulnerabilities
├── IMPROVEMENTS.md                   # Code improvements
├── SETUP_COMPLETE.md                 # Setup summary
├── package.json                      # Root workspace config
└── .gitignore                        # Git configuration
```

---

## 🔌 API Endpoints

### Base URL
```
Development:  http://localhost:5000/api
Production:   https://api.yourdomain.com/api
```

### Authentication Endpoints
```
POST   /auth/register          Create new user account
POST   /auth/login             Login with email & password
POST   /auth/google            Google OAuth authentication
POST   /auth/verify-token      Verify JWT token
POST   /auth/refresh-token     Get new access token
POST   /auth/logout            Clear session
```

**Example: Register**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "<user-provided-password>"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Blog Endpoints
```
GET    /blogs                  Get all blogs (paginated)
GET    /blogs/search           Search blogs by keyword
GET    /blogs/:id              Get single blog
POST   /blogs                  Create new blog
PUT    /blogs/:id              Update blog
DELETE /blogs/:id              Delete blog
POST   /blogs/:id/like         Toggle like on blog
GET    /blogs/:id/comments     Get comments for blog
```

**Example: Create Blog**
```bash
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Getting Started with React",
  "content": "React is a JavaScript library...",
  "tags": ["react", "javascript", "webdev"],
  "imageUrl": "https://..."
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Getting Started with React",
  "author": "507f1f77bcf86cd799439010",
  "createdAt": "2024-03-29T10:30:00Z",
  "likes": [],
  "comments": []
}
```

### Comments Endpoints
```
POST   /comments/:blogId       Add comment to blog
GET    /comments/:blogId       Get all comments
PUT    /comments/:id           Edit comment
DELETE /comments/:id           Delete comment
```

### Profile Endpoints
```
GET    /profile                Get logged-in user profile
GET    /profile/:userId        Get other user's profile
PUT    /profile                Update profile
POST   /profile/follow/:userId Follow user
DELETE /profile/follow/:userId Unfollow user
GET    /profile/:userId/blogs  Get user's blogs
```

### User Endpoints
```
GET    /users/search           Search users
GET    /users/:id              Get user info
PUT    /users/:id              Update user
DELETE /users/:id              Delete user account
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** ≥ 16.x
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Google OAuth** credentials (optional)
- **Git**

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/blog-platform.git
cd Blog\ WebApp
```

### Step 2: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd ../backend
npm install
```

### Step 3: Configure Environment Variables

**Frontend (.env)**
```bash
cd frontend
cp .env.example .env
# Edit .env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Backend (.env)**
```bash
cd ../backend
cp .env.example .env
# Edit .env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-db
JWT_SECRET=your_super_secure_random_secret_key_minimum_32_characters_long
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## ▶️ Running the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3001
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

### Option 2: Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
# Creates 'build' folder with optimized React app
```

**Start Backend (Production):**
```bash
cd backend
npm start
# Backend serves frontend static files
```

### Option 3: Using Docker (Future)
```bash
docker-compose up
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Blogs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String (rich text),
  imageUrl: String,
  author: ObjectId (ref: User),
  tags: [String],
  likes: [
    {
      _id: ObjectId,
      userId: ObjectId
    }
  ],
  comments: [ObjectId] (ref: Comment),
  views: Number,
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comments Collection
```javascript
{
  _id: ObjectId,
  content: String,
  author: ObjectId (ref: User),
  blog: ObjectId (ref: Blog),
  likes: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Follows Collection
```javascript
{
  _id: ObjectId,
  follower: ObjectId (ref: User),
  following: ObjectId (ref: User),
  createdAt: Date
}
```

---

## 🔐 Authentication

### JWT Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend creates JWT token
   ↓
3. Token stored in localStorage (frontend)
   ↓
4. Token sent in Authorization header
   ↓
5. Backend verifies token
   ↓
6. Access granted to protected routes
```

### JWT Structure
```
Header.Payload.Signature

Header: {
  "type": "JWT",
  "algorithm": "HS256"
}

Payload: {
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "iat": 1609459200,
  "exp": 1609545600
}
```

### Request with Token
```bash
GET /api/blogs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### OAuth Integration (Google)
```
1. Frontend calls Google Login
2. Google returns auth code
3. Frontend sends code to backend
4. Backend exchanges code for tokens
5. Backend creates JWT for app
6. User logged in
```

---

## ⚠️ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  },
  "statusCode": 400
}
```

### Common HTTP Status Codes
| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

### Example Error Response
```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404,
  "error": {
    "code": "USER_NOT_FOUND",
    "details": "No user found with ID: 507f1f77bcf86cd799439011"
  }
}
```

---

## 🔒 Security Features

### Implemented
✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcryptjs for password security  
✅ **CORS Protection** - Restrict cross-origin requests  
✅ **Input Validation** - Prevent injection attacks  
✅ **Rate Limiting** - Prevent brute force attacks  
✅ **Environment Variables** - Secure config management  
✅ **HTTPS Ready** - Production deployment support  
✅ **SQL/NoSQL Injection Protection** - Input sanitization  
✅ **XSS Protection** - Content escaping  
✅ **CSRF Protection** - Token validation  

### Best Practices
📋 Never commit `.env` files  
📋 Always use HTTPS in production  
📋 Rotate JWT secrets regularly  
📋 Implement rate limiting  
📋 Validate all user inputs  
📋 Use strong passwords (minimum 12 chars)  
📋 Enable CORS only for trusted domains  
📋 Keep dependencies updated  
📋 Regular security audits  
📋 Monitor error logs  

---

## 📊 Performance Optimizations

### Frontend
- Code splitting with React Router
- Lazy loading components
- Image optimization
- CSS minification
- JavaScript bundling
- Caching strategies

### Backend
- MongoDB indexes on frequently queried fields
- Connection pooling
- Response compression
- Request caching
- Query optimization
- Pagination for large datasets

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# E2E testing (future)
npm run test:e2e
```

---

## 📝 Linting & Code Quality

```bash
# Frontend linting
cd frontend
npm run lint
npm run lint:fix

# Backend linting
cd ../backend
npm run lint
npm run lint:fix

# Format code
npm run format
```

---

## 🐛 Common Issues & Solutions

### Issue: "PORT already in use"
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Issue: "MongoDB connection failed"
- Verify MONGODB_URI in .env
- Check network access in MongoDB Atlas
- Ensure IP is whitelisted

### Issue: "Google OAuth not working"
- Verify CLIENT_ID in .env
- Check authorized URIs in Google Cloud Console
- Ensure callback URL matches

### Issue: "CORS errors"
- Check CORS configuration in backend
- Verify frontend API_URL in .env
- Ensure credentials are included in requests

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Driver](https://www.mongodb.com/docs/drivers/node/)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [JWT Introduction](https://jwt.io)

---

## 📞 Support

For issues or questions:
1. Check existing issues on GitHub
2. Review this documentation
3. Contact the development team
4. Submit a bug report with details

---

**Last Updated:** March 29, 2026  
**Version:** 1.0  
**Status:** Production Ready
