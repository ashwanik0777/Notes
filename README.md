# 📝 Notes App

A robust, full-stack, and modern note-taking application designed for simplicity and productivity. Create, manage, and instantly access your personal notes—anywhere, anytime.

[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)](https://nextjs.org/)
[![MongoDB Ready](https://img.shields.io/badge/MongoDB-ready-brightgreen?logo=mongodb)](https://mongodb.com/)
[![License: Contact Owner](https://img.shields.io/badge/license-contact%20owner-lightgrey.svg)]()

---

## 🚀 Overview

**Notes** is a feature-rich, type-safe application that empowers individual users to securely create, view, and manage their notes. Built with best practices in mind, it boasts a modern UI, flexible authentication (OTP & Google OAuth-ready), and a backend that seamlessly switches between in-memory and MongoDB storage.

---

## ✨ Features

- **Secure Authentication:** Email + OTP login (Google OAuth pluggable)
- **Personal Note Management:** Create, display, and delete notes, always tied to your personal account
- **Modern, Responsive UI:** Built with React (Next.js) and elegant UI components
- **Real-Time Updates:** SWR integration for instant note changes
- **Production-Ready Backend:** Express.js server, JWT-secured APIs, robust error handling
- **Flexible Storage:** In-memory DB for dev & testing, MongoDB for production
- **TypeScript Everywhere:** Type safety and clear interfaces throughout the stack

---

## 🏛️ Architecture

```
Frontend (Next.js/React)
  │
  ├─> API Routes (Next.js) <─────┐
  │                              │
  └────────────┬─────────────────┘
               │
        Express.js Server (Node.js)
               │
       Repository Layer (InMemory/MongoDB)
               │
      Database (InMemory or MongoDB)
```

- **Frontend:** Next.js app with modern React components and API routes
- **Backend:** Express.js REST API, modular with easy repository swapping
- **Data Layer:** In-memory for local/dev; MongoDB for scaling up
- **Authentication:** JWT-based, HTTP-only cookies, OTP flow, Google OAuth-ready

---

## 📂 Project Structure

```
.
├── app/                # Next.js app (dashboard, API routes)
│   └── dashboard/      # Notes UI client (React)
│   └── api/            # Next.js API routes (alternative to Express)
├── client/             # (Optional) Legacy/alt frontend (React + Vite)
├── components/         # Shared React UI components
├── server/             # Express backend
│   └── src/
│       ├── repositories/   # InMemory & MongoDB repositories
│       ├── routes/         # Express route modules
│       ├── types/          # Shared TS types/interfaces
│       └── config.ts       # App/server config
├── package.json
└── README.md
```

---

## 🖥️ Demo Preview

> _Coming soon: Live demo & screenshots!_

---

## 🔑 Authentication & Security

- **OTP-Based Auth:** Simple and secure. Sign up or sign in with your email—receive a one-time password.
- **JWT Tokens:** All API calls require authentication; tokens are stored in HTTP-only cookies for safety.
- **Google OAuth:** Ready to enable—just set environment variables.

---

## 📋 API Documentation

### Auth Endpoints

- `POST /auth/request-otp` — Request OTP code (signup/signin)
- `POST /auth/verify-otp` — Validate OTP and receive JWT

### Notes Endpoints

- `GET /notes` — Fetch your notes (authenticated)
- `POST /notes` — Create a new note (`{ content }`)
- `DELETE /notes/:id` — Delete a note by its ID

#### Example Note Object

```json
{
  "id": "note-uuid",
  "content": "This is a note",
  "createdAt": "2025-09-03T14:22:05Z"
}
```

---

## ⚙️ Configuration

Create a `.env` file in the root. Example variables:

| Variable                | Description                  | Default                         |
|-------------------------|------------------------------|---------------------------------|
| `PORT`                  | Express server port          | `4000`                          |
| `JWT_SECRET`            | JWT signing key              | `dev_jwt_secret_change_me`      |
| `APP_URL`               | Frontend URL                 | `http://localhost:5173`         |
| `SERVER_URL`            | Backend URL                  | `http://localhost:4000`         |
| `MONGO_URI`             | MongoDB URI                  | (empty = in-memory mode)        |
| `GOOGLE_CLIENT_ID`      | Google OAuth Client ID       | (optional)                      |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth Client Secret   | (optional)                      |
| `NODE_ENV`              | App environment              | `development`                   |

---

## 🏁 Getting Started

### Prerequisites

- Node.js v18+
- npm
- (Optional) MongoDB instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashwanik0777/Notes.git
   cd Notes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Adjust variables as needed

4. **Run the backend (Express):**
   ```bash
   cd server
   npm run dev
   ```

5. **Run the frontend (Next.js):**
   ```bash
   npm run dev
   ```

6. **Access the app:**
   - Visit [http://localhost:5173](http://localhost:5173) (or your `APP_URL`)

---

## 🧑‍💻 Contribution Guidelines

- Fork the repo & create your branch from `main`
- Follow code style and TypeScript best practices
- Add tests for new features or bug fixes if possible
- Open a pull request with a clear description

---

## 💬 Support & Contact

- Open an [issue](https://github.com/ashwanik0777/Notes/issues) for bugs & suggestions
- Contact the repository owner for licensing or other questions

---

## 📄 License

_This project is currently not licensed. Please contact the repository owner for details._

---

## 👤 Author

**ashwanik0777**  
[GitHub Profile →](https://github.com/ashwanik0777)

---