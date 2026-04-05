# Blogify

Blogify is a full-stack blog platform built with the MERN stack (MongoDB, Express, React, Node.js) with optional Flutter mobile support.

It helps creators and students publish content quickly with authentication, dashboard management, engagement features, and public profile-based blog pages.

## 1. Project Description

Blogify solves a common problem for beginner and intermediate developers: building a complete publishing platform with real authentication, CRUD, user profiles, and production deployment.

It is designed to be:
- Easy to understand for students.
- Professional enough for interviews and portfolio review.
- Extendable for real production features.

## 2. Features

- Authentication with email/password and JWT.
- Google OAuth login/signup.
- Protected dashboard routes.
- Blog CRUD (create, read, update, delete).
- Likes, comments, and bookmarks.
- Author profile pages.
- Public site pages by user slug.
- Search and pagination on feeds.
- Settings page with profile editing.
- Permanent account deletion flow.

## 3. Tech Stack

### Frontend
- React 18
- Redux Toolkit
- React Router v6
- Axios
- SCSS + Tailwind utilities

### Backend
- Node.js
- Express
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

### Database
- MongoDB Atlas

### Tools and Platform
- ESLint
- Prettier
- npm scripts
- Vercel (frontend deployment)
- Render (backend deployment)

## 4. Architecture Overview

Blogify follows a clean client-server architecture:

1. React frontend handles UI and user interaction.
2. Frontend service layer calls Express REST APIs.
3. Express routes call controller logic.
4. Controllers read/write data via Mongoose models.
5. MongoDB stores users, blogs, comments, and engagement data.

Security and consistency are handled through middleware:
- JWT auth middleware for protected routes.
- Request validation middleware.
- Global error handler.
- CORS allowlist configuration.

## 5. Project Structure

```text
blog-platform/
   backend/
      src/
         controllers/
         middleware/
         models/
         routes/
         validators/
         utils/
         app.js
         server.js
      scripts/
      package.json
      .env.example

   frontend/
      src/
         components/
         pages/
         services/
         features/
         styles/
         App.jsx
         index.jsx
      public/
      package.json
      .env.example

   mobile/
      lib/
         features/
         models/
         widgets/

   docs/
      api-overview.md
      architecture.md

   README.md
   .gitignore
```

## 6. Local Setup Instructions

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas connection string

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend runs on `http://localhost:3000`.

## 7. Deployment Links

- Frontend URL: [`https://blogify-inky-pi.vercel.app/`](https://blogify-inky-pi.vercel.app/)
- Backend API URL: [[`https://blogify-k4qm.onrender.com/api`](https://blogify-k4qm.onrender.com)

## 8. API Overview

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `DELETE /api/auth/me`

### Blogs
- `POST /api/blogs`
- `GET /api/blogs`
- `GET /api/blogs/:id`
- `PATCH /api/blogs/:id`
- `DELETE /api/blogs/:id`
- `PATCH /api/blogs/:id/like`
- `PATCH /api/blogs/:id/bookmark`

### Comments
- `POST /api/blogs/:id/comments`
- `GET /api/blogs/:id/comments`
- `DELETE /api/blogs/:blogId/comments/:commentId`

### Profiles
- `GET /api/profiles/:userId`
- `GET /api/profiles/:userId/blogs`
- `GET /api/profiles/site/:siteSlug`
- `GET /api/profiles/site/:siteSlug/blogs`

Detailed endpoint notes are available in `docs/api-overview.md`.

## Mobile Application (Flutter)

In addition to the web platform, Blogify also includes a cross-platform mobile application built using Flutter.

### Features

- Google OAuth authentication (integrated with backend)
- View all blog posts (home feed)
- View detailed blog content
- Create, edit, and delete blog posts
- Like, bookmark, and comment on posts
- View user profiles and personal posts
- Persistent login using JWT

### Architecture

- Built using Flutter with GetX for state management
- REST API integration using Dio
- Shared backend with the MERN web application

### Tech Stack

- Flutter (UI framework)
- GetX (state management and routing)
- Dio (API communication)
- SharedPreferences (local storage)

### Integration

The mobile app uses the same backend APIs as the web application:

```text
https://blogify-k4qm.onrender.com
```

## 9. Screenshots

Add screenshots in this section before final submission.

- Home page screenshot
- Blog details page screenshot
- Dashboard screenshot

Example placeholders:

```md
[Home](images/Home.png)
[Blog Details](images/Signup.png)
[Dashboard](images/Dashboard.png)
```

## 10. AI Usage and Disclosure

This project used GitHub Copilot for assistance in:
- Refactoring repetitive code.
- Writing and improving documentation.
- Improving styling and accessibility fixes.
- Suggesting API and structure cleanup.

All AI-generated or AI-assisted outputs were reviewed, edited, and validated manually before commit.

## 10.1 Prompting Techniques Used

The following prompting techniques were used while developing Blogify with AI tools:

- Role-based prompting:
   - Asked the AI to behave as a senior full-stack engineer for architecture, validation, and production-safe changes.
- Constraint-based prompting:
   - Gave strict constraints such as "do not break existing routes", "preserve current APIs", and "only commit required files".
- Task decomposition:
   - Broke large tasks into smaller prompts (for example: fix errors first, then redesign UI, then validate, then commit).
- Iterative refinement:
   - Used follow-up prompts to refine outputs (UI adjustments, deletion flow behavior, and deployment fixes).
- Verification-first prompting:
   - Explicitly requested lint/build/error checks after code changes before commit/push.

These techniques improved reliability, reduced regressions, and made AI assistance easier to audit.

## 10.2 How AI Tools Were Leveraged

AI tools (primarily GitHub Copilot) were used for:

- Code generation and refactoring:
   - Reusable component cleanup, route/controller alignment, and middleware improvements.
- Debugging support:
   - Faster identification of lint/diagnostic issues and structured fixes.
- UI/UX iteration:
   - Homepage redesign, dashboard styling improvements, and accessibility-oriented updates.
- Documentation quality:
   - README restructuring, API summaries, architecture notes, and setup clarity.
- Release workflow support:
   - Guided commit scoping, selective staging, and deployment configuration checks.

Manual review was always applied before accepting AI outputs.

## 10.3 Challenges Faced and How They Were Resolved

- Challenge: CORS and auth failures after deployment.
   - Resolution: Normalized origin matching in backend CORS checks and validated environment values.
- Challenge: Frontend style/compiler breakages with SCSS and utility usage.
   - Resolution: Reworked unsupported patterns, simplified SCSS where needed, and revalidated builds.
- Challenge: Quality tooling variability on local environment.
   - Resolution: Installed/used Codacy CLI and complemented with local lint/build/diagnostic checks.
- Challenge: Keeping commits clean while many files changed.
   - Resolution: Used selective staging and focused commits for requested features.
- Challenge: Safe permanent account deletion.
   - Resolution: Added explicit confirmation modal and ensured server-side cascade cleanup of user-related data.

## 11. Future Improvements

- Complete Flutter mobile app in the `mobile/` folder.
- Rich text editor with markdown support.
- Notification system for likes/comments.
- Drafts, scheduled publishing, and autosave.
- Role-based moderation/admin tools.
- Image upload to cloud storage.

## Professional Notes for Evaluators

- Repository is organized for clear backend/frontend separation.
- API and architecture docs are available in `docs/`.
- Environment templates are provided for easy setup.
- Build artifacts and dependencies are excluded via `.gitignore`.

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
