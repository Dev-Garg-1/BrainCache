# BrainCache Backend

This is the backend API for BrainCache, a personal "second brain" where users can save useful links (articles, tweets, YouTube videos, etc.), manage them in a dashboard, and generate shareable public links.

The backend is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** using **Mongoose**.

---

## Screenshots

- `![Postman Screens](./screenshots/postman-login.png)`
- `![Postman Screens](./screenshots/postman-cookie.png)`
- `![Postman Screens](./screenshots/postman-getContent.png)`

---

## Project structure

Key directories under `backend/src/`:

- `index.ts` – process entrypoint: loads env, connects to MongoDB, and starts the Express app
- `app.ts` – Express app setup (CORS, JSON parsing, cookies, and route mounting)
- `config/`
  - `config.ts` – reads environment variables (`MONGODB_URI`, `DB_NAME`, JWT secrets/expiries, `CORS_ORIGIN`, `PORT`)
- `db/`
  - `index.ts` – MongoDB connection logic using `mongoose.connect`
- `models/`
  - `user.model.ts` – user schema with password hashing and JWT helper methods
  - `content.model.ts` – saved content (title, link, description, owner, share metadata)
  - `share.model.ts` – mapping between `Content` documents and generated share IDs
- `controllers/`
  - `user.controller.ts` – signup, login, logout, token handling
  - `content.controller.ts` – add/update/delete/list content, share/unshare logic, fetch by share ID
- `routes/`
  - `user.routes.ts` – `/api/v1/auth` endpoints
  - `content.routes.ts` – `/api/v1/content` endpoints
- `middlewares/`
  - `auth.middleware.ts` – verifies access tokens (cookie or `Authorization` header) and attaches `req.user`
- `utils/`
  - `asyncHandler.ts` – wrapper for async route handlers
  - `apiResponse.ts` – standard API response envelope
  - `interfaces.ts` – shared TypeScript interfaces for models and DTOs

---

## Environment configuration

Required variables:

- `MONGODB_URI` – MongoDB connection string (without DB name), e.g. `mongodb://localhost:27017`
- `DB_NAME` – database name, e.g. `braincache`
- `ACCESS_TOKEN_SECRET` – secret for signing access JWTs
- `ACCESS_TOKEN_EXPIRY` – access token lifetime (e.g. `1d`)
- `REFRESH_TOKEN_SECRET` – secret for signing refresh JWTs
- `REFRESH_TOKEN_EXPIRY` – refresh token lifetime (e.g. `7d`)
- `CORS_ORIGIN` – allowed frontend origin (e.g. production frontend URL)
- `PORT` – port for the API server (e.g. `8000`)

Create `backend/.env` and populate these values before starting the server.

> Note: `backend/src/app.ts` currently hard-codes a CORS origin. If you are developing locally, you may need to update this file or make it use `CORS_ORIGIN` so that the frontend at `http://localhost:5173` can reach the API.

---

## Scripts

From the `backend/` directory:

- `npm install` – install dependencies
- `npm run dev` – compile TypeScript (`tsc -b`) then start the server with `node -r dotenv/config dist/index.js`
- `npm run build` – compile TypeScript into `dist/`
- `npm start` – run the pre-built server from `dist/index.js`

---

## Running locally

1. Ensure MongoDB is running and accessible via `MONGODB_URI`/`DB_NAME`.
2. In `backend/`, create the `.env` file with the required variables.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server in development mode:

   ```bash
   npm run dev
   ```

By default the server listens on the `PORT` from `env` (e.g. `8000`).

---

## API overview

Base URL (typical local setup):

- `http://localhost:8000/api/v1`

### Auth endpoints (`/api/v1/auth`)

- `POST /signup`
  - Register a new user with `username`, `email`, `password`, `name`.
- `POST /login`
  - Log in with `email` and `password`.
  - On success, sets `accessToken` and `refreshToken` cookies and returns user data plus tokens.
- `POST /logout`
  - Protected route.
  - Clears the user's `refreshToken` field and removes auth cookies.

### Content endpoints (`/api/v1/content`)

All except `getSharedContent` are protected by `verifyJWT`:

- `POST /add`
  - Add a new content item for the logged-in user (title, link, optional description).
- `POST /delete`
  - Delete a content item by ID; enforces that the item belongs to the logged-in user.
- `GET /get`
  - Fetch all content items for the logged-in user.
- `PATCH /update`
  - Update title/link/description for an existing content item; enforces ownership.
- `POST /share`
  - Mark a content item as shared.
  - Generates a UUID-based share URL pointing at the frontend share route.
  - Uses a Mongoose session/transaction to update the `Content` document and create a `Share` record.
- `POST /unshare`
  - Reverse the `share` operation: mark content as not shared and remove the corresponding `Share` record (also transactional).
- `POST /getSharedContent`
  - Public endpoint.
  - Accepts a `shareId`, validates it, and returns a sanitized view of the associated content (hiding internal fields like `userId`, timestamps, and share flags).

---

## How this fits the product idea

- When a user finds a useful link online, instead of sending it to themselves on WhatsApp, they can save it through the BrainCache frontend.
- The backend persists each saved item in MongoDB, associating it with the user.
- Users can later fetch their entire list of saved content from the `/get` endpoint (surfaced in the dashboard UI).
- Share endpoints allow them to generate public links to individual items for others to view.
- A future **search** feature can be implemented by extending the content queries (e.g. by title/description/link) so users can retrieve links they saved some time ago.

