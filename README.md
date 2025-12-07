# BrainCache

BrainCache is a personal "second brain" for the web. Instead of DM-ing yourself links on WhatsApp whenever you find a useful article, tweet, YouTube video, or resource, BrainCache gives you a dedicated place to save and revisit everything.

You can log in, add content with a title/link/description, browse it later in a dashboard, and share individual items via public links. In the future, a search feature will let you quickly find items you saved long ago.

---

## Features

- Save any useful URL (articles, tweets, videos, docs, etc.) with a title and optional description
- Authenticated dashboard showing all of your saved items
- Public share links for individual items (read-only views)
- Cookie + JWT–based authentication
- Planned: full-text search over saved content so you can retrieve old links by keywords

---

## Screenshots

- Landing page
  - `![Landing page](./screenshots/landing.png)`
- Login / Signup
  - `![Auth screens](./screenshots/auth.png)`
- Dashboard with saved links
  - `![Dashboard](./screenshots/dashboard.png)`
- Public share view
  - `![Share page](./screenshots/share-page.png)`

---

## Architecture overview

BrainCache is a full-stack TypeScript app:

- **Backend** – Node.js + Express + TypeScript + MongoDB (under `backend/`)
- **Frontend** – React + TypeScript + Vite (under `frontend/`)

### Backend (API server)

- Entry point: `backend/src/index.ts`
  - Loads environment variables from `backend/env` using `dotenv`
  - Connects to MongoDB via `backend/src/db/index.ts`
  - Boots the Express app from `backend/src/app.ts`
- App wiring: `backend/src/app.ts`
  - Configures CORS and JSON body parsing
  - Attaches cookie parsing
  - Mounts routers:
    - `/api/v1/auth` → auth routes
    - `/api/v1/content` → content CRUD + sharing
- Models (Mongoose):
  - `User` – auth users, hashed passwords, JWT helpers
  - `Content` – saved items (title, link, description, owner, share flags)
  - `Share` – mapping from `Content` to share IDs/URLs
- Controllers:
  - `user.controller.ts` – signup, login, logout, token management
  - `content.controller.ts` – add/update/delete/list content, generate/clear share links, resolve content by share ID
- Middleware:
  - `auth.middleware.ts` – verifies JWT access tokens (cookie or `Authorization` header) and populates `req.user`

### Frontend (SPA)

- Entry point: `frontend/src/main.tsx`
  - Wraps the app in `AuthProvider` (auth context)
  - Renders the router (`App.tsx`) and global toast notifications
- Routing: `frontend/src/App.tsx`
  - `/login`, `/signup` – auth pages; redirect to `/dashboard` if already logged in
  - `/dashboard` – main authenticated dashboard (protected by `PrivateRoute`)
  - `/share/content/:shareId` – public read-only view for a shared item
  - `/*` – default route that sends unauthenticated users to login, and authenticated users to `/dashboard`
- State & auth: `frontend/src/context/AuthContext.tsx`
  - Stores the current user in React state and `localStorage`
  - Exposes a `useAuth()` hook used throughout the app
- API layer: `frontend/src/services/http.ts`
  - Shared Axios instance with `baseURL` pointing at the deployed backend API
  - Sends cookies (`withCredentials: true`) and attaches `Authorization: Bearer <token>` from `localStorage`
- UI pages & components:
  - `pages/Dashboard.tsx` – fetches and renders saved content, wires up share/unshare/delete and the "Add Content" modal
  - `pages/Login.tsx` & `pages/Signup.tsx` – handle auth flows against the backend
  - `pages/ShareContent.tsx` – loads a shared item using its share ID and renders a public view
  - `pages/LandingPage.tsx` – marketing/landing experience using `Navbar` + `Hero`

---

## Getting started

### Prerequisites

- Node.js and npm
- MongoDB instance (local or hosted)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd BrainCache
```

### 2. Configure the backend environment

In `backend/`, create a file named `env` (no leading dot). At minimum, define:

```bash
MONGODB_URI=
DB_NAME=

ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=

CORS_ORIGIN=
PORT=8000
```

> Adjust values for your environment. For local development with the frontend at `http://localhost:5173`, you may want to include that origin in CORS or change `CORS_ORIGIN` and the CORS setup in `backend/src/app.ts`.

### 3. Install dependencies

From the repo root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 4. Run the backend

From `backend/`:

```bash
npm run dev
```

This compiles the TypeScript and starts the API server on `PORT` from your `env` file (default `8000`).

### 5. Run the frontend

From `frontend/`:

```bash
npm run dev
```

By default Vite serves the app at `http://localhost:5173`.

Make sure the frontend is configured to talk to your backend URL in `frontend/src/services/http.ts`.

---

## Development scripts

### Backend

From `backend/`:

- `npm run dev` – build TypeScript and start the server
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run the compiled server from `dist/index.js`

### Frontend

From `frontend/`:

- `npm run dev` – start Vite dev server
- `npm run build` – type-check + production build
- `npm run lint` – run ESLint
- `npm run preview` – preview the production build

---

## Roadmap

Planned improvements include:

- Search across saved content by title, description, or link so you can quickly find items saved long ago
- Additional quality-of-life features around organizing and filtering saved items

