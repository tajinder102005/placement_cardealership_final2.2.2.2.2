# Car Dealership Inventory System (AutoDrive)

AutoDrive is a full-stack, single-page application (SPA) built for managing a premium car dealership's inventory. It serves as a modern, high-contrast platform for users to view available vehicles and for administrators to manage stock, pricing, and vehicle details.

## Project Explanation

The application allows users to browse a real-time list of cars, search by make, model, category, or price, and securely log in. Authenticated users can "purchase" vehicles, which automatically decreases the inventory stock. Admin users possess elevated privileges allowing them to add new vehicles, edit existing vehicle information, delete entries, and restock units directly from the dashboard. 

### Technology Stack
- **Frontend:** React, HTML5, CSS3 (with custom pure CSS for a bespoke premium black/gold aesthetic), Vite.
- **Backend / Database:** Supabase (PostgreSQL) acting as a secure RESTful API and BaaS. Supabase Auth is used for token-based user authentication (JWT), and Supabase Storage is utilized for handling vehicle image uploads.

---

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- A Supabase Account

### Backend (Supabase) Setup
1. Create a new project in [Supabase](https://supabase.com/).
2. Run the following SQL script in the Supabase SQL Editor to create the `vehicles` table:
   ```sql
   CREATE TABLE vehicles (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       make TEXT NOT NULL,
       model TEXT NOT NULL,
       category TEXT,
       year INTEGER,
       price NUMERIC,
       quantity INTEGER DEFAULT 1,
       description TEXT,
       image_url TEXT,
       created_by UUID REFERENCES auth.users(id),
       created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
3. Set up two RPC functions (`purchase_vehicle` and `restock_vehicle`) in the SQL editor to safely increment/decrement stock:
   ```sql
   CREATE OR REPLACE FUNCTION purchase_vehicle(_vehicle_id UUID, _quantity INT) RETURNS VOID AS $$
   BEGIN
     UPDATE vehicles SET quantity = quantity - _quantity WHERE id = _vehicle_id AND quantity >= _quantity;
   END;
   $$ LANGUAGE plpgsql;

   CREATE OR REPLACE FUNCTION restock_vehicle(_vehicle_id UUID, _quantity INT) RETURNS VOID AS $$
   BEGIN
     UPDATE vehicles SET quantity = quantity + _quantity WHERE id = _vehicle_id;
   END;
   $$ LANGUAGE plpgsql;
   ```
4. Create a public storage bucket named `vehicle-images`.

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/tajinder102005/placement_cardealership_final2.2.2.2.2.git
   cd placement_cardealership_final2.2.2.2.2/frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory with your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Start the development server:
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
