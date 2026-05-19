# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A watch e-commerce platform consisting of three separate sub-projects managed as a monorepo:

- **`frontend/`** — Customer-facing React storefront (React 19, Vite, Firebase Auth)
- **`backend/`** — Express REST API (Node.js, Express 5, MongoDB/Mongoose)
- **`admin/`** — Admin dashboard (React 19 + TypeScript, TailAdmin template, Vite, Tailwind CSS v4)

## Commands

All commands are run from the repo root unless specified.

### Running everything together
```bash
npm run dev        # Starts backend, frontend, and admin concurrently
```

### Running individually
```bash
npm run backend    # nodemon index.js on http://localhost:5000
npm run frontend   # Vite dev server
npm run admin      # Vite dev server (TypeScript)
```

### Building
```bash
npm run build      # Builds frontend only
cd admin && npm run build   # tsc -b && vite build
```

### Linting
```bash
cd frontend && npm run lint
cd admin && npm run lint
```

## Architecture

### Backend (`backend/`)

Express 5 REST API with ES modules (`"type": "module"`). Entry point is `index.js`.

- **`config/db.js`** — Mongoose connection, reads `MONGO_URI` from `.env`
- **`models/`** — Mongoose schemas: `Brand`, `Category`, `Product`, `Counter`
- **`controllers/`** — Business logic per resource
- **`routes/`** — Route files named `*.route.js`, mounted at `/api/brands`, `/api/categories`, `/api/products`

The `Product` model uses a `variantSchema` (sub-document) with fields: `variantId`, `color`, `size`, `stock`, `price`, `mode`, `images`, `featured`, `case`. At least one variant is required per product.

### Frontend (`frontend/src/`)

React 19 SPA with Firebase Authentication. No TypeScript.

- **`auth/`** — `AuthProvider.jsx` (context with `user`, `isAdmin`, `isLoading`), `RequireAuth.jsx`, `PublicOnly.jsx`. Admin status is derived from a Firebase custom claim (`idTokenResult.claims.admin === true`).
- **`components/firebase.js`** — Firebase config; exports `auth`, `googleProvider`, `githubProvider`, `facebookProvider`
- **`layouts/`** — `RootLayout`, `AuthLayout`
- **`pages/`** — `Homepage`, `Shop`, `SignInPage`, `SignUpPage`, `ForgotPasswordPage`, `ResetPasswordPage`
- Routing uses `react-router-dom` v7 with `createBrowserRouter`. Auth-gated routes use `RequireAuth`; guest-only routes use `PublicOnly`.

### Admin (`admin/src/`)

TypeScript React dashboard based on TailAdmin template. Uses `react-router` (not `react-router-dom`).

- **`api/axios.ts`** — Axios instance with `baseURL` from `VITE_API_URL` env var (defaults to `http://localhost:5000`)
- **`api/`** — Per-resource API modules: `productApi.ts`, `brandApi.ts`, `categoryApi.ts`
- **`types/`** — TypeScript type definitions
- **`pages/Products.tsx`** — Main products management page
- **`layout/AppLayout`** — Wraps all dashboard routes; auth pages (`/signin`, `/signup`) are outside this layout

## Environment Variables

**`backend/.env`**
```
MONGO_URI=<mongodb connection string>
PORT=5000
```

**`admin/.env`**
```
VITE_API_URL=http://localhost:5000
```

**`frontend/.env`** — Firebase config is hardcoded in `components/firebase.js` (project: `watch-shop-g1`).

## Key Conventions

- Backend uses ES module syntax (`import`/`export`) throughout
- Admin is TypeScript; frontend is plain JavaScript
- Admin API calls go through `admin/src/api/axios.ts` — always use this instance, not raw `axios`
- Products have variants as sub-documents; you cannot create a product without at least one variant
