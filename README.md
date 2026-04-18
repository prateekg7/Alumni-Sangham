# Alumni Sangham

Alumni Sangham is a full-stack alumni network platform for IIT Patna. It gives students, alumni, and admins a shared space to discover people, manage profiles, send structured referral requests, publish jobs and stories, and keep the community active beyond one-off introductions.

## Table of Contents

- [What the project does](#what-the-project-does)
- [Why the project is useful](#why-the-project-is-useful)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [How users can get started](#how-users-can-get-started)
- [Usage examples](#usage-examples)
- [Where users can get help](#where-users-can-get-help)
- [Who maintains and contributes](#who-maintains-and-contributes)

## What the project does

Alumni Sangham combines a React frontend and an Express/MongoDB backend to support the core workflows of a modern alumni community:

- Role-aware onboarding for students and alumni, with OTP-based verification and password reset flows.
- Public and private profiles, including resume uploads and role-specific profile fields.
- A searchable alumni directory with filters for location, domain, and referral openness.
- Referral request workflows so students can send structured asks and alumni can review incoming requests.
- A content layer for blogs, jobs, and discussion posts to keep the network active between direct requests.
- Notifications, Hall of Fame entries, and admin-facing college record verification routes.

## Why the project is useful

- It centralizes alumni discovery instead of scattering networking across spreadsheets, DMs, and informal groups.
- It makes referral requests more actionable by attaching profile context and resume visibility to the request flow.
- It supports both relationship-building and content-sharing, so the platform stays useful even when users are not actively asking for help.
- It keeps the experience role-aware: students, alumni, and admins each have different responsibilities and surfaces.
- It includes seed and smoke-test scripts, which makes local onboarding much easier for new contributors.

## Tech stack

### Frontend

- React 19
- Vite 8
- React Router 7
- Tailwind CSS
- Framer Motion, GSAP, OGL, Lucide, Font Awesome

### Backend

- Node.js with Express 5
- MongoDB with Mongoose
- JWT-based auth with refresh-token flow
- Nodemailer for OTP emails
- Multer for resume uploads

## Repository layout

```text
.
├── backend/                  # Express API, MongoDB models, seed and smoke scripts
│   ├── scripts/
│   └── src/
│       ├── config/
│       ├── middlewares/
│       ├── modules/
│       └── utils/
├── frontend/                 # Vite + React client
│   ├── public/
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── lib/
│       └── pages/
└── README.md
```

Useful entry points:

- Frontend routes: [`frontend/src/App.jsx`](frontend/src/App.jsx)
- Frontend API client: [`frontend/src/lib/api.js`](frontend/src/lib/api.js)
- Backend app wiring: [`backend/src/app.js`](backend/src/app.js)
- Backend environment config: [`backend/src/config/env.js`](backend/src/config/env.js)

## How users can get started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB instance

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure the backend environment

Create `backend/.env` with the required values below:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/alumni-network
JWT_SECRET=replace-with-a-long-random-string
JWT_REFRESH_SECRET=replace-with-a-second-long-random-string

# Optional in development; useful in production for credentialed requests
CORS_ORIGIN=http://127.0.0.1:5173,http://127.0.0.1:5174

# Optional mail config for OTP emails
SMTP_SERVICE=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SMTP_FROM_NAME=Alumni Sangham
```

Notes:

- `MONGO_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` are required for the backend to start.
- If SMTP is not configured, OTPs are logged to the backend console in development instead of being emailed.
- The backend listens on port `8000` by default.

### 3. Start the backend

```bash
cd backend
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Open the app at `http://127.0.0.1:5173`. If that port is already in use, Vite will automatically choose the next available port, typically `5174`.

Local development does not require a frontend `.env` file if you use the default Vite proxy. The frontend proxies `/api` and `/uploads` to `http://127.0.0.1:8000`.

If you need to point the frontend at a different backend, create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 5. Seed demo data (optional)

The backend includes a seed script for demo alumni, Hall of Fame entries, notifications, and posts.

```bash
cd backend
npm run seed
```

Optional seed variable:

```env
SEED_DEMO_PASSWORD=Demo@1234
```

### 6. Run the smoke test (optional)

The backend includes a lightweight integration smoke test that exercises registration, login, `/me`, and the directory endpoint.

```bash
cd backend
npm run smoke
```

The smoke test expects the backend to already be running. You can override the default API base with:

```env
SMOKE_BASE_URL=http://127.0.0.1:8000
```

## Usage examples

### Check the API health endpoint

```bash
curl http://127.0.0.1:8000/
```

### Fetch directory entries

```bash
curl http://127.0.0.1:8000/api/directory
```

### Typical local development loop

1. Start MongoDB.
2. Run `npm run dev` in `backend/`.
3. Run `npm run dev` in `frontend/`.
4. Optionally run `npm run seed` in `backend/`.
5. Visit the landing page, register as a student or alumni user, then explore the dashboard, directory, profile, blog, and referral flows.

## Where users can get help

Start with the source files that define the main platform behavior:

- [`backend/src/app.js`](backend/src/app.js) for mounted API modules and route groups
- [`backend/scripts/smoke-test.js`](backend/scripts/smoke-test.js) for a minimal end-to-end verification path
- [`backend/scripts/seed.js`](backend/scripts/seed.js) for demo data setup
- [`frontend/src/App.jsx`](frontend/src/App.jsx) for route structure
- [`frontend/src/lib/api.js`](frontend/src/lib/api.js) for client-side API calls and auth token handling
- [`CONTRIBUTING.md`](CONTRIBUTING.md) for contributor workflow expectations

If you need help beyond the local docs, open an issue or a pull request in this repository so the discussion stays close to the code.

## Who maintains and contributes

This project is maintained by the repository owner and active contributors to the Alumni Sangham codebase.

Recent contributors visible in the git history include:

- `prateekg7`
- `Ansh1084`
- `Prateek Gupta`
- `Vaibhavi Parmar`
- `Naksh2006`
- `Vaishanvy-dot`
- `Vaishnavy`
- `Nakshtra Goyal`

To contribute:

- Read [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Keep pull requests focused and easy to review
- Run the relevant local checks before opening a PR
- Include screenshots or short recordings for UI changes when possible
