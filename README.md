# Car Dealership Inventory System

A production-grade, full-stack Car Dealership Inventory System built using React (frontend) and Node.js + Express (backend) with MongoDB (Mongoose) database management.

## Features
- **Secure Authentication**: JWT Access + Refresh token flow, httpOnly cookie refresh token rotation, password hashing, and custom Route Guards.
- **Vehicle Catalog**: View all vehicles, search, and dynamically filter by make, model, category, and price range.
- **Inventory Control**: Live stock management with "Purchase" operations (decrements quantity, disables button at 0) and "Restock" operations.
- **Admin Dashboard**: Form utilities for authorized administrators to add, update, restock, and delete vehicles from the catalog.

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` and set your credentials:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
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

| Endpoint | Method | Auth | Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/register` | POST | Public | `name`, `email`, `password` | Register a new account. |
| `/login` | POST | Public | `email`, `password` | Login to retrieve in-memory access token. |
| `/logout` | POST | Public | - | Invalidate session cookies and revoke tokens. |

### Vehicle Endpoints (`/api/vehicles`)

| Endpoint | Method | Auth | Body / Query | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | Protected | - | Retrieve all vehicles. |
| `/search` | GET | Protected | Query: `make`, `model`, `category`, `minPrice`, `maxPrice` | Filtered search query. |
| `/` | POST | Protected (Admin) | `make`, `model`, `category`, `price`, `quantity` | Add a new vehicle. |
| `/:id` | PUT | Protected (Admin) | `make`, `model`, `category`, `price`, `quantity` | Update vehicle specs. |
| `/:id` | DELETE | Protected (Admin) | - | Remove vehicle. |
| `/:id/purchase` | POST | Protected | - | Purchase one unit (decreases quantity by 1). |
| `/:id/restock` | POST | Protected (Admin) | `quantity` | Restocks inventory. |

---

## My AI Usage

### AI Tools Used
- **Antigravity AI IDE**: Leveraged as the primary pair-programming agent to design components, implement schemas, write validation guards, and structure consolidated Git commits.

### How it was Used
- **Scaffolding**: Used Antigravity to structure both the Express/Mongoose backend and the Vite/React frontend directories.
- **Controllers & Middlewares**: Brainstormed and implemented the JWT cookie rotation flow, password hashing pre-save hooks, and role authentication controls.
- **Consolidation**: Directed the AI to stage, organize, and commit files sequentially into 6 clean service-level commits with required git trailers.

### Reflection
The AI assistant drastically improved development velocity. By using Antigravity, we avoided manual boilerplate writing and context-switching, focusing instead on system architecture, secure endpoints validation, and clean component interactions.
