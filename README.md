# Production-Grade Authentication System

This project contains a production-grade authentication module using React (frontend) and Node.js + Express (backend), implementing professional security standards and workflows.

## Features
- **Backend structure**: routes, controllers, models, middleware, utils, and config pattern.
- **Full JWT workflow**: short-lived access token, long-lived refresh token in an HTTP-only cookie, and rotation.
- **Security features**:bcrypt password hashing, express-rate-limit, input validation with Zod, and cookies configured for security.
- **Frontend architecture**: global authentication context, route guards, automatic token refresh via Axios interceptors, responsive and animated UI with Tailwind/CSS Modules style.

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables by copying `.env.example` to `.env` and adjusting values:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: `http://localhost:5173`

---

## API Documentation

### Auth Endpoints (`/api/auth`)

| Endpoint | Method | Auth | Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/register` | POST | Public | `name`, `email`, `password` | `{ success, message, data }` | Creates a new user and logs verification link. |
| `/login` | POST | Public | `email`, `password` | `{ success, message, data }` | Validates credentials and sets HTTP-only cookie. |
| `/logout` | POST | Public | - | `{ success, message, data }` | Clears credentials from database and cookie. |
| `/refresh-token`| POST | Public | - | `{ success, message, data }` | Rotates refresh token & issues new access token. |
| `/verify-email` | GET | Public | query: `token` | `{ success, message, data }` | Verifies user's registration. |
| `/forgot-password`|POST | Public | `email` | `{ success, message, data }` | Requests recovery mail/log. |
| `/reset-password`| POST | Public | `token`, `password` | `{ success, message, data }` | Resets password and revokes previous tokens. |

### Protected API Resource
- **Endpoint**: `/api/protected`
- **Method**: GET
- **Auth**: Protected (Requires Bearer Token in `Authorization` Header)
