# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

BrainCache is a full‑stack TypeScript application with:
- A backend Express API (Node + TypeScript + MongoDB) under `backend/`.
- A frontend React single‑page app (Vite + React Router + Tailwind) under `frontend/`.

## Common commands

All paths below are relative to the repo root `BrainCache/`.

### Backend (Node + Express + TypeScript)

From `backend/`:
- Install dependencies:
  - `npm install`
- Start API in development (one‑shot compile then run):
  - `npm run dev`
- Build TypeScript:
  - `npm run build`
- Start compiled server (after `npm run build`):
  - `npm start`

Notes:
- `npm run dev` currently does a full `tsc -b` build and then runs `node dist/index.js`; there is no watch/reload by default.
- The server reads environment variables from a file named `env` in `backend/` (see **Backend configuration & environment**).

### Frontend (React + Vite)

From `frontend/`:
- Install dependencies:
  - `npm install`
- Start dev server:
  - `npm run dev`
- Type‑check + build for production:
  - `npm run build`
- Lint:
  - `npm run lint`
- Preview built assets:
  - `npm run preview`

### Testing

There are currently no test scripts configured in either `backend/package.json` or `frontend/package.json`. Add test tooling and scripts there before attempting to run tests or individual test files.

## Repository layout

- `backend/` – Node/Express API, data models, auth, and business logic.
- `frontend/` – React SPA, routing, pages, and UI components.

The root `README.md` only names the project; see this file for working notes.

## Backend architecture

### Entry points and application wiring

- `backend/src/index.ts` is the process entry:
  - Loads environment variables from `./env` using `dotenv`.
  - Connects to MongoDB via `connectDB` from `backend/src/db/index.ts`.
  - Starts the Express app from `backend/src/app.ts` on `PORT` (from config) or `8000`.
- `backend/src/app.ts` constructs the Express app:
  - Configures CORS (currently hard‑coded to `https://brain-cache-dev-garg.vercel.app`) with `credentials: true`.
  - Enables JSON body parsing and `cookie-parser`.
  - Mounts routers:
    - `/api/v1/auth` → `backend/src/routes/user.routes.ts`.
    - `/api/v1/content` → `backend/src/routes/content.routes.ts`.

### Configuration, environment, and database

- `backend/src/config/config.ts` exposes configuration read from environment variables (types inferred via `env.d.ts`):
  - `MONGODB_URI`, `DB_NAME` – Mongo connection.
  - `ACCESS_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY` – access token JWT.
  - `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRY` – refresh token JWT.
  - `CORS_ORIGIN`, `PORT`.
- `backend/src/db/index.ts` connects to Mongo using `mongoose.connect("${MONGODB_URI}/${DB_NAME}")` and terminates the process on failure.
- Environment is loaded from a file named `env` in `backend/` (not `.env` by default). For local development, create `backend/env` with the variables above.

### Data model layer

All Mongoose models live in `backend/src/models/` with TypeScript interfaces in `backend/src/utils/interfaces.ts`:

- `user.model.ts` (`User`):
  - Fields: `username`, `email`, `name`, `password`, optional `refreshToken`.
  - Pre‑save hook hashes passwords with `bcrypt` when modified.
  - Instance methods:
    - `isPasswordCorrect(password)` – bcrypt comparison.
    - `generateAccessToken()` – signs a JWT with user identity and `ACCESS_TOKEN_SECRET`.
    - `generateRefreshToken()` – signs a JWT with `REFRESH_TOKEN_SECRET`.
- `content.model.ts` (`Content`):
  - Fields: `title`, `link`, optional `description`, `userId` (ref `User`), `isShare` flag, optional `shareId`.
  - `timestamps: true` for created/updated times.
- `share.model.ts` (`Share`):
  - Maps a shared content document via `contentId` (ref `Content`) to a `shareId` string.

### Request lifecycle, controllers, and middleware

#### Common utilities

- `backend/src/utils/asyncHandler.ts` wraps async route handlers to forward errors to Express.
- `backend/src/utils/apiResponse.ts` defines a typed `ApiResponse` envelope with status, data, message, and `success` flag.

#### Authentication middleware

- `backend/src/middlewares/auth.middleware.ts`:
  - Extracts an access token from `req.cookies.accessToken` or `Authorization: Bearer <token>`.
  - Verifies it with `ACCESS_TOKEN_SECRET`.
  - Loads the corresponding `User` (excluding password and refresh token) and attaches it to `req.user`.
  - Returns `401` if the token is missing, invalid, or the user does not exist.

#### User flows (`/api/v1/auth`)

- Routes in `backend/src/routes/user.routes.ts`:
  - `POST /signup` → `registerUser`.
  - `POST /login` → `loginUser`.
  - `POST /logout` → `logoutUser` (protected by `verifyJWT`).
- `backend/src/controllers/user.controller.ts`:
  - `registerUser`:
    - Validates `username`, `email`, `password`, `name`.
    - Ensures uniqueness on `email` and `username`.
    - Creates a `User`, then returns a view excluding `password` and `refreshToken` wrapped in `ApiResponse`.
  - `loginUser`:
    - Validates `email` and `password`.
    - Looks up `User` by email and verifies password via `isPasswordCorrect`.
    - Uses `generateAccessAndRefreshToken` helper to set `refreshToken` on the user and obtain both tokens.
    - Returns user data along with tokens and sets `accessToken`/`refreshToken` as HTTP‑only, `secure`, `sameSite: "none"` cookies.
  - `logoutUser`:
    - Unsets `refreshToken` for the current user and clears the auth cookies.

#### Content flows (`/api/v1/content`)

- Routes in `backend/src/routes/content.routes.ts` (most protected by `verifyJWT`):
  - `POST /add` → `addContent`.
  - `POST /delete` → `deleteContent`.
  - `GET /get` → `getContent`.
  - `PATCH /update` → `updateContent`.
  - `POST /share` → `shareContent`.
  - `POST /unshare` → `unShareContent`.
  - `POST /getSharedContent` → `getContentByShareId` (public; no auth middleware).
- `backend/src/controllers/content.controller.ts`:
  - Implements CRUD over `Content` scoped to `req.user._id`.
  - Enforces ownership on delete/update/share/unshare by comparing `req.user._id` with the `userId` in the request body.
  - Uses `ApiResponse` for successful responses and plain JSON objects for some error cases.
  - `shareContent`:
    - Generates a UUID slug and constructs a share URL of the form `https://brain-cache-dev-garg.vercel.app/share/content/<slug>`.
    - Uses a Mongoose session + transaction to update the `Content` document (`isShare: true`, `shareId`) and create a `Share` document.
  - `unShareContent`:
    - Also uses a transaction to unset `isShare`/`shareId` on `Content` and delete the corresponding `Share` document.
  - `getContentByShareId`:
    - Looks up the `Share` document by the provided `shareId`, fetches the associated `Content`, and returns a projection that hides internal fields such as `userId`, timestamps, `isShare`, and `shareId`.

## Frontend architecture

### Tech stack and project layout

- React + TypeScript app built with Vite, located under `frontend/`.
- TypeScript config (`frontend/tsconfig.json`) defines the alias `@/*` → `frontend/src/*` for cleaner imports.
- Major directories under `frontend/src/`:
  - `pages/` – top‑level screens (login, signup, dashboard, landing, share page, etc.).
  - `components/` – reusable UI primitives and layout components (including `Navbar`, `Hero`, `PrivateRoute`, etc.).
  - `context/` – React context providers such as authentication.
  - `services/` – HTTP client and API helpers.
  - `hooks/`, `lib/`, `assets/` – custom hooks, utilities, and static assets.

### Application entry and routing

- `frontend/src/main.tsx`:
  - Bootstraps React with `StrictMode`.
  - Wraps the app in `AuthProvider` (from `context/AuthContext.tsx`).
  - Mounts the `react-hot-toast` `Toaster` for global notifications.
- `frontend/src/App.tsx`:
  - Configures routes using `react-router-dom`:
    - `/login` and `/signup` redirect to `/dashboard` if a user is already logged in.
    - `/dashboard` is wrapped in `PrivateRoute` and rendered only for authenticated users.
    - `/share/content/:shareId` displays public shareable content.
    - `/*` routes unauthenticated users to `Login` or redirects authenticated users to `/dashboard`.

### Authentication and state

- `frontend/src/context/AuthContext.tsx`:
  - Maintains a `user` object with `{ name, username, email, _id }` in React state.
  - Initializes state from `localStorage.getItem('user')` if present.
  - Persists changes by writing/removing `user` in `localStorage` via an effect.
  - Exposes `useAuth()` hook; throws if used outside `AuthProvider`.
- `Login` page (`frontend/src/pages/Login.tsx`):
  - Calls `loginApi` from `@/services/api/auth` on submit.
  - On success, updates the `AuthContext` user, mirrors it to `localStorage`, and navigates to `/dashboard`.

### API layer and backend integration

- `frontend/src/services/http.ts` defines a shared Axios instance `http`:
  - `baseURL`: `https://braincache-vdfm.onrender.com/api/v1`.
  - `withCredentials: true` so cookies from the backend are included.
  - Default `Content-Type` and `Accept` headers set to `application/json`.
  - Request interceptor:
    - Logs method, URL, params, and data.
    - Reads `accessToken` from `localStorage` and, if present, sets `Authorization: Bearer <token>`.
  - Response interceptor:
    - Logs responses and structures error logging (including network errors and timeouts).
- Higher‑level API helpers (e.g., `@/services/api/auth`, `@/services/api/content`) build on this `http` instance and are used by pages like `Dashboard` and `Login`.

### UI composition

- `Dashboard` (`frontend/src/pages/Dashboard.tsx`):
  - Fetches authenticated user content via `getContentApi()` and stores it in local state.
  - Renders `SideBar` and a grid of `Card` components representing individual content items.
  - Uses callbacks (`onShare`, `onUnshare`, `onDelete`) to keep UI state in sync with backend operations.
  - Uses `AddContentModal` to append new content to the local list after successful creation.
- `LandingPage` (`frontend/src/pages/LandingPage.tsx`) composes `Navbar` and `Hero` for the marketing/landing experience.

## Local development notes

- **CORS and origins**:
  - Backend CORS origin is currently set in `backend/src/app.ts` to `https://brain-cache-dev-garg.vercel.app` and does not reference `CORS_ORIGIN` from config.
  - For local development (e.g., Vite at `http://localhost:5173`), you may need to adjust this origin for requests to succeed from the local frontend.
- **Share links**:
  - `shareContent` in `backend/src/controllers/content.controller.ts` builds share URLs targeting the deployed frontend (`https://brain-cache-dev-garg.vercel.app/share/content/<slug>`).
  - When changing domains or environments, keep this in sync with the frontend route `/share/content/:shareId`.
- **Environment file location**:
  - The server expects environment variables in `backend/env` by default. If you change this convention, update the `dotenv.config({ path: "./env" })` call in `backend/src/index.ts` accordingly.
