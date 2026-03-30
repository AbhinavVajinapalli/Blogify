# Architecture

## High-Level Design
Blogify is a full-stack platform with a React frontend, an Express API backend, and MongoDB for persistence.

- Frontend (React + Redux): Handles UI, routing, state, and API calls.
- Backend (Node.js + Express): Handles authentication, validation, business logic, and data access.
- Database (MongoDB + Mongoose): Stores users, blogs, and comments.

## Request Flow
1. User action in React page/component.
2. Service layer calls backend endpoint via Axios.
3. Express route applies middleware:
- JWT auth for protected endpoints.
- Request validation.
4. Controller executes business logic.
5. Mongoose reads/writes MongoDB.
6. Standardized JSON response is returned.

## Backend Layers
- `routes/` for endpoint mapping.
- `controllers/` for business logic.
- `models/` for MongoDB schemas.
- `middleware/` for auth/error/validation flow.
- `utils/` and `validators/` for shared logic.

## Frontend Layers
- `pages/` for route-level screens.
- `components/` for reusable UI blocks.
- `services/` for API communication.
- `features/` for Redux slices and state actions.
- `styles/` for global and page/component SCSS.

## Deployment Topology
- Frontend deployed on Vercel.
- Backend deployed on Render.
- MongoDB Atlas as managed cloud database.

## Security Notes
- Passwords are hashed in backend model hooks.
- JWT is used for session-based authorization.
- CORS is allowlisted with configurable origins.
- Server-side validation is applied before controller logic.
