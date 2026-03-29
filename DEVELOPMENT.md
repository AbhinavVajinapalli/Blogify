# Blog Platform Development Notes

## Setup Overview
- Monorepo structure with separate `/backend` and `/frontend` directories
- Backend: Express + MongoDB + JWT
- Frontend: React + Redux Toolkit + SCSS + Vite
- All environments configured for local development and Render deployment

## Day 1 Completion
- ✅ Database schema design (User, Blog, Comment with proper indexes)
- ✅ Express app scaffold with middleware chain
- ✅ Auth endpoints: signup, login, me, profile update
- ✅ Blog CRUD endpoints with ownership validation
- ✅ Comment system on blogs
- ✅ Global error handling and validation middleware
- ✅ Environment configuration

## Day 2 Completion
- ✅ Redux Toolkit store with auth/blogs/profile slices
- ✅ API service layer with axios interceptors
- ✅ Page components: Login, Signup, Feed, BlogDetails, Editor, Profile
- ✅ Reusable components: BlogCard, BlogForm, SearchBar, Pagination, Navbar
- ✅ SCSS module styling for all pages and components
- ✅ Protected routes for authenticated content

## Day 3 Tasks
- [ ] Install dependencies (backend npm install, frontend npm install)
- [ ] Test backend locally: npm run dev
- [ ] Test frontend locally: npm run dev
- [ ] Seed test data: npm run seed
- [ ] Manual integration testing: signup → create blog → edit → search → profile → like/comment
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Render
- [ ] Run smoke tests in production

## Database Setup
```bash
cd backend
npm run seed
```
This creates 3 test users and 5 sample blogs with comments.

## Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with MongoDB URI
npm install
npm run dev
# Runs on port 5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# Runs on port 3000
```

## Testing Checklist

### Auth Flow
- [ ] Signup with valid email/password
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Protected routes redirect to login
- [ ] Token persists on page refresh

### Blog CRUD
- [ ] Create blog with title/content/tags
- [ ] Blog appears in feed
- [ ] View single blog details
- [ ] Edit own blog (button shows for author)
- [ ] Delete own blog (confirmation dialog)
- [ ] Cannot edit/delete other user's blog

### Search & Pagination
- [ ] Search by blog title
- [ ] Filter by tags
- [ ] Pagination controls work
- [ ] Feed loads first page on mount

### Interactions
- [ ] Like blog toggles
- [ ] Bookmark blog toggles
- [ ] Add comment shows below blog
- [ ] Comment appears immediately after posting

### Profiles
- [ ] Profile page shows user bio
- [ ] Lists authored blogs with pagination
- [ ] Navigate to profile from blog author link

## Key API Endpoints to Test

```
POST   /api/auth/signup          - Register
POST   /api/auth/login           - Login
GET    /api/auth/me              - Get current user
PATCH  /api/auth/me              - Update profile

POST   /api/blogs                - Create blog
GET    /api/blogs                - Get feed with search/pagination
GET    /api/blogs/:id            - Get blog details
PATCH  /api/blogs/:id            - Update blog
DELETE /api/blogs/:id            - Delete blog
PATCH  /api/blogs/:id/like       - Toggle like
PATCH  /api/blogs/:id/bookmark   - Toggle bookmark

POST   /api/blogs/:id/comments   - Add comment
GET    /api/blogs/:id/comments   - Get comments
DELETE /api/blogs/:blogId/comments/:commentId - Delete comment

GET    /api/profiles/:userId     - Get user profile
GET    /api/profiles/:userId/blogs - Get user's blogs
```

## Common Issues & Solutions

**CORS Error**: Check CORS_ORIGIN env var matches frontend URL
**MongoDB Connection Failed**: Verify MONGODB_URI and IP whitelist in Atlas
**Token Invalid**: Ensure JWT_SECRET is consistent between signup/login requests
**Blog Form Validation**: Title min 5 chars, content min 20 chars
**Search Not Working**: Ensure MongoDB text index is created on blogs collection

## Production Deployment

### Backend (Render)
1. Create Web Service
2. Connect GitHub repo
3. Set build: `npm install`
4. Set start: `npm start`
5. Add envs: NODE_ENV, MONGODB_URI, JWT_SECRET, CORS_ORIGIN
6. Deploy

### Frontend (Render)
1. Create Static Site
2. Connect GitHub repo
3. Set build: `npm install && npm run build`
4. Set publish dir: `dist`
5. Add env: VITE_API_BASE_URL
6. Deploy

## Code Quality Notes
- All endpoints include validation and error handling
- Ownership checks on all mutating operations
- Indexes on frequently queried fields
- Passwords hashed with bcryptjs pre-save hook
- JWT middleware protects all write operations
- SCSS uses BEM naming and utility classes
- Redux slices follow RTK best practices
