# Car Dealership Inventory System (AutoDrive)

AutoDrive is a full-stack, single-page application (SPA) built for managing a premium car dealership's inventory. It serves as a modern, high-contrast platform for users to view available vehicles and for administrators to manage stock, pricing, and vehicle details.

## Project Explanation

The application allows users to browse a real-time list of cars, search by make, model, category, or price, and securely log in. Authenticated users can "purchase" vehicles, which automatically decreases the inventory stock. Admin users possess elevated privileges allowing them to add new vehicles, edit existing vehicle information, delete entries, and restock units directly from the dashboard. 
# Car Dealership Inventory System (AutoDrive)

AutoDrive is a full-stack, single-page application (SPA) built for managing a premium car dealership's inventory. It serves as a modern, high-contrast platform for users to view available vehicles and for administrators to manage stock, pricing, and vehicle details.

## Project Explanation

The application allows users to browse a real-time list of cars, search by make, model, category, or price, and securely log in. Authenticated users can "purchase" vehicles, which automatically decreases the inventory stock. Admin users possess elevated privileges allowing them to add new vehicles, edit existing vehicle information, delete entries, and restock units directly from the dashboard. 

### Technology Stack
- **Frontend:** React, HTML5, CSS3 (with custom pure CSS for a bespoke premium black/gold aesthetic), Vite.
- **Backend / Database:** Node.js, Express, and MongoDB. The custom backend serves a secure RESTful API with token-based user authentication (JWT). Vehicle images are encoded as Base64 strings and stored directly within MongoDB documents.

---

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- A MongoDB cluster (e.g., MongoDB Atlas) or a local MongoDB server.

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/tajinder102005/mern_carbub.git
   cd mern_carbub/backend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory with your MongoDB connection string and JWT secrets:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   FRONTEND_URL=http://localhost:5174
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory from the project root:
   ```bash
   cd ../frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory (if needed):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Screenshots
*(Please replace these placeholders with actual screenshots of the final application)*
- **Landing Page:** `[Screenshot Placeholder]`
- **Authentication (Login/Register):** `[Screenshot Placeholder]`
- **Admin Dashboard (Inventory Management):** `[Screenshot Placeholder]`
- **Real-Time Search & Filter:** `[Screenshot Placeholder]`

---

## My AI Usage

### AI Tools Used
- **Google Gemini / Antigravity Agent:** Used as the primary AI coding assistant throughout the development lifecycle within the IDE.

### How I Used Them
- **UI/UX Design Generation:** I used the AI to generate a highly premium, black-and-gold color scheme. I prompted it to implement specific glassmorphism effects and fix alignment issues to match professional mockups.
- **Refactoring & State Management:** I asked the AI to refactor my standard inputs into a dynamic React dropdown filter. I also used it to implement optimistic UI updates, so the dashboard wouldn't flicker when purchasing or restocking vehicles.
- **Backend RPC Logic:** I utilized the AI to write PostgreSQL RPC functions for atomic database operations (`purchase_vehicle` and `restock_vehicle`), ensuring race conditions wouldn't occur when multiple users attempt to purchase a car simultaneously.

### Reflection on AI Impact
Using an AI assistant drastically accelerated the development workflow. Instead of spending hours debugging CSS flexbox alignments or writing boilerplate SQL queries, I could describe my intent and the AI handled the boilerplate. It allowed me to focus heavily on the *architecture* and *user experience* rather than getting bogged down in syntax. It reinforced the importance of writing clear, precise prompts, as the AI's output is directly proportional to the clarity of the instructions provided.

---

## Test Report

Below is the summary of the test suite execution covering the core application logic, component rendering, and API interactions.

```text
 PASS  tests/auth.test.js
  ✓ should register a new user successfully (45 ms)
  ✓ should login an existing user and return a JWT token (32 ms)
  ✓ should reject login with invalid credentials (12 ms)

 PASS  tests/vehicles.test.js
  ✓ should fetch all available vehicles (28 ms)
  ✓ should filter vehicles by make and category (21 ms)
  ✓ should update vehicle details (Admin) (34 ms)
  ✓ should delete a vehicle (Admin) (29 ms)

 PASS  tests/inventory.test.js
  ✓ should decrease vehicle quantity on successful purchase (38 ms)
  ✓ should fail purchase if quantity is zero (15 ms)
  ✓ should increase vehicle quantity on restock (Admin) (31 ms)

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        1.45 s
Ran all test suites.
```



<img width="1881" height="970" alt="image" src="https://github.com/user-attachments/assets/985ea7ad-dc68-4e54-9ef5-d6ad1382ab95" />

<img width="1722" height="922" alt="image" src="https://github.com/user-attachments/assets/262b86c6-10b6-40cd-9b97-95cecb74dd16" />

<img width="1897" height="945" alt="image" src="https://github.com/user-attachments/assets/b4322cc6-c944-4b70-9162-587470dbc8b3" />

<img width="1897" height="966" alt="image" src="https://github.com/user-attachments/assets/27fedca3-a44f-4189-958e-1979d92dfd78" />

<img width="1896" height="960" alt="image" src="https://github.com/user-attachments/assets/e80e514f-70bb-409b-8052-2d4ccd32c25d" />

<img width="1851" height="982" alt="image" src="https://github.com/user-attachments/assets/48d07192-a010-46c0-9f41-34392cfcf3a4" />






