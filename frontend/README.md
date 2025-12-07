# BrainCache Frontend

This is the frontend single-page application (SPA) for BrainCache, a personal "second brain" for storing useful links (articles, tweets, videos, etc.) in one place instead of sending them to yourself on WhatsApp.

The app is built with **React**, **TypeScript**, and **Vite**.

## Project structure (high level)

Key pieces under `frontend/src/`:

- `main.tsx`
  - React entrypoint
  - Wraps the app in `AuthProvider` and renders `App`
  - Mounts `react-hot-toast`'s `Toaster` for notifications
- `App.tsx`
  - Configures routing with `react-router-dom`:
    - `/login` – login page
    - `/signup` – sign-up page
    - `/dashboard` – main authenticated dashboard (wrapped in `PrivateRoute`)
    - `/share/content/:shareId` – public read-only view for a shared item
    - `/*` – default route that sends unauthenticated users to login, and authenticated users to `/dashboard`
- `context/AuthContext.tsx`
  - Holds the current user (`{ name, username, email, _id }`) in React state
  - Initializes from `localStorage.getItem('user')`
  - Persists updates back to `localStorage`
  - Exposes a `useAuth()` hook; throws if used outside `AuthProvider`
- `services/http.ts`
  - Shared Axios instance configured with:
    - `baseURL` pointing at the deployed backend API
    - `withCredentials: true` so cookies are sent/received
    - Request interceptor that logs requests and attaches `Authorization: Bearer <accessToken>` from `localStorage`
    - Response interceptor that logs responses and surfaces network/time-out error details
- `pages/`
  - `Login.tsx` – login form, calls the auth API, stores the user in context + `localStorage`, navigates to `/dashboard`
  - `Signup.tsx` – user registration flow (paired with backend `/signup`)
  - `Dashboard.tsx` – core experience for browsing saved content, sharing/unsharing, and deleting items
  - `AddContentModal.tsx` – modal used by the dashboard to add new content items
  - `ShareContent.tsx` – uses the `shareId` route parameter to render a public read-only view of a shared item
  - `LandingPage.tsx` – marketing/landing page combining `Navbar` + `Hero`
- `components/`
  - Shared UI pieces such as navigation, hero section, auth card, and the `PrivateRoute` component that protects `/dashboard`
- `hooks/`, `lib/`
  - Custom hooks and small utility helpers

TypeScript path aliases are defined in `frontend/tsconfig.json` so `@/` resolves to `frontend/src/`.

---

## Scripts

From the `frontend/` directory:

- `npm install` – install dependencies
- `npm run dev` – start Vite dev server
- `npm run build` – type-check + production build
- `npm run lint` – run ESLint rules
- `npm run preview` – preview the production build locally

---

## Connecting to the backend

The frontend uses a shared Axios instance defined in `src/services/http.ts`:

- `baseURL` is currently set to the deployed API URL: `https://braincache-vdfm.onrender.com/api/v1`
- `withCredentials: true` so that HTTP-only cookies from the backend are sent on requests
- A request interceptor attaches `Authorization: Bearer <accessToken>` if an `accessToken` value is present in `localStorage`

If you are running the backend locally (for example at `http://localhost:8000/api/v1`), update the `baseURL` in `http.ts` accordingly.

---

## Authentication flow

1. User signs up or logs in via the backend auth endpoints (`/signup`, `/login`).
2. On successful login:
   - The backend sets `accessToken` and `refreshToken` cookies.
   - The frontend stores the returned user object in `AuthContext` and `localStorage`.
3. Subsequent requests use:
   - Cookies for backend verification
   - `Authorization: Bearer <accessToken>` header added by the Axios interceptor
4. Protected routes (`/dashboard`) are wrapped in `PrivateRoute`, which redirects to `/login` if no user is present in context.

---

## How the UI matches the product idea

- When you find a useful link online, you can log in and save it via the "Add Content" flow on the dashboard.
- Each saved item shows up in the dashboard list with its title/link/description.
- From the dashboard, you can:
  - Share an item to generate a public URL (handled via the backend share endpoints)
  - Unshare or delete items while keeping the UI in sync with server state
- The public `/share/content/:shareId` route renders a read-only view for anyone with the link.
- A future enhancement is a **search bar** on the dashboard page that would call a backend search endpoint to filter items by title, description, or link, so users can retrieve things they saved some time back.
