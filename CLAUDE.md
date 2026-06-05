# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ThreadHive** is a full-stack Reddit-like discussion forum with user auth, subreddits, threads, comments, and voting. It is a monorepo with separate `threadhive-backend/` and `threadhive-frontend/` packages. An AI feature layer using the Gemini API (thread summarization, text rephrasing) is planned — see `resources/prompts.md`.

## Commands

### Backend (`threadhive-backend/`)

```bash
npm run dev        # Start with nodemon hot-reload (development)
npm start          # Start production server (node main.js)
npm test           # Run all tests with vitest
npm run populate   # Seed MongoDB with sample data
```

### Frontend (`threadhive-frontend/`)

```bash
npm run dev            # Start Vite dev server
npm run build          # Production build
npm test               # Run all tests with vitest
npm run test:ui        # Interactive vitest UI
npm run test:coverage  # Coverage report
```

### Running a single test file

```bash
# From the relevant package directory
npx vitest run tests/unit/someFile.test.js
```

## Architecture

### Backend (`threadhive-backend/`)

Express.js + MongoDB (Atlas via Mongoose). Entry point is `main.js` → `server.js` → `src/app.js`.

Layered structure: routes → controllers → services → models. Business logic lives in `src/services/`; controllers are thin request/response handlers. Errors are normalized via `src/utils/createAppError.js` and caught by `src/middleware/errorHandler.js`. JWT auth is enforced by `src/middleware/authHandler.js`.

### Frontend (`threadhive-frontend/`)

React 19 + Vite. State is managed entirely through Redux Toolkit slices in `src/reducers/`, combined in `src/store/store.js`. API calls go through service functions in `src/services/` using an Axios instance configured in `src/api/axiosInstance.js`. API base URLs and endpoint paths are centralized in `src/config/apiConfig.js`.

Routing uses React Router v7. Protected routes are wrapped with `src/components/PrivateRoute/PrivateRoute.jsx`.

### Testing

Backend tests use Vitest + Supertest + mongodb-memory-server (in-memory MongoDB — no Atlas connection needed for tests). Test timeout is 60s to accommodate memory server startup.

Frontend tests use Vitest + React Testing Library + MSW (Mock Service Worker) for API mocking. Mock handlers and test data live in `tests/mocks/`.

### Key Environment Variables (backend `.env`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default 5000) |
| `JWT_SECRET` | Token signing secret |
| `JWT_EXPIRATION` | Token lifetime (e.g. `7d`) |
| `GEMINI_API_KEY` | Google Gemini API for AI features |

## Planned AI Features

Two features are defined in `resources/prompts.md` and not yet implemented:

1. **Thread Summarization** — a "Summarize" button on thread pages that calls the backend Gemini API to summarize the thread title, content, and top comments.
2. **Text Rephrasing** — "Rephrase with AI" buttons in the thread creation form and comment form, with accept/reject UI that preserves original text on rejection.

Both features should call Gemini on the backend (not directly from the frontend) and include loading states and error handling.
