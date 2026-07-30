# AI Chat History (PROMPTS.md)

This file contains the sequential prompt segments used to build the Car Dealership Inventory System.

## Phase 1: Base Project Scaffolding
**Prompt:**
> Scaffold the Express backend and Vite React frontend structures. Setup `package.json` for both, configure Tailwind CSS for the frontend, and add a `.gitignore` to keep credentials secure.

---

## Phase 2: Mongoose Database Connection & Models Setup
**Prompt:**
> Create the database connection utility and write the Mongoose models: `User` (name, email, password, role) and `Vehicle` (make, model, category, price, quantity). Abstract the database configuration.

---

## Phase 3: Register & Login API Endpoints
**Prompt:**
> Implement `POST /api/auth/register` and `POST /api/auth/login` on the backend. Use `bcrypt` to hash passwords and return JWT access tokens to secure user sessions. Use Zod for validation.

---

## Phase 4: Auth Middleware & Route Guards
**Prompt:**
> Implement a JWT verification middleware `protect` and an `adminOnly` check middleware to protect secure endpoints and restrict actions.

---

## Phase 5: Vehicle CRUD Routes (Protected)
**Prompt:**
> Implement `POST /api/vehicles`, `GET /api/vehicles`, and `PUT /api/vehicles/:id`. Ensure these are protected by the auth middleware.

---

## Phase 6: Admin Delete Route (Admin Restricted)
**Prompt:**
> Implement the `DELETE /api/vehicles/:id` endpoint on the backend, restricting execution strictly to users with the 'admin' role.

---

## Phase 7: Dynamic Vehicle Search & Filtering API
**Prompt:**
> Implement the `GET /api/vehicles/search` endpoint. Support searching by make, model, category, and price range filters using MongoDB query parameters.

---

## Phase 8: Purchase & Restock APIs (Inventory Management)
**Prompt:**
> Implement `POST /api/vehicles/:id/purchase` (reduces stock by 1, error if 0) and `POST /api/vehicles/:id/restock` (increases stock, Admin only).

---

## Phase 9: Frontend Axios & Interceptors Config
**Prompt:**
> Setup the frontend Axios instance with request and response interceptors to automatically append the authentication header and handle silent token refreshes.

---

## Phase 10: Frontend Auth Views (Login & Register)
**Prompt:**
> Build Login and Register pages in React using Tailwind CSS, complete with input validation and alerts.

---

## Phase 11: Frontend Catalog Dashboard & Purchase Flow
**Prompt:**
> Build the main dashboard to list all vehicles, search/filter them, and buy vehicles (disabling the purchase button when quantity is 0).

---

## Phase 12: Admin Management UI & Documentation
**Prompt:**
> Create the Admin Forms UI to add, update, and delete vehicles. Write the README.md with the detailed "My AI Usage" section.
