# Notes

A full-stack Notes application for creating, viewing, and managing personal notes. Built with TypeScript, Node.js, Express, Next.js, and MongoDB (with in-memory database support for development).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Notes** is a modern web application for managing personal notes. Users can create, view, and delete notes after authenticating. The backend supports both in-memory and MongoDB repositories, making it easy to develop locally and scale for production.

---

## Features

- User registration and login (email + OTP authentication; Google OAuth ready)
- Create, view, and delete notes per user
- RESTful and Next.js API endpoints
- In-memory database for rapid local development
- MongoDB support for production use (via Mongoose)
- JWT-based authentication with secure cookie handling
- Modular code structure with clear separation of concerns
- Responsive UI built using Next.js and React
- TypeScript throughout for type safety

---

## Architecture

This project follows a typical full-stack web application architecture:

- **Frontend:** Next.js (React), communicating with backend via API routes and endpoints.
- **Backend:** Node.js with Express, providing RESTful APIs for authentication and note management.
- **Database Layer:** Pluggable repositories (in-memory for development, MongoDB for production).
- **Authentication:** JWT tokens, secured via HTTP-only cookies.
- **State Management:** SWR (stale-while-revalidate) for fetching and updating notes in real-time.

### High-Level Flow

1. **User Authentication:** Users sign up or log in using email + OTP (or Google OAuth if configured).
2. **Notes Management:** Authenticated users can create, view, and delete their notes.
3. **Persistence:** Notes and user data are stored in either an in-memory store or a MongoDB database.

---

## Project Structure

```
.
├── app/                # Next.js app directory (frontend + API routes)
│   └── dashboard/      # Client-side dashboard (notes UI)
│   └── api/            # Next.js API routes (alternative to Express)
├── client/             # Legacy or alternative frontend (React, Vite)
│   └── src/
├── components/         # Shared React components (UI primitives)
├── server/             # Express backend (main API server)
│   └── src/
│       ├── repositories/   # Data repositories (InMemory, MongoDB)
│       ├── routes/         # Express routes (auth, notes)
│       ├── types/          # TypeScript types
│       └── config.ts       # App/server configuration
├── package.json
└── README.md
```

---

## API Endpoints

### Express Backend (`/server/src/routes/`)

- `GET /health` — Health check
- `POST /auth/verify-otp` — OTP-based authentication
- `GET /notes` — List notes for authenticated user
- `POST /notes` — Create a note (JSON: `{ content }`)
- `DELETE /notes/:id` — Delete a note by ID

### Next.js API Routes (`/app/api/notes/route.ts`)

- `GET /api/notes` — Get notes (requires authentication)
- `POST /api/notes` — Create a note
- `DELETE /api/notes/:id` — Delete a note

### Example Note Object

```json
{
  "id": "note-uuid",
  "content": "This is a note",
  "createdAt": "2025-09-03T14:22:05Z"
}
```

---

## Authentication

- **Email + OTP:** Users register or log in with their email and a one-time password sent to their inbox.
- **JWT:** Auth tokens are issued as JWTs and stored in HTTP-only cookies.
- **Google OAuth:** Ready to be enabled via environment variables.

---

## Getting Started

### Prerequisites

- Node.js v18+
- (Optional for production) MongoDB instance

### Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/ashwanik0777/Notes.git
   cd Notes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy `.env.example` to `.env` and set necessary variables (see below).

4. **Run the server and client:**
   - For Next.js:
     ```bash
     npm run dev
     ```
   - For Express backend:
     ```bash
     cd server
     npm run dev
     ```

---

## Configuration

Environment variables are managed via `.env` files.

| Variable              | Description                       | Default                      |
|-----------------------|-----------------------------------|------------------------------|
| `PORT`                | Server port                       | `4000`                       |
| `JWT_SECRET`          | JWT signing key                   | `dev_jwt_secret_change_me`   |
| `APP_URL`             | Frontend URL                      | `http://localhost:5173`      |
| `SERVER_URL`          | Backend URL                       | `http://localhost:4000`      |
| `MONGO_URI`           | MongoDB connection string         | (empty, uses in-memory)      |
| `GOOGLE_CLIENT_ID`    | Google OAuth Client ID            | (empty)                      |
| `GOOGLE_CLIENT_SECRET`| Google OAuth Client Secret        | (empty)                      |
| `NODE_ENV`            | Node environment                  | `development`                |

- By default, the backend uses an in-memory store unless `MONGO_URI` is set.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, features, or enhancements.

---

## License

This project is currently not licensed. Please contact the repository owner for more information.

---

## Author

- [ashwanik0777](https://github.com/ashwanik0777)

---