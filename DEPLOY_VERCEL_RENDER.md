# Deploy Blogify

This project is configured for:
- Frontend on Vercel (from `frontend/`)
- Backend on Render (from `backend/`)

## 1) Deploy Backend to Render

1. Go to Render dashboard and create a new **Web Service** from this GitHub repo.
2. Render will detect `render.yaml` at repo root.
3. Set required environment variables in Render:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CORS_ORIGIN` (set this to your Vercel frontend URL)
   - `GOOGLE_CLIENT_ID` (if using Google auth)
4. Deploy and copy the backend URL, e.g. `https://your-backend.onrender.com`.

Health check endpoint:
- `https://your-backend.onrender.com/api/health`

## 2) Deploy Frontend to Vercel

1. Go to Vercel and import this repository.
2. Set **Root Directory** to `frontend`.
3. Add environment variables in Vercel project settings:
   - `REACT_APP_API_BASE_URL` = `https://your-backend.onrender.com/api`
   - `REACT_APP_GOOGLE_CLIENT_ID` = your Google client ID (if used)
4. Deploy.

`frontend/vercel.json` already includes SPA rewrite to `index.html`.

## 3) Final CORS Check

After frontend deploy, update Render `CORS_ORIGIN` to your exact Vercel domain, for example:
- `https://blogify.vercel.app`

If you use preview deployments too, add comma-separated origins.

## 4) Redeploy Order

1. Deploy backend on Render
2. Set frontend env on Vercel and deploy
3. Update backend `CORS_ORIGIN` with Vercel URL and redeploy backend
